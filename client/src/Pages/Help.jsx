import React from 'react';




import { Search } from "lucide-react";
const HelpPage = () => {

  return (
    <div className="min-h-screen bg-white">

      <section className="bg-white py-16">
        {/* search section */}
        <HelpSearch />
        {/* 
                categories Section */}
                <HelpCategories />
            </section>
            {/* Login/Signup Section */}
            <HelpLoginSection />
            {/* Guides 4 */}
            <HelpGuides />
            {/* Top Articles Section */}
            <HelpArticales />
            <HelpExploreMore />
            <HelpContact />




    </div>
  );
};

export default HelpPage;