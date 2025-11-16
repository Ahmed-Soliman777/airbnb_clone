import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* please add footer comonent here */}
    </>
  );
}
