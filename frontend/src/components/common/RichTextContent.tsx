import { useMemo } from "react"
import DOMPurify from "dompurify"

import { resolveMediaUrl } from "@/utils/mediaUrl"

type RichTextContentProps = {
  content: string
  className?: string
}

export default function RichTextContent({
  content,
  className = "",
}: RichTextContentProps) {
  const safeHtml = useMemo(() => {
    const normalizedContent = normalizeStoredContent(content)
    const resolvedContent = resolveEmbeddedMediaUrls(normalizedContent)

    return DOMPurify.sanitize(resolvedContent, {
      USE_PROFILES: {
        html: true,
      },
      ADD_ATTR: ["target", "rel", "loading"],
    })
  }, [content])

  return (
    <div
      className={`text-lg leading-9 text-slate-700 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:bg-blue-50 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:text-slate-700 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_hr]:my-10 [&_hr]:border-slate-300 [&_img]:mx-auto [&_img]:my-10 [&_img]:max-h-[680px] [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:object-contain [&_img]:shadow-xl [&_li]:pl-1 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-8 [&_p]:my-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-slate-950 [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-7 [&_pre]:text-slate-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-bold [&_strong]:text-slate-900 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-8 ${className}`}
      dangerouslySetInnerHTML={{
        __html: safeHtml,
      }}
    />
  )
}

function resolveEmbeddedMediaUrls(content: string): string {
  if (!content || typeof window === "undefined") {
    return content
  }

  const parser = new DOMParser()
  const document = parser.parseFromString(content, "text/html")

  document.querySelectorAll("img").forEach((image) => {
    const source = image.getAttribute("src")
    const resolvedSource = resolveMediaUrl(source)

    if (resolvedSource) {
      image.setAttribute("src", resolvedSource)
    }

    image.setAttribute("loading", "lazy")
  })

  document.querySelectorAll("a[target='_blank']").forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer")
  })

  return document.body.innerHTML
}

function normalizeStoredContent(content: string): string {
  const trimmed = content.trim()

  if (!trimmed) {
    return ""
  }

  const decodedContent = decodeEscapedHtml(trimmed)

  if (/<[a-z][\s\S]*>/i.test(decodedContent)) {
    return decodedContent
  }

  return decodedContent
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("")
}

function decodeEscapedHtml(value: string): string {
  if (!value.includes("&lt;") && !value.includes("&gt;")) {
    return value
  }

  const element = document.createElement("textarea")

  element.innerHTML = value

  return element.value
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>")
}
