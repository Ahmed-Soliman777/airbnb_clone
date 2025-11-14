import Navbar from '@/components/Navbar/Navbar'
import React from 'react'
import Footer from '@/components/Footer/Footer'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      {/* please add footer comonent here */}
    </>
  )
}
