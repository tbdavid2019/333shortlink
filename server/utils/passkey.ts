import { deleteCookie, getCookie, getRequestURL, setCookie } from 'h3'

const CREDENTIAL_PREFIX = 'passkey:credential:'
const CONSUMED_CHALLENGE_PREFIX = 'passkey:challenge:consumed:'
const SESSION_COOKIE = 'sink_passkey_session'
const CHALLENGE_TTL_SECONDS = 120
const SESSION_TTL_SECONDS = 60 * 60 * 8
const encoder = new TextEncoder()

type Ceremony = 'register' | 'authenticate'

interface PasskeyKV {
  get: <T = string>(key: string, options?: { type?: 'text' | 'json' }) => Promise<T | null>
  put: (key: string, value: string, options?: { expiration?: number, expirationTtl?: number }) => Promise<void>
  delete: (key: string) => Promise<void>
  list: (options?: { prefix?: string, limit?: number, cursor?: string }) => Promise<{
    keys: Array<{ name: string }>
    list_complete: boolean
    cursor?: string
  }>
}

interface PasskeyChallenge {
  requestId: string
  challenge: string
  ceremony: Ceremony
  origin: string
  rpId: string
  expiresAt: number
  userHandle?: string
  name?: string
}

export interface PasskeyCredential {
  id: string
  name: string
  userHandle: string
  publicKeyX: string
  publicKeyY: string
  counter: number
  transports: string[]
  createdAt: string
}

interface CredentialResponse {
  id: string
  rawId: string
  type: 'public-key'
  response: {
    clientDataJSON: string
    attestationObject?: string
    authenticatorData?: string
    signature?: string
    userHandle?: string | null
    transports?: string[]
  }
}

function getKV(event: Parameters<typeof getRequestURL>[0]): PasskeyKV {
  const { cloudflare } = event.context
  if (!cloudflare?.env?.KV)
    throw createError({ statusCode: 503, statusMessage: 'Passkeys require a KV binding' })
  return cloudflare.env.KV as PasskeyKV
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes)
    binary += String.fromCharCode(byte)

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  if (!/^[\w-]*={0,2}$/.test(value))
    throw new Error('Invalid base64url value')

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, character => character.charCodeAt(0))
}

function randomBase64Url(byteLength: number) {
  const bytes = new Uint8Array(byteLength)
  crypto.getRandomValues(bytes)
  return bytesToBase64Url(bytes)
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)
  let difference = leftBytes.length ^ rightBytes.length
  const length = Math.max(leftBytes.length, rightBytes.length)
  for (let index = 0; index < length; index++)
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0)
  return difference === 0
}

function currentOrigin(event: Parameters<typeof getRequestURL>[0]) {
  return getRequestURL(event).origin
}

function currentRpId(event: Parameters<typeof getRequestURL>[0]) {
  return getRequestURL(event).hostname
}

async function createChallenge(event: Parameters<typeof getRequestURL>[0], ceremony: Ceremony, name?: string) {
  const token = getSiteToken(event)
  if (!token)
    throw createError({ statusCode: 503, statusMessage: 'NUXT_SITE_TOKEN is required for passkeys' })

  const requestId = randomBase64Url(18)
  const challenge: PasskeyChallenge = {
    requestId,
    challenge: randomBase64Url(32),
    ceremony,
    origin: currentOrigin(event),
    rpId: currentRpId(event),
    expiresAt: Math.floor(Date.now() / 1000) + CHALLENGE_TTL_SECONDS,
    name,
  }

  if (ceremony === 'register')
    challenge.userHandle = await getUserHandle(challenge.rpId)

  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(challenge)))
  const signature = await signValue(`passkey-challenge:${payload}`, token)
  return { requestId, challenge, challengeToken: `${payload}.${signature}` }
}

async function getUserHandle(rpId: string) {
  const handle = await crypto.subtle.digest('SHA-256', encoder.encode(`glsoft.ai:administrator:${rpId}`))
  return bytesToBase64Url(new Uint8Array(handle))
}

export async function consumeChallenge(
  event: Parameters<typeof getRequestURL>[0],
  requestId: string,
  challengeToken: string,
  ceremony: Ceremony,
) {
  const token = getSiteToken(event)
  if (!token)
    throw createError({ statusCode: 503, statusMessage: 'Passkey signing key is not configured.' })
  if (!challengeToken || challengeToken.length > 4096)
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge token is missing or too large.' })

  const [payload, signature, ...extra] = challengeToken.split('.')
  if (extra.length || !payload || !signature)
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge token was malformed.' })
  const expectedSignature = await signValue(`passkey-challenge:${payload}`, token)
  if (!constantTimeEqual(signature, expectedSignature))
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge signature did not match.' })

  let decodedPayload: Uint8Array
  try {
    decodedPayload = base64UrlToBytes(payload)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge token is not valid Base64URL.' })
  }

  let challenge: PasskeyChallenge
  try {
    challenge = JSON.parse(new TextDecoder().decode(decodedPayload))
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge token is not valid JSON.' })
  }

  if (challenge.requestId !== requestId)
    throw createError({ statusCode: 400, statusMessage: 'Passkey request ID did not match.' })
  if (challenge.ceremony !== ceremony)
    throw createError({ statusCode: 400, statusMessage: 'Passkey ceremony type did not match.' })
  const now = Math.floor(Date.now() / 1000)
  if (challenge.expiresAt <= now)
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge expired. Start registration again.' })
  if (challenge.origin !== currentOrigin(event) || challenge.rpId !== currentRpId(event))
    throw createError({ statusCode: 400, statusMessage: 'Passkey request origin changed' })

  const KV = getKV(event)
  const consumedKey = `${CONSUMED_CHALLENGE_PREFIX}${challenge.requestId}`
  const alreadyConsumed = await KV.get(consumedKey)
  if (alreadyConsumed)
    throw createError({ statusCode: 400, statusMessage: 'Passkey challenge has already been used.' })

  const remainingTtl = Math.max(60, challenge.expiresAt - now)
  await KV.put(consumedKey, '1', { expirationTtl: remainingTtl })

  return challenge
}

export async function createRegistrationOptions(event: Parameters<typeof getRequestURL>[0], name: string) {
  const KV = getKV(event)
  const { requestId, challenge, challengeToken } = await createChallenge(event, 'register', name)
  const existing = await listPasskeys(KV)
  return {
    requestId,
    challengeToken,
    options: {
      challenge: challenge.challenge,
      rp: { id: challenge.rpId, name: 'glsoft.ai' },
      user: {
        id: challenge.userHandle,
        name: 'glsoft.ai administrator',
        displayName: 'glsoft.ai administrator',
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      timeout: 60_000,
      attestation: 'none',
      excludeCredentials: existing.map(credential => ({ type: 'public-key', id: credential.id })),
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'required',
        userVerification: 'required',
      },
    },
  }
}

export async function createAuthenticationOptions(event: Parameters<typeof getRequestURL>[0]) {
  const credentials = await listPasskeys(getKV(event))
  if (!credentials.length)
    throw createError({ statusCode: 404, statusMessage: 'No passkey is registered yet' })
  const { requestId, challenge, challengeToken } = await createChallenge(event, 'authenticate')

  return {
    requestId,
    challengeToken,
    options: {
      challenge: challenge.challenge,
      rpId: challenge.rpId,
      timeout: 60_000,
      userVerification: 'required',
    },
  }
}

function decodeCborLength(bytes: Uint8Array, offset: { value: number }, additional: number) {
  if (additional < 24)
    return additional

  const byteLength = additional === 24 ? 1 : additional === 25 ? 2 : additional === 26 ? 4 : additional === 27 ? 8 : 0
  if (!byteLength || offset.value + byteLength > bytes.length)
    throw new Error('Invalid CBOR length')

  let length = 0
  for (let index = 0; index < byteLength; index++)
    length = length * 256 + bytes[offset.value++]
  if (!Number.isSafeInteger(length))
    throw new Error('CBOR value is too large')
  return length
}

