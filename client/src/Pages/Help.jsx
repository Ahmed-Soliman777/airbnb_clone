import React from "react";
import HelpSearch from "../components/Help/HelpSearch";
import HelpLoginSection from "../components/Help/HelpLoginSection";
import HelpGuides from "../components/Help/HelpGuides";
import HelpExploreMore from "../components/Help/HelpExploreMore";
import HelpContact from "../components/Help/HelpContact";
import HelpArticles from "../components/Help/HelpArticales";
import HelpCategories from "../components/Help/HelpCategories";

import { Search } from "lucide-react";
import HelpSearch from '@/components/Help/HelpSearch';
import HelpCategories from '@/components/Help/HelpCategories';
import HelpLoginSection from '@/components/Help/HelpLoginSection';
import HelpGuides from '@/components/Help/HelpGuides';
import HelpArticales from '@/components/Help/HelpArticales';
import HelpExploreMore from '@/components/Help/HelpExploreMore';
import HelpContact from '@/components/Help/HelpContact';
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
      <HelpArticles />
      <HelpExploreMore />
      <HelpContact />
    </div>
  );
};

export default HelpPage;
