import React, { useEffect, useRef, useState } from 'react'
import Logo from "../../assets/Airbnb-Logo.wine.svg"
import HomesIcon from "../../assets/home_icon.avif"
import ExperiencesIcon from "../../assets/experience_icon.avif"
import ServicesIcon from "../../assets/service_icon.avif"
import { Link, NavLink, useLocation } from 'react-router'

import './Navbar.css'
import { Globe, Menu } from 'lucide-react'
import SearchBar from '../SearchBar/SearchBar'
import MenuList from '../Menu/MenuList'

export default function Navbar() {

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
        <nav className='bg-(--color-light-gray) px-12 py-2'> {/* navbar element container */}
            <div className="flex justify-between items-center"> {/* navbar flex container */}
                {/* ----------navbar image container--------- */}
                <Link to={"/"} className="w-30">{/*  */}
                    <img src={Logo} alt="airbnb_logo" />
                </Link>
                {/* ----------navbar list container---------- */}
                <div className="flex justify-between relative">
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
                        <div className="w-18">
                            <img src={HomesIcon} alt="homes_icon" />
                        </div>
                        <span className='relative -start-4'>Homes</span>
                    </NavLink>

                    <NavLink
                        to="/expierences"
                        className={({ isActive }) =>
                            `flex items-center gap-1 ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"
                            } hover:scale-105 hover:text-black transition-(--transition-medium)`
                        }
                    >
                        <div className="relative text-[10px] font-bold start-22 -top-5 new_tag_style text-white">New</div>
                        <div className="w-18">
                            <img src={ExperiencesIcon} alt="experiences_icon" />
                        </div>
                        <span className='relative -start-4'>Experiences</span>
                    </NavLink>

                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            `flex items-center gap-1 ${isActive ? "text-black font-semibold" : "text-(--color-dark-gray)"
                            } hover:scale-105 hover:text-black transition-(--transition-medium)`
                        }
                    >
                        <div className="relative text-[10px] font-bold start-22 -top-5 new_tag_style text-white">New</div>
                        <div className="w-18">
                            <img src={ServicesIcon} alt="services_icon" />
                        </div>
                        <span className='relative -start-4'>Services</span>
                    </NavLink>
                </div>
                <div className="flex items-center gap-5">
                    <span className="cursor_pointer font-semibold hover:bg-[#d4d4d4c1] rounded-lg py-1 px-2 cursor-pointer">Become a host</span>
                    <span className="cursor_pointer bg-[#d4d4d490] rounded-full p-2 cursor-pointer hover:bg-[#d4d4d4d2] transition-(--transition-fast)"><Globe size={20} /></span>
                    <span
                        className="relative cursor-pointer bg-[#d4d4d490] rounded-full p-2 hover:bg-[#d4d4d4d2] transition-(--transition-fast)"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        ref={menuRef}
                    >
                        <Menu size={20} />
                    </span>
                    {isMenuOpen && (
                        <div className="absolute top-17 right-10 mt-2">
                            <MenuList />
                        </div>
                    )}
                </div>
            </div>
            <SearchBar />
        </nav>
    )
}