function decodeCbor(bytes: Uint8Array, offset = { value: 0 }, depth = 0): unknown {
  if (depth > 16 || offset.value >= bytes.length)
    throw new Error('Invalid CBOR data')

  const initial = bytes[offset.value++]
  const major = initial >> 5
  const additional = initial & 0x1F
  if (additional === 31)
    throw new Error('Indefinite CBOR values are not supported')

  if (major === 7) {
    if (additional === 20)
      return false
    if (additional === 21)
      return true
    if (additional === 22 || additional === 23)
      return null
    if (additional === 26) {
      const value = new DataView(bytes.buffer, bytes.byteOffset + offset.value, 4).getFloat32(0)
      offset.value += 4
      return value
    }
    if (additional === 27) {
      const value = new DataView(bytes.buffer, bytes.byteOffset + offset.value, 8).getFloat64(0)
      offset.value += 8
      return value
    }
    throw new Error('Unsupported CBOR simple value')
  }

  const length = decodeCborLength(bytes, offset, additional)
  if (major === 0)
    return length
  if (major === 1)
    return -1 - length
  if (major === 2 || major === 3) {
    if (length > bytes.length - offset.value)
      throw new Error('Truncated CBOR data')
    const value = bytes.slice(offset.value, offset.value + length)
    offset.value += length
    return major === 2 ? value : new TextDecoder().decode(value)
  }
  if (major === 4) {
    const values = []
    for (let index = 0; index < length; index++)
      values.push(decodeCbor(bytes, offset, depth + 1))
    return values
  }
  if (major === 5) {
    const values = new Map<unknown, unknown>()
    for (let index = 0; index < length; index++)
      values.set(decodeCbor(bytes, offset, depth + 1), decodeCbor(bytes, offset, depth + 1))
    return values
  }
  if (major === 6) {
    decodeCbor(bytes, offset, depth + 1)
    return decodeCbor(bytes, offset, depth + 1)
  }
  throw new Error('Unsupported CBOR major type')
}

function readUint32(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0)
}

async function verifyClientData(
  event: Parameters<typeof getRequestURL>[0],
  encodedClientData: string,
  challenge: PasskeyChallenge,
  expectedType: 'webauthn.create' | 'webauthn.get',
) {
  const clientDataBytes = base64UrlToBytes(encodedClientData)
  const clientData = JSON.parse(new TextDecoder().decode(clientDataBytes))
  if (clientData.type !== expectedType
    || clientData.challenge !== challenge.challenge
    || clientData.origin !== currentOrigin(event)
    || clientData.crossOrigin === true) {
    throw createError({ statusCode: 400, statusMessage: 'Passkey response did not match this request' })
  }
  return clientDataBytes
}

async function verifyRpIdHash(authenticatorData: Uint8Array, rpId: string) {
  if (authenticatorData.length < 37)
    throw new Error('Authenticator data is incomplete')
  const expected = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(rpId)))
  const actual = authenticatorData.subarray(0, 32)
  let difference = 0
  for (let index = 0; index < expected.length; index++)
    difference |= expected[index] ^ actual[index]
  if (difference !== 0)
    throw new Error('Relying party ID mismatch')
}

function verifyUserFlags(authenticatorData: Uint8Array) {
  const flags = authenticatorData[32]
  if (!(flags & 0x01) || !(flags & 0x04))
    throw new Error('Touch ID, Face ID, or device verification is required')
}

function getCosePublicKey(authenticatorData: Uint8Array) {
  const flags = authenticatorData[32]
  if (!(flags & 0x40))
    throw new Error('Registration did not include a credential public key')

  let offset = 37 + 16
  if (offset + 2 > authenticatorData.length)
    throw new Error('Registration data is incomplete')
  const credentialIdLength = authenticatorData[offset] * 256 + authenticatorData[offset + 1]
  offset += 2
  if (!credentialIdLength || credentialIdLength > 1023 || offset + credentialIdLength >= authenticatorData.length)
    throw new Error('Credential ID is invalid')

  const credentialId = authenticatorData.slice(offset, offset + credentialIdLength)
  offset += credentialIdLength
  const coseOffset = { value: offset }
  const coseKey = decodeCbor(authenticatorData, coseOffset)
  if (!(coseKey instanceof Map)
    || coseKey.get(1) !== 2
    || coseKey.get(3) !== -7
    || coseKey.get(-1) !== 1) {
    throw new Error('Passkey must use the ES256 P-256 algorithm')
  }

  const x = coseKey.get(-2)
  const y = coseKey.get(-3)
  if (!(x instanceof Uint8Array) || x.length !== 32 || !(y instanceof Uint8Array) || y.length !== 32)
    throw new Error('Passkey public key coordinates are invalid')

  return {
    credentialId: bytesToBase64Url(credentialId),
    publicKeyX: bytesToBase64Url(x),
    publicKeyY: bytesToBase64Url(y),
  }
}

export async function verifyRegistration(
  event: Parameters<typeof getRequestURL>[0],
  challenge: PasskeyChallenge,
  credential: CredentialResponse,
  name: string,
): Promise<PasskeyCredential> {
  const clientDataBytes = await verifyClientData(event, credential.response.clientDataJSON, challenge, 'webauthn.create')
  const attestationBytes = base64UrlToBytes(credential.response.attestationObject || '')
  const attestation = decodeCbor(attestationBytes)
  const attestationStatement = attestation instanceof Map ? attestation.get('attStmt') : null
  if (!(attestation instanceof Map)
    || attestation.get('fmt') !== 'none'
    || !(attestationStatement instanceof Map)
    || attestationStatement.size !== 0
    || !(attestation.get('authData') instanceof Uint8Array)) {
    throw new Error('Unsupported passkey attestation format')
  }

  const authenticatorData = attestation.get('authData') as Uint8Array
  await verifyRpIdHash(authenticatorData, challenge.rpId)
  verifyUserFlags(authenticatorData)
  const key = getCosePublicKey(authenticatorData)
  if (!constantTimeEqual(key.credentialId, credential.rawId) || credential.id !== credential.rawId)
    throw new Error('Passkey credential ID mismatch')

  if (!challenge.userHandle)
    throw new Error('Passkey account context is missing')
  if (!clientDataBytes.length)
    throw new Error('Client data is empty')

  return {
    id: key.credentialId,
    name,
    userHandle: challenge.userHandle,
    publicKeyX: key.publicKeyX,
    publicKeyY: key.publicKeyY,
    counter: readUint32(authenticatorData, 33),
    transports: credential.response.transports || [],
    createdAt: new Date().toISOString(),
  }
}

function readDerLength(signature: Uint8Array, offset: { value: number }) {
  if (offset.value >= signature.length)
    throw new Error('Invalid ECDSA signature')
  const first = signature[offset.value++]
  if (!(first & 0x80))
    return first
  const lengthBytes = first & 0x7F
  if (!lengthBytes || lengthBytes > 2 || offset.value + lengthBytes > signature.length)
    throw new Error('Invalid ECDSA signature length')
  let length = 0
  for (let index = 0; index < lengthBytes; index++)
    length = length * 256 + signature[offset.value++]
  return length
}

function derToP1363(signature: Uint8Array) {
  if (signature.length < 8 || signature.length > 80 || signature[0] !== 0x30)
    throw new Error('Invalid ECDSA signature')

  const offset = { value: 1 }
  const sequenceLength = readDerLength(signature, offset)
  if (offset.value + sequenceLength !== signature.length || signature[offset.value++] !== 0x02)
    throw new Error('Invalid ECDSA signature sequence')

  const rLength = readDerLength(signature, offset)
  let r = signature.slice(offset.value, offset.value + rLength)
  offset.value += rLength
  if (signature[offset.value++] !== 0x02)
    throw new Error('Invalid ECDSA signature integer')

  const sLength = readDerLength(signature, offset)
  let s = signature.slice(offset.value, offset.value + sLength)
  offset.value += sLength
  if (offset.value !== signature.length)
    throw new Error('Invalid ECDSA signature length')
  if (r[0] === 0)
    r = r.slice(1)
  if (s[0] === 0)
    s = s.slice(1)
  if (!r.length || !s.length || r.length > 32 || s.length > 32)
    throw new Error('Invalid ECDSA signature values')

  const raw = new Uint8Array(64)
  raw.set(r, 32 - r.length)
  raw.set(s, 64 - s.length)
  return raw
}

