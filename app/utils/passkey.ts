interface CreationOptionsPayload {
  challenge: string
  user: { id: string }
  excludeCredentials?: Array<{ type: 'public-key', id: string }>
  [key: string]: unknown
}

interface RequestOptionsPayload {
  challenge: string
  allowCredentials?: Array<{ type: 'public-key', id: string }>
  [key: string]: unknown
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, character => character.charCodeAt(0))
}

function encodeBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes)
    binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function prepareCreationOptions(options: CreationOptionsPayload): PublicKeyCredentialCreationOptions {
  return {
    ...options,
    challenge: decodeBase64Url(options.challenge),
    user: { ...options.user, id: decodeBase64Url(options.user.id) },
    excludeCredentials: options.excludeCredentials?.map(credential => ({
      ...credential,
      id: decodeBase64Url(credential.id),
    })),
  } as unknown as PublicKeyCredentialCreationOptions
}

export function prepareRequestOptions(options: RequestOptionsPayload): PublicKeyCredentialRequestOptions {
  return {
    ...options,
    challenge: decodeBase64Url(options.challenge),
    allowCredentials: options.allowCredentials?.map(credential => ({
      ...credential,
      id: decodeBase64Url(credential.id),
    })),
  } as PublicKeyCredentialRequestOptions
}

export function serializePasskeyCredential(credential: PublicKeyCredential) {
  const response = credential.response
  const serializedResponse: Record<string, unknown> = {
    clientDataJSON: encodeBase64Url(response.clientDataJSON),
  }

  if ('attestationObject' in response) {
    const attestation = response as AuthenticatorAttestationResponse
    serializedResponse.attestationObject = encodeBase64Url(attestation.attestationObject)
    serializedResponse.transports = attestation.getTransports?.() || []
  }
  else {
    const assertion = response as AuthenticatorAssertionResponse
    serializedResponse.authenticatorData = encodeBase64Url(assertion.authenticatorData)
    serializedResponse.signature = encodeBase64Url(assertion.signature)
    serializedResponse.userHandle = assertion.userHandle ? encodeBase64Url(assertion.userHandle) : null
  }

  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: credential.type,
    response: serializedResponse,
  }
}
