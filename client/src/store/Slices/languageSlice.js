import { createSlice } from "@reduxjs/toolkit";

const translations = {
  en: {
    chooseLanguage: "Choose a language and region",
    english: "English",
    arabic: "Arabic",
    unitedStates: "United States",
    world: "World",
  },
  ar: {
    chooseLanguage: "اختر اللغة والمنطقة",
    english: "الإنجليزية",
    arabic: "العربية",
    unitedStates: "الولايات المتحدة",
    world: "العالم",
  },
};

// Load language from localStorage or use default
const savedLanguage = localStorage.getItem("language") || "en";
const savedDirection = savedLanguage === "ar" ? "rtl" : "ltr";

// Set initial direction on HTML element
document.documentElement.dir = savedDirection;

const initialState = {
  default_language: savedLanguage,
  direction: savedDirection,
  t: translations[savedLanguage],
};

export const languageSlice = createSlice({
  name: "change_language",
  initialState,
  reducers: {
    englishLanguage: (state) => {
      state.default_language = "en";
      state.direction = "ltr";
      state.t = translations.en;
      localStorage.setItem("language", "en");
      document.documentElement.dir = "ltr";
    },
    arabicLanguage: (state) => {
      state.default_language = "ar";
      state.direction = "rtl";
      state.t = translations.ar;
      localStorage.setItem("language", "ar");
      document.documentElement.dir = "rtl";
    },
  },
});

export const { englishLanguage, arabicLanguage } = languageSlice.actions;
export default languageSlice.reducer;
