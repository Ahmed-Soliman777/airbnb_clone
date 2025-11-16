import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import Footer from "@/components/Footer/Footer";
import { Outlet } from "react-router";

const hideHeaderFooter = location.pathname === "/not-found";
export default function Layout() {
  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <Outlet />
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
