import deDE from './locales/de-DE.json'
import enUS from './locales/en-US.json'
import frFR from './locales/fr-FR.json'
import viVN from './locales/vi-VN.json'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en-US',
  messages: {
    'de-DE': deDE,
    'en-US': enUS,
    'fr-FR': frFR,
    'vi-VN': viVN,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
  },
}))
