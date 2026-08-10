import { Outlet } from "react-router-dom"

import ScrollToTop from "@/components/common/ScrollToTop"
import ScrollToTopButton from "@/components/common/ScrollToTopButton"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <ScrollToTop />

      <ScrollToTopButton />
    </div>
  )
}
