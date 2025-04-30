export const LOCALE_ERR_MSG = {
  KEY_NOT_FOUND: (key: string) => `Locale key "${key}" not found!`,
  LANG_NOT_FOUND: (lang: string) => `Locale lang "${lang}" not found!`,
  KEY_NOT_END: (key: string, beforeKey: string) => `Locale key "${key}" is set, but "${beforeKey}" reach the value.`,
}
