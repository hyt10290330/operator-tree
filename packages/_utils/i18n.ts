const LANG_STORE_KEY = 'lang'

export enum LANG {
  zh = 'zh',
  en = 'en',
}

export const RICH_LANG_MAP = {
  zh: 'zh_CN',
  en: 'en_US',
}
const browserLang = navigator.language.split('-')[0]
export const lang: LANG =
  // localStorage[LANG_STORE_KEY] ||
  browserLang in RICH_LANG_MAP ? (browserLang as LANG) : LANG.zh
storeLang(lang)

export const richLang = RICH_LANG_MAP[lang]

export function injectEnv() {
  document.documentElement.setAttribute('lang', lang)
}

export function reloadLang(lang: string) {
  storeLang(lang)
  window.location.reload()
}

function storeLang(lang: string) {
  localStorage[LANG_STORE_KEY] = lang
}

// same as $t
export function format(message: string, params: Array<string> = []): string {
  return message.replace(/\{(\d+)\}/g, ($0: string, $1: string) => {
    return params[Number($1)]
  })
}
