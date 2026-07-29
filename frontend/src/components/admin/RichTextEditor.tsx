import { useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

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
  const editor = useEditor({
    extensions: [StarterKit],
    content: normalizeEditorContent(value),
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-80 px-5 py-4 text-base leading-8 text-slate-700 outline-none " +
          "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 " +
          "[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 " +
          "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 " +
          "[&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-7 " +
          "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:my-1 " +
          "[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 " +
          "[&_blockquote]:bg-blue-50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic " +
          "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-950 " +
          "[&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-slate-100 " +
          "[&_hr]:my-7 [&_hr]:border-slate-300",
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

  if (!editor) {
    return (
      <div className="min-h-80 animate-pulse rounded-xl border border-slate-300 bg-slate-50" />
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition ${
        editor.isFocused
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-slate-300"
      }`}
    >
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
        <ToolbarButton
          label="Paragraph"
          active={editor.isActive("paragraph")}
          disabled={disabled}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />

        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", {
            level: 2,
          })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />

        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", {
            level: 3,
          })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />

        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />

        <ToolbarButton
          label="Bullet List"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />

        <ToolbarButton
          label="Numbered List"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />

        <ToolbarButton
          label="Code"
          active={editor.isActive("codeBlock")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />

        <ToolbarButton
          label="Divider"
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <ToolbarButton
          label="Undo"
          disabled={disabled || !editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />

        <ToolbarButton
          label="Redo"
          disabled={disabled || !editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  )
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
