import { CircleQuestionMark, LogIn } from 'lucide-react'
import React from 'react'

export default function MenuList() {
    return (
        <ul className='bg-white p-4 rounded-2xl w-50 shadow-lg'>
            <li className='flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-lg'>
                <CircleQuestionMark /> Help center
            </li>
            <li className='border-b-2 my-3'></li>
            <li className='flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-lg'>
                <LogIn /> Login / Register
            </li>
        </ul>
    )
}
