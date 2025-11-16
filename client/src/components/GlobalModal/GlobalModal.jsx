import React from 'react'
import './GlobalModal.css'
import { useSelector, useDispatch } from 'react-redux'
import { englishLanguage, arabicLanguage } from '@/redux/slices/languageSlice'

export default function GlobalModal() {

    const language = useSelector((state) => {
        // console.log(state);
        return state.lang.default_language
    })
    // console.log(language);

    const dispatch = useDispatch()

    function handleEnglishLanguage() {
        dispatch(englishLanguage())
    }

    function handleArabicLanguage() {
        dispatch(arabicLanguage())
    }

    console.log("current language:", language);

    return (
        <div className='bg-white static z-50 p-4 rounded-2xl border w-250 mx-auto'>
            <h3 className='text-xl font-bold relative mb-10'>
                Choose a language and region
            </h3>
            <div className="grid grid-cols-4">
                <div className="border rounded-2xl p-2.5 mx-1.5 hover:bg-(--color-light-gray) cursor-pointer" onClick={handleEnglishLanguage}>
                    English
                    <div className="text-(--color-gray)">United States</div>
                </div>
                <div className="border rounded-2xl p-2.5 mx-1.5 hover:bg-(--color-light-gray) cursor-pointer text-end" onClick={handleArabicLanguage}>
                    العربية
                    <div className="text-(--color-gray)">العالم</div>
                </div>
            </div>
        </div>
    )
}
