import { useEffect, useState } from "react"

import type { HomepageSettings } from "@/api/homepageApi"
import HomepageRenderer from "@/components/home/HomepageRenderer"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { fallbackHomepageSettings } from "@/pages/Home"

type PreviewMessage = {
  type: "homepage-preview-update"
  settings: HomepageSettings
}

export default function HomepagePreview() {
  const [settings, setSettings] = useState<HomepageSettings>(
    fallbackHomepageSettings
  )

  useEffect(() => {
    function handleMessage(event: MessageEvent<PreviewMessage>) {
      if (event.origin !== window.location.origin) {
        return
      }

      if (
        event.data?.type === "homepage-preview-update" &&
        event.data.settings
      ) {
        setSettings(event.data.settings)
      }
    }

    window.addEventListener("message", handleMessage)

    window.parent.postMessage(
      {
        type: "homepage-preview-ready",
      },
      window.location.origin
    )

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HomepageRenderer settings={settings} />
      </main>
      <Footer />
    </div>
  )
}
