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

const initialState = {
  default_language: "en",
  direction: "ltr",
  t: translations.en,
};

export const languageSlice = createSlice({
  name: "change_language",
  initialState,
  reducers: {
    englishLanguage: (state) => {
      state.default_language = "en";
      state.direction = "ltr";
      state.t = translations.en;
    },
    arabicLanguage: (state) => {
      state.default_language = "ar";
      state.direction = "rtl";
      state.t = translations.ar;
    },
  },
});

export const { englishLanguage, arabicLanguage } = languageSlice.actions;
export default languageSlice.reducer;
