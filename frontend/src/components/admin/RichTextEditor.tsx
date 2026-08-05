import { useEffect, useState, type ReactNode } from "react"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  UnderlineIcon,
  Undo2,
} from "lucide-react"

import type { AdminMediaItem } from "@/api/adminMediaApi"
import { MediaPickerModal } from "@/components/admin/media"
import { resolveMediaUrl } from "@/utils/mediaUrl"

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
}: RichTextEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class:
            "font-semibold text-blue-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-700",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:pointer-events-none before:float-left before:h-0 before:text-slate-400 before:content-[attr(data-placeholder)]",
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class:
            "mx-auto my-6 max-h-[560px] max-w-full rounded-2xl object-contain shadow-md",
          loading: "lazy",
        },
      }),
    ],
    content: normalizeEditorContent(value),
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-80 px-5 py-4 text-base leading-8 text-slate-700 outline-none " +
          "[&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:underline-offset-4 " +
          "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 " +
          "[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 " +
          "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 " +
          "[&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-7 " +
          "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:my-1 " +
          "[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 " +
          "[&_blockquote]:bg-blue-50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic " +
          "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-950 " +
          "[&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-slate-100 " +
          "[&_hr]:my-7 [&_hr]:border-slate-300 " +
          "[&_img]:mx-auto [&_img]:my-6 [&_img]:max-h-[560px] [&_img]:max-w-full " +
          "[&_img]:rounded-2xl [&_img]:object-contain [&_img]:shadow-md",
        "aria-label": placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(!disabled)
  }, [disabled, editor])

  useEffect(() => {
    if (!editor) {
      return
    }

    const normalizedValue = normalizeEditorContent(value)

    if (editor.getHTML() !== normalizedValue) {
      editor.commands.setContent(normalizedValue, {
        emitUpdate: false,
      })
    }
  }, [editor, value])

  function insertSelectedImage(item: AdminMediaItem) {
    if (!editor) {
      return
    }

    const renderedUrl = resolveMediaUrl(item.file_url)

    if (!renderedUrl) {
      return
    }

    const altText = createImageAltText(item.filename)

    editor
      .chain()
      .focus()
      .setImage({
        src: renderedUrl,
        alt: altText,
        title: altText,
      })
      .createParagraphNear()
      .run()
  }

  if (!editor) {
    return (
      <div className="min-h-80 animate-pulse rounded-xl border border-slate-300 bg-slate-50" />
    )
  }

  return (
    <>
      <div
        className={`overflow-hidden rounded-xl border bg-white transition ${
          editor.isFocused
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-slate-300"
        } ${disabled ? "opacity-70" : ""}`}
      >
        <EditorToolbar
          editor={editor}
          disabled={disabled}
          onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
        />

        <EditorContent editor={editor} />
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        title="Insert Image"
        description="Choose an image to insert at the current editor position."
        onSelect={insertSelectedImage}
        onClose={() => setIsMediaPickerOpen(false)}
      />
    </>
  )
}

function EditorToolbar({
  editor,
  disabled,
  onOpenMediaPicker,
}: {
  editor: Editor
  disabled: boolean
  onOpenMediaPicker: () => void
}) {
  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined

    const url = window.prompt(
      "Enter the destination URL:",
      previousUrl ?? "https://"
    )

    if (url === null) {
      return
    }

    const normalizedUrl = url.trim()

    if (!normalizedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: normalizedUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run()
  }

  return (
    <div className="border-b border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          label="Paragraph"
          icon={<Pilcrow className="size-4" />}
          active={editor.isActive("paragraph")}
          disabled={disabled}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />

        <ToolbarButton
          label="Heading 2"
          icon={<Heading2 className="size-4" />}
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />

        <ToolbarButton
          label="Heading 3"
          icon={<Heading3 className="size-4" />}
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />

        <ToolbarDivider />

        <ToolbarButton
          label="Bold"
          icon={<Bold className="size-4" />}
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        <ToolbarButton
          label="Italic"
          icon={<Italic className="size-4" />}
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />

        <ToolbarButton
          label="Underline"
          icon={<UnderlineIcon className="size-4" />}
          active={editor.isActive("underline")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />

        <ToolbarButton
          label="Strikethrough"
          icon={<Strikethrough className="size-4" />}
          active={editor.isActive("strike")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <ToolbarDivider />

        <ToolbarButton
          label="Add or edit link"
          icon={<Link2 className="size-4" />}
          active={editor.isActive("link")}
          disabled={disabled}
          onClick={setLink}
        />

        <ToolbarButton
          label="Remove link"
          icon={<Link2Off className="size-4" />}
          disabled={disabled || !editor.isActive("link")}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        />

        <ToolbarButton
          label="Insert image"
          icon={<ImagePlus className="size-4" />}
          disabled={disabled}
          onClick={onOpenMediaPicker}
        />

        <ToolbarDivider />

        <ToolbarButton
          label="Align left"
          icon={<AlignLeft className="size-4" />}
          active={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />

        <ToolbarButton
          label="Align center"
          icon={<AlignCenter className="size-4" />}
          active={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />

        <ToolbarButton
          label="Align right"
          icon={<AlignRight className="size-4" />}
          active={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />

        <ToolbarDivider />

        <ToolbarButton
          label="Bullet list"
          icon={<List className="size-4" />}
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />

        <ToolbarButton
          label="Numbered list"
          icon={<ListOrdered className="size-4" />}
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <ToolbarButton
          label="Quote"
          icon={<Quote className="size-4" />}
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />

        <ToolbarButton
          label="Code block"
          icon={<Code2 className="size-4" />}
          active={editor.isActive("codeBlock")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />

        <ToolbarButton
          label="Divider"
          icon={<Minus className="size-4" />}
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <ToolbarDivider />

        <ToolbarButton
          label="Undo"
          icon={<Undo2 className="size-4" />}
          disabled={disabled || !editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />

        <ToolbarButton
          label="Redo"
          icon={<Redo2 className="size-4" />}
          disabled={disabled || !editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
    </div>
  )
}

function ToolbarButton({
  label,
  icon,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string
  icon: ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex size-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100"
      }`}
    >
      {icon}
    </button>
  )
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-0.5 h-9 w-px bg-slate-300" />
}

function createImageAltText(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeEditorContent(value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    return ""
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("")
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
