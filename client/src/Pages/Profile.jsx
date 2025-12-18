import React, { useState } from 'react';
import AboutMeSection from '../components/User/AboutMeSection'; 
import PastTrips from '../components/User/PastTrips'

const PROFILE_SECTIONS = {
    ABOUT: 'about',
    TRIPS: 'trips',
    // CONNECTIONS: 'connections'
};

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState(PROFILE_SECTIONS.ABOUT);

    const renderSection = () => {
        switch (activeSection) {
            case PROFILE_SECTIONS.TRIPS:
                return <PastTrips />;
            case PROFILE_SECTIONS.ABOUT:
            default:
                return <AboutMeSection />;
        }
    };

    const getNavItemClass = (section) => {
        const baseClass = "flex items-center p-3 rounded-lg cursor-pointer transition duration-150";
        if (section === activeSection) {
            return `${baseClass} bg-gray-200 text-gray-800 font-semibold`;
        }
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto my-10 bg-white shadow-lg rounded-xl overflow-hidden">
            
            {/* Sidebar (التنقل) */}
            <div className="w-full md:w-1/4 p-6 border-r border-gray-100 bg-gray-50">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile</h2>
                <nav className="space-y-2"> 
                    
                    {/* About me Link */}
                    <div 
                        className={getNavItemClass(PROFILE_SECTIONS.ABOUT)}
                        onClick={() => setActiveSection(PROFILE_SECTIONS.ABOUT)}
                    >
                        <span className="mr-3">👤</span>
                        About me
                    </div>
                    
                    {/* Past trips Link */}
                    <div 
                        className={getNavItemClass(PROFILE_SECTIONS.TRIPS)}
                        onClick={() => setActiveSection(PROFILE_SECTIONS.TRIPS)}
                    >
                        <span className="mr-3">🎒</span>
                        Past trips
                    </div>
                    
                    {/* Connections Link
                    <div 
                        className={getNavItemClass(PROFILE_SECTIONS.CONNECTIONS)}
                        onClick={() => setActiveSection(PROFILE_SECTIONS.CONNECTIONS)}
                    >
                        <span className="mr-3">🧑‍🤝‍🧑</span>
                        Connections
                    </div> */}
                </nav>
            </div>

            {/* Content Area */}
            <div className="w-full md:w-3/4 p-4 md:p-10">
                {renderSection()} 
            </div>
        </div>
    );
};

export default ProfilePage;