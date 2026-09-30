import { LLMS_TXT } from '@@/server/utils/llms'

export default eventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return LLMS_TXT
})
