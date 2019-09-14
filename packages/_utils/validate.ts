import { lang, format } from './i18n'

const messages = {
  zh: {
    required: '必填项',
    whitespace: '必填项',
    max: '不允许超过{0}个字符',
    pattern: '格式必须为{0}',
  },
  en: {
    max: 'No more than {0} characters allowed',
    pattern: 'Format must be {0}',
    required: 'Required field',
    whitespace: 'Required field',
  },
}
const message = messages[lang]

export function getCommonValidateMessages() {
  return {
    required: () => message.required,
    whitespace: () => message.required,
    string: {
      max: (name: string, len: number) => format(message.max, [String(len)]),
    },
    pattern: {
      mismatch: (name: string, str: string) => format(message.max, [str]),
    },
  }
}
