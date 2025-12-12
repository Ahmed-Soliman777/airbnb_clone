import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Globe, Menu, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import i18n from '@/utils/i18n';
import { isAuthenticated } from '@/utils/cookies';

import Logo from "../../assets/Airbnb-Logo.wine.svg";
import HomesIcon from "../../assets/home_icon.avif";
import ExperiencesIcon from "../../assets/experience_icon.avif";
import ServicesIcon from "../../assets/service_icon.avif";
import SearchBar from '../SearchBar/SearchBar';

import './Navbar.css';
import MenuList from '../Menu/MenuList';

export default function Navbar({ toggleTranslateModal, isSticky = true }) {
    const { t } = useTranslation();
    const lang = useSelector(state => state.lang.default_language);
    const direction = useSelector(state => state.lang.direction);

    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [scrolled, setScrolled] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollY, setLastScrollY] = useState(0);

    const isServicePage = ['/', '/experiences', '/services'].includes(location.pathname) || 
        location.pathname.startsWith('/experiences/search') || 
        location.pathname.startsWith('/services/search');

    // Check authentication status
    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, [location]);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 5) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const getUnderlinePosition = () => {
        if (direction === "rtl") {
            switch (location.pathname) {
                case "/": return "right-0";
                case "/experiences": return "right-1/3";
                case "/services": return "right-2/3";
                default: return "right-0";
            }
        } else {
            switch (location.pathname) {
                case "/": return "left-0";
                case "/experiences": return "left-1/3";
                case "/services": return "left-2/3";
                default: return "left-0";
            }
        }
    };

    return (
        <nav className={`
            bg-(--color-light-gray) px-4 sm:px-6 md:px-8 lg:px-12 
            ${isSticky ? 'sticky top-0' : 'relative'} z-40
            transition-all duration-500 ease-in-out
            ${scrolled ? 'py-1 shadow-lg backdrop-blur-sm bg-opacity-95' : 'py-2'}
            ${scrollDirection === 'down' && scrolled ? 'transform -translate-y-2' : 'transform translate-y-0'}
        `}>
            <div className={`
                flex flex-wrap lg:flex-nowrap justify-between items-center gap-4
                transition-all duration-500 ease-in-out
                ${scrolled ? 'scale-95' : 'scale-100'}
            `}>
                {/* Logo */}
                <Link
                    to={"/"}
                    className={`
                        w-20 sm:w-24 md:w-28 lg:w-30 shrink-0
                        transition-all duration-500 ease-in-out
                        ${scrolled ? 'opacity-80 scale-90' : 'opacity-100 scale-100'}
                    `}
                >
                    <img src={Logo} alt="airbnb_logo" className="w-full" />
                </Link>

                {/* Navbar links */}
                {isServicePage && (
                    <div className={`
                        hidden lg:flex justify-around relative flex-1 max-w-2xl xl:ms-58 lg:ms-30 md:ms-32 mx-4
                        transition-all duration-500 ease-in-out
                        ${scrolled ? 'opacity-90 scale-95' : 'opacity-100 scale-100'}
                    `}>
                        {/* Animated underline */}
                        <div className={`
                            absolute bottom-0 h-0.5 bg-black w-1/3 
                            transition-all duration-300 ease-in-out 
                            ${getUnderlinePosition()}
                            ${scrolled ? 'opacity-70' : 'opacity-100'}
                        `}></div>

                        {/* Homes */}
                        <NavLink
                            to="/"
                            className={({ isActive }) => `
                                flex items-center gap-1 
                                ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"} 
                                hover:scale-105 hover:text-black 
                                transition-all duration-300 ease-in-out
                                ${scrolled ? 'transform -translate-y-0.5' : ''}
                            `}
                            style={{ transitionDelay: scrolled ? '0ms' : '100ms' }}
                        >
                            <div className="w-12 md:w-16 lg:w-18">
                                <img src={HomesIcon} alt="homes_icon" className="w-full" />
                            </div>
                            <span className='relative -start-2 lg:-start-4 text-sm lg:text-base'>{t("navbar.homes")}</span>
                        </NavLink>

                        {/* Experiences */}
                        <NavLink
                            to="/experiences"
                            className={({ isActive }) => `
                                flex items-center gap-1 
                                ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"} 
                                hover:scale-105 hover:text-black 
                                transition-all duration-300 ease-in-out
                                ${scrolled ? 'transform -translate-y-0.5' : ''}
                            `}
                            style={{ transitionDelay: scrolled ? '50ms' : '150ms' }}
                        >
                            <div className="relative text-[10px] font-bold start-16 md:start-20 lg:start-22 -top-5 new_tag_style text-white">{t("navbar.new")}</div>
                            <div className="w-12 md:w-16 lg:w-18">
                                <img src={ExperiencesIcon} alt="experiences_icon" className="w-full" />
                            </div>
                            <span className='relative -start-2 lg:-start-4 text-sm lg:text-base'>{t("navbar.experiences")}</span>
                        </NavLink>

                        {/* Services */}
                        <NavLink
                            to="/services"
                            className={({ isActive }) => `
                                flex items-center gap-1 
                                ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"} 
                                hover:scale-105 hover:text-black 
                                transition-all duration-300 ease-in-out
                                ${scrolled ? 'transform -translate-y-0.5' : ''}
                            `}
                            style={{ transitionDelay: scrolled ? '100ms' : '200ms' }}
                        >
                            <div className="relative text-[10px] font-bold start-16 md:start-20 lg:start-22 -top-5 new_tag_style text-white">{t("navbar.new")}</div>
                            <div className="w-12 md:w-16 lg:w-18">
                                <img src={ServicesIcon} alt="services_icon" className="w-full" />
                            </div>
                            <span className='relative -start-2 lg:-start-4 text-sm lg:text-base'>{t("navbar.services")}</span>
                        </NavLink>
                    </div>
                )}

                {/* Action buttons with slide animation */}
                <div className={`
                    flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 ml-auto
                    transition-all duration-500 ease-in-out
                    ${scrolled ? 'transform translate-x-1 scale-95' : 'transform translate-x-0 scale-100'}
                `}>
                    <span className={`
                        hidden md:inline-block cursor_pointer font-semibold 
                        hover:bg-[#d4d4d4c1] rounded-lg py-1 px-2 cursor-pointer text-sm lg:text-base
                        transition-all duration-300 ease-in-out
                        ${scrolled ? 'opacity-0 scale-90 w-0 px-0' : 'opacity-100 scale-100'}
                    `}>
                        {location.pathname.startsWith('/host') ? (
                            <Link to="/">Switch to traveling</Link>
                        ) : (
                            <Link to="/host">{t("navbar.host")}</Link>
                        )}
                    </span>

                    <span
                        className={`
                            cursor_pointer bg-[#d4d4d490] rounded-full p-1.5 sm:p-2 cursor-pointer 
                            hover:bg-[#d4d4d4d2] hover:scale-110
                            transition-all duration-300 ease-in-out
                            ${scrolled ? 'transform rotate-180' : 'transform rotate-0'}
                        `}
                        onClick={toggleTranslateModal}
                    >
                        <Globe size={18} className="sm:w-5 sm:h-5" />
                    </span>

                    {/* Profile Image - Only visible when logged in */}
                    {isLoggedIn && (
                        <Link
                            to="/profile"
                            className={`
                                cursor-pointer bg-[#d4d4d490] rounded-full p-1.5 sm:p-2
                                hover:bg-[#d4d4d4d2] hover:scale-110
                                transition-all duration-300 ease-in-out
                            `}
                        >
                            <User size={18} className="sm:w-5 sm:h-5" />
                        </Link>
                    )}

                    <MenuList />

                </div>
            </div>

            {/* Search bar */}
            {isServicePage && (
                <div className={`
                    mt-2 sm:mt-3 md:mt-4 
                    transition-all duration-500 ease-in-out
                    ${scrolled ? 'max-h-0 opacity-0 mt-0 transform -translate-y-4' : 'max-h-96 opacity-100 transform translate-y-0'}
                `}>
                    <SearchBar />
                </div>
            )}
        </nav>
    );
}