import Navbar from "@/components/Navbar/Navbar";
import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import { Outlet, useLocation } from "react-router";
import GlobalModal from "@/components/GlobalModal/GlobalModal";
import { useSelector } from "react-redux";

export default function Layout() {
  const location = useLocation();
  const { direction } = useSelector((state) => state.lang);

  const [showGlobalModal, setShowGlobalModal] = useState(false);

  const toggleTranslateModal = () => setShowGlobalModal((prev) => !prev);
  const closeModal = () => setShowGlobalModal(false);

  const hideHeaderFooter = location.pathname === "/not-found";

  // update HTML direction whenever language changes
  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  return (
    <>
      {!hideHeaderFooter && (
        <Navbar toggleTranslateModal={toggleTranslateModal} />
      )}

      <Outlet />

      {!hideHeaderFooter && <Footer />}

      {/* GlobalModal with Tailwind transitions */}
      <GlobalModal isOpen={showGlobalModal} closeModal={closeModal} />
    </>
  );
}