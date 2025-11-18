import React, { useEffect, useRef, useState } from 'react'
import Logo from "../../assets/Airbnb-Logo.wine.svg"
import HomesIcon from "../../assets/home_icon.avif"
import ExperiencesIcon from "../../assets/experience_icon.avif"
import ServicesIcon from "../../assets/service_icon.avif"
import { Link, NavLink, useLocation } from 'react-router'
import { useTranslation } from "react-i18next";

import './Navbar.css'
import { Globe, Menu } from 'lucide-react'
import SearchBar from '../SearchBar/SearchBar'
import MenuList from '../Menu/MenuList'
import { useSelector } from 'react-redux'
import i18n from '@/utils/i18n'

export default function Navbar() {

    // distruction t key from useTranslation
    const { t } = useTranslation()

    // update language state 
    const lang = useSelector(state => state.lang.default_language);

    // make component render again if language changes
    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);


    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Determine which link is active
    const getUnderlinePosition = () => {
        switch (location.pathname) {
            case "/":
                return "left-0";
            case "/expierences":
                return "left-1/3";
            case "/services":
                return "left-2/3";
            default:
                return "left-0";
        }
    };

    return (
        <nav className='bg-(--color-light-gray) px-4 sm:px-6 md:px-8 lg:px-12 py-2'> {/* navbar element container */}
            <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4"> {/* navbar flex container */}
                {/* ----------navbar image container--------- */}
                <Link to={"/"} className="w-20 sm:w-24 md:w-28 lg:w-30 shrink-0">{/*  */}
                    <img src={Logo} alt="airbnb_logo" className="w-full" />
                </Link>
                {/* ----------navbar list container---------- */}
                {/* <div className="hidden lg:flex justify-between relative flex-1 max-w-md mx-4 i"> */}
                <div className="hidden lg:flex justify-around relative flex-1 max-w-2xl xl:ms-58 lg:ms-30 md:ms-32 mx-4 i">
                    {/* Animated underline */}
                    <div
                        className={`absolute bottom-0 h-0.5 bg-black w-1/3 transition-all duration-300 ease-in-out ${getUnderlinePosition()}`}
                    ></div>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-1 ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"
                            } hover:scale-105 hover:text-black transition-(--transition-medium)`
                        }
                    >
                        <div className="w-12 md:w-16 lg:w-18">
                            <img src={HomesIcon} alt="homes_icon" className="w-full" />
                        </div>
                        <span className='relative -start-2 lg:-start-4 text-sm lg:text-base'>{t("navbar.homes")}</span>
                    </NavLink>

                    <NavLink
                        to="/expierences"
                        className={({ isActive }) =>
                            `flex items-center gap-1 ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"
                            } hover:scale-105 hover:text-black transition-(--transition-medium)`
                        }
                    >
                        <div className="relative text-[10px] font-bold start-16 md:start-20 lg:start-22 -top-5 new_tag_style text-white">{t("navbar.new")}</div>
                        <div className="w-12 md:w-16 lg:w-18">
                            <img src={ExperiencesIcon} alt="experiences_icon" className="w-full" />
                        </div>
                        <span className='relative -start-2 lg:-start-4 text-sm lg:text-base'>{t("navbar.experiences")}</span>
                    </NavLink>

                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            `flex items-center gap-1 ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"
                            } hover:scale-105 hover:text-black transition-(--transition-medium)`
                        }
                    >
                        <div className="relative text-[10px] font-bold start-16 md:start-20 lg:start-22 -top-5 new_tag_style text-white">{t("navbar.new")}</div>
                        <div className="w-12 md:w-16 lg:w-18">
                            <img src={ServicesIcon} alt="services_icon" className="w-full" />
                        </div>
                        <span className='relative -start-2 lg:-start-4 text-sm lg:text-base'>{t("navbar.services")}</span>
                    </NavLink>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 ml-auto">
                    <span className="hidden md:inline-block cursor_pointer font-semibold hover:bg-[#d4d4d4c1] rounded-lg py-1 px-2 cursor-pointer text-sm lg:text-base">Become a host</span>
                    <span className="cursor_pointer bg-[#d4d4d490] rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-[#d4d4d4d2] transition-(--transition-fast)"><Globe size={18} className="sm:w-5 sm:h-5" /></span>
                    <span
                        className="relative cursor-pointer bg-[#d4d4d490] rounded-full p-1.5 sm:p-2 hover:bg-[#d4d4d4d2] transition-(--transition-fast)"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                    >
                        <Menu size={18} className="sm:w-5 sm:h-5" />
                    </span>
                    {isMenuOpen && (
                        <div className="absolute top-14 sm:top-16 md:top-17 right-4 sm:right-6 md:right-10 mt-2 z-50" ref={menuRef}>
                            <MenuList />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4">
                <SearchBar />
            </div>
        </nav>
    )
}