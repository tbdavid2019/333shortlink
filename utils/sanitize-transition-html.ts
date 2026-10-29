import sanitizeHtml from 'sanitize-html'

const safeSchemes = new Set(['http', 'https', 'mailto', 'tel'])

function isSafeUrl(value: string, allowMailAndTel: boolean) {
  // sanitize-html decodes HTML entities before transformTags; normalize browser-ignored controls
  // before applying a strict scheme allowlist (for example, java&#x0A;script:).
  const normalized = [...value].filter((character) => {
    const code = character.charCodeAt(0)
    return code > 0x20 && code !== 0x7F && !/[\s\u200B-\u200F\u2060]/u.test(character)
  }).join('')
  if (!normalized || normalized.startsWith('//') || normalized.startsWith('\\'))
    return false

  const scheme = normalized.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase()
  return scheme ? safeSchemes.has(scheme) && (allowMailAndTel || (scheme !== 'mailto' && scheme !== 'tel')) : true
}

/** Sanitize user HTML consistently in the browser, SSR, and Cloudflare Workers. */
export function sanitizeTransitionHtml(html: string) {
  if (typeof html !== 'string' || html.length === 0)
    return ''

  return sanitizeHtml(html, {
    allowedTags: [
      'a',
      'b',
      'blockquote',
      'br',
      'caption',
      'code',
      'del',
      'div',
      'em',
      'figcaption',
      'figure',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'i',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      's',
      'span',
      'strong',
      'sub',
      'sup',
      'table',
      'tbody',
      'td',
      'th',
      'thead',
      'tr',
      'u',
      'ul',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      code: ['class'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    nestingLimit: 64,
    exclusiveFilter: frame => frame.tag === 'img' && !frame.attribs.src,
    transformTags: {
      a: (tagName, attributes) => {
        if (attributes.href && !isSafeUrl(attributes.href, true))
          delete attributes.href
        if (attributes.target === '_blank') {
          const rel = new Set((attributes.rel || '').split(/\s+/).filter(Boolean))
          rel.add('noopener')
          rel.add('noreferrer')
          attributes.rel = [...rel].join(' ')
        }
        return { tagName, attribs: attributes }
      },
      code: (tagName, attributes) => {
        if (!attributes.class || !/^language-[\w-]+$/i.test(attributes.class))
          delete attributes.class
        return { tagName, attribs: attributes }
      },
      img: (tagName, attributes) => {
        if (attributes.src && !isSafeUrl(attributes.src, false))
          delete attributes.src
        return { tagName, attribs: attributes }
      },
    },
  })
}
