import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    default_language: "en",
    direction: "ltr"
}

export const languageSlice = createSlice({
    name: "change_language",
    initialState,
    reducers: {
        englishLanguage: (currentState) => {
            currentState.default_language = "en"
            currentState.direction = "ltr"
        },
        arabicLanguage: (currentState) => {
            currentState.default_language = "ar"
            currentState.direction = "rtl"
        }
    }
})

export const { englishLanguage, arabicLanguage} = languageSlice.actions
export default languageSlice.reducer