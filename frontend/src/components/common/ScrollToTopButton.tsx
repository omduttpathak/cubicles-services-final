import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 400)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed right-5 bottom-5 z-50 flex size-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_12px_35px_rgb(79_70_229/0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgb(79_70_229/0.45)] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}
