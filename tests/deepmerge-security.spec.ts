import merge from 'deepmerge'
import { describe, expect, it } from 'vitest'

describe('deepmerge prototype poisoning protection', () => {
  it('drops __proto__ from nested source objects merged into null placeholders', () => {
    const source = JSON.parse('{"session":{"__proto__":{"isAdmin":true}}}')
    const result = merge({ session: null }, source)

    expect(Object.getPrototypeOf(result.session)).toBe(Object.prototype)
    expect(result.session).not.toHaveProperty('isAdmin')
  })

  it('drops an own __proto__ key when copying target properties', () => {
    const target = JSON.parse('{"__proto__":{"isAdmin":true},"debug":false}')
    const result = merge(target, { verbose: true })

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(result).not.toHaveProperty('isAdmin')
    expect(Object.hasOwn(result, '__proto__')).toBe(false)
    expect(result).toMatchObject({ debug: false, verbose: true })
  })
})
