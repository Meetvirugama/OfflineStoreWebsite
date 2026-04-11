import useLanguageStore from "./language.store";
import en from "./en.json";
import gu from "./gu.json";

const dictionaries = { en, gu };

/**
 * Resolve a dot-notated key like "nav.signIn" from a dictionary object.
 */
function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * useTranslation hook
 * 
 * @returns {{ t: (key: string) => string, lang: string, setLang: Function, toggle: Function }}
 */
export default function useTranslation() {
  const { lang, setLang, toggle } = useLanguageStore();
  const dict = dictionaries[lang] || dictionaries.en;

  /**
   * Translate a key. Falls back to English, then to the raw key.
   * @param {string} key - Dot-notated key like "nav.signIn"
   * @returns {string}
   */
  const t = (key) => {
    const val = resolve(dict, key);
    if (val !== undefined && val !== null) return val;
    // Fallback to English
    const fallback = resolve(dictionaries.en, key);
    if (fallback !== undefined && fallback !== null) return fallback;
    // Return key itself as last resort
    return key;
  };

  return { t, lang, setLang, toggle };
}