export async function verifyAuthentication(
  event: Parameters<typeof getRequestURL>[0],
  challenge: PasskeyChallenge,
  credential: CredentialResponse,
) {
  const KV = getKV(event)
  const record = await KV.get<PasskeyCredential>(`${CREDENTIAL_PREFIX}${credential.id}`, { type: 'json' })
  if (!record || record.id !== credential.rawId)
    throw createError({ statusCode: 401, statusMessage: 'Passkey was not recognized' })

  const userHandle = credential.response.userHandle
  if (!userHandle || !constantTimeEqual(userHandle, record.userHandle))
    throw createError({ statusCode: 401, statusMessage: 'Passkey account was not recognized' })

  const clientDataBytes = await verifyClientData(event, credential.response.clientDataJSON, challenge, 'webauthn.get')
  const authenticatorData = base64UrlToBytes(credential.response.authenticatorData || '')
  await verifyRpIdHash(authenticatorData, challenge.rpId)
  verifyUserFlags(authenticatorData)

  const clientDataHash = await crypto.subtle.digest('SHA-256', clientDataBytes)
  const signedData = new Uint8Array(authenticatorData.length + 32)
  signedData.set(authenticatorData)
  signedData.set(new Uint8Array(clientDataHash), authenticatorData.length)

  const publicKey = await crypto.subtle.importKey(
    'jwk',
    { kty: 'EC', crv: 'P-256', x: record.publicKeyX, y: record.publicKeyY, ext: true, key_ops: ['verify'] },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify'],
  )
  const signature = derToP1363(base64UrlToBytes(credential.response.signature || ''))
  const valid = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, publicKey, signature, signedData)
  if (!valid)
    throw createError({ statusCode: 401, statusMessage: 'Passkey signature was invalid' })

  const counter = readUint32(authenticatorData, 33)
  if (record.counter && counter && counter <= record.counter)
    throw createError({ statusCode: 401, statusMessage: 'Passkey counter check failed' })
  if (counter > record.counter) {
    record.counter = counter
    await KV.put(`${CREDENTIAL_PREFIX}${record.id}`, JSON.stringify(record))
  }
  return record
}

export async function listPasskeys(KV: PasskeyKV): Promise<PasskeyCredential[]> {
  const { keys } = await KV.list({ prefix: CREDENTIAL_PREFIX, limit: 100 })
  const records = await Promise.all(keys.map(key => KV.get<PasskeyCredential>(key.name, { type: 'json' })))
  return records.filter((record): record is PasskeyCredential => !!record)
}

export async function savePasskey(event: Parameters<typeof getRequestURL>[0], credential: PasskeyCredential) {
  await getKV(event).put(`${CREDENTIAL_PREFIX}${credential.id}`, JSON.stringify(credential))
}

export async function deletePasskey(event: Parameters<typeof getRequestURL>[0], id: string) {
  await getKV(event).delete(`${CREDENTIAL_PREFIX}${id}`)
}

function getSiteToken(event: Parameters<typeof getRequestURL>[0]) {
  const configToken = useRuntimeConfig(event).siteToken || ''
  return configToken.split(',').map(token => token.trim()).find(Boolean) || ''
}

async function signValue(message: string, token: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(token),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return bytesToBase64Url(new Uint8Array(signature))
}

async function signSession(expiresAt: number, token: string) {
  return signValue(`passkey:${expiresAt}`, token)
}

export async function setPasskeySession(event: Parameters<typeof getRequestURL>[0]) {
  const token = getSiteToken(event)
  if (!token)
    throw createError({ statusCode: 503, statusMessage: 'NUXT_SITE_TOKEN is required for passkey sessions' })

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const signature = await signSession(expiresAt, token)
  setCookie(event, SESSION_COOKIE, `${expiresAt}.${signature}`, {
    httpOnly: true,
    secure: getRequestURL(event).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearPasskeySession(event: Parameters<typeof getRequestURL>[0]) {
  deleteCookie(event, SESSION_COOKIE, {
    httpOnly: true,
    secure: getRequestURL(event).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
  })
}

export async function hasValidPasskeySession(event: Parameters<typeof getRequestURL>[0]) {
  const token = getSiteToken(event)
  const session = getCookie(event, SESSION_COOKIE)
  if (!token || !session || session.length > 256)
    return false

  const [expiresAtValue, signature, ...extra] = session.split('.')
  const expiresAt = Number(expiresAtValue)
  if (extra.length || !Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signature)
    return false

  try {
    const expected = await signSession(expiresAt, token)
    return constantTimeEqual(signature, expected)
  }
  catch {
    return false
  }
}

export function parseCredential(value: unknown): CredentialResponse {
  if (!value || typeof value !== 'object')
    throw createError({ statusCode: 400, statusMessage: 'Invalid passkey response' })
  const credential = value as CredentialResponse
  if (credential.type !== 'public-key'
    || !credential.id
    || !credential.rawId
    || credential.id.length > 1400
    || credential.rawId.length > 1400
    || !credential.response?.clientDataJSON
    || credential.response.clientDataJSON.length > 12000) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid passkey response' })
  }
  return credential
}

export function newCredentialId() {
  return randomBase64Url(18)
}
