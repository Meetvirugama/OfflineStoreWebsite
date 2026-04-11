import { create } from "zustand";

const STORAGE_KEY = "agromart_lang";

const getInitialLang = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "gu") return stored;
  } catch {}
  return "en";
};

const useLanguageStore = create((set, get) => ({
  lang: getInitialLang(),

  setLang: (lang) => {
    if (lang !== "en" && lang !== "gu") return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    set({ lang });
  },

  toggle: () => {
    const next = get().lang === "en" ? "gu" : "en";
    get().setLang(next);
  },
}));

// Set initial HTML lang attribute
document.documentElement.lang = getInitialLang();

export default useLanguageStore;
