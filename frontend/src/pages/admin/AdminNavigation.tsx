import { useEffect, useMemo, useState } from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import axios from "axios"
import {
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Link2,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createNavigationItem,
  deleteNavigationItem,
  getNavigationItems,
  updateNavigationItem,
  updateNavigationOrder,
  type NavigationCreate,
  type NavigationItem,
} from "@/api/adminNavigationApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const emptyForm: NavigationCreate = {
  title: "",
  url: "",
  open_in_new_tab: false,
  display_order: 0,
  is_visible: true,
}

export default function AdminNavigation() {
  const [items, setItems] = useState<NavigationItem[]>([])
  const [formData, setFormData] = useState<NavigationCreate>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [orderChanged, setOrderChanged] = useState(false)
  const [busyItemId, setBusyItemId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const visibleCount = useMemo(
    () => items.filter((item) => item.is_visible).length,
    [items]
  )

  async function loadNavigation() {
    try {
      setIsLoading(true)
      setHasError(false)
      setItems(sortItems(await getNavigationItems()))
      setOrderChanged(false)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadNavigation()
  }, [])

  function openCreateForm() {
    setEditingId(null)
    setFormData({ ...emptyForm, display_order: items.length + 1 })
    setIsFormOpen(true)
  }

  function openEditForm(item: NavigationItem) {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      url: item.url,
      open_in_new_tab: item.open_in_new_tab,
      display_order: item.display_order,
      is_visible: item.is_visible,
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    if (isSubmitting) return
    setEditingId(null)
    setFormData(emptyForm)
    setIsFormOpen(false)
  }

  function updateFormField<Key extends keyof NavigationCreate>(
    field: Key,
    value: NavigationCreate[Key]
  ) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit() {
    const title = formData.title.trim()
    const url = formData.url.trim()

    if (!title) {
      toast.error("Menu title is required.")
      return
    }

    if (!isValidNavigationUrl(url)) {
      toast.error("URL must start with /, http://, https://, mailto: or tel:.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: NavigationCreate = {
        title,
        url,
        open_in_new_tab: formData.open_in_new_tab,
        display_order:
          editingId === null ? items.length + 1 : formData.display_order,
        is_visible: formData.is_visible,
      }

      if (editingId === null) {
        const created = await createNavigationItem(payload)
        setItems((current) => sortItems([...current, created]))
        toast.success("Navigation item created successfully.")
      } else {
        const updated = await updateNavigationItem(editingId, payload)
        setItems((current) =>
          sortItems(
            current.map((item) => (item.id === updated.id ? updated : item))
          )
        )
        toast.success("Navigation item updated successfully.")
      }

      setEditingId(null)
      setFormData(emptyForm)
      setIsFormOpen(false)
    } catch (error) {
      showApiError(error, "Unable to save navigation item.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVisibilityToggle(item: NavigationItem) {
    try {
      setBusyItemId(item.id)
      const updated = await updateNavigationItem(item.id, {
        title: item.title,
        url: item.url,
        open_in_new_tab: item.open_in_new_tab,
        display_order: item.display_order,
        is_visible: !item.is_visible,
      })
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === updated.id ? updated : currentItem
        )
      )
      toast.success(
        updated.is_visible
          ? `${updated.title} is now visible.`
          : `${updated.title} is now hidden.`
      )
    } catch (error) {
      showApiError(error, "Unable to update navigation visibility.")
    } finally {
      setBusyItemId(null)
    }
  }

  async function handleDelete(item: NavigationItem) {
    if (!window.confirm(`Delete "${item.title}" from the navigation?`)) return

    try {
      setBusyItemId(item.id)
      await deleteNavigationItem(item.id)
      const remaining = items.filter(
        (currentItem) => currentItem.id !== item.id
      )
      setItems(
        remaining.map((currentItem, index) => ({
          ...currentItem,
          display_order: index + 1,
        }))
      )
      setOrderChanged(remaining.length > 0)
      if (editingId === item.id) closeForm()
      toast.success("Navigation item deleted successfully.")
    } catch (error) {
      showApiError(error, "Unable to delete navigation item.")
    } finally {
      setBusyItemId(null)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id)
      const newIndex = current.findIndex((item) => item.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return current

      return arrayMove(current, oldIndex, newIndex).map((item, index) => ({
        ...item,
        display_order: index + 1,
      }))
    })
    setOrderChanged(true)
  }

  async function handleSaveOrder() {
    if (!orderChanged || items.length === 0) return

    try {
      setIsSavingOrder(true)
      setItems(
        sortItems(await updateNavigationOrder(items.map((item) => item.id)))
      )
      setOrderChanged(false)
      toast.success("Navigation order saved successfully.")
    } catch (error) {
      showApiError(error, "Unable to save navigation order.")
    } finally {
      setIsSavingOrder(false)
    }
  }

  if (isLoading) return <PageLoader message="Loading navigation..." />

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Navigation"
        message="The website navigation could not be loaded."
        onRetry={() => void loadNavigation()}
      />
    )
  }

  return (
    <>
      <SEO
        title="Navigation Manager | Cubicles Services Admin"
        description="Manage the public website navigation."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Site Management
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Navigation Manager
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Add, edit, reorder and control public menu links.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!orderChanged || isSavingOrder}
              onClick={() => void handleSaveOrder()}
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingOrder ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSavingOrder ? "Saving Order..." : "Save Order"}
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Items" value={items.length} />
          <SummaryCard label="Visible" value={visibleCount} />
          <SummaryCard label="Hidden" value={items.length - visibleCount} />
        </div>

        {isFormOpen && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId === null ? "Add Menu Item" : "Edit Menu Item"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Internal URLs begin with `/`. External URLs begin with
                  `https://`.
                </p>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={closeForm}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                aria-label="Close navigation form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <FormField label="Menu Title" required>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.title}
                  onChange={(event) =>
                    updateFormField("title", event.target.value)
                  }
                  placeholder="About"
                  className={inputClassName}
                />
              </FormField>

              <FormField label="URL" required>
                <input
                  type="text"
                  maxLength={500}
                  value={formData.url}
                  onChange={(event) =>
                    updateFormField("url", event.target.value)
                  }
                  placeholder="/about"
                  className={`${inputClassName} font-mono text-sm`}
                />
              </FormField>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <CheckboxCard
                title="Visible"
                description="Show this item in the public navigation."
                checked={formData.is_visible}
                onChange={(checked) => updateFormField("is_visible", checked)}
              />
              <CheckboxCard
                title="Open in New Tab"
                description="Useful for external links and documents."
                checked={formData.open_in_new_tab}
                onChange={(checked) =>
                  updateFormField("open_in_new_tab", checked)
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={closeForm}
                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSubmit()}
                className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : editingId === null ? (
                  <Plus className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSubmitting
                  ? "Saving..."
                  : editingId === null
                    ? "Create Item"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">Menu Items</h2>
            <p className="mt-1 text-sm text-slate-500">
              Drag items by the handle and click Save Order when finished.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Link2 className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No Navigation Items
              </h3>
              <p className="mt-2 text-slate-500">
                Add the first menu item to begin building the website
                navigation.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <SortableNavigationRow
                      key={item.id}
                      item={item}
                      isBusy={busyItemId === item.id}
                      onEdit={() => openEditForm(item)}
                      onToggleVisibility={() =>
                        void handleVisibilityToggle(item)
                      }
                      onDelete={() => void handleDelete(item)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </section>
    </>
  )
}

function SortableNavigationRow({
  item,
  isBusy,
  onEdit,
  onToggleVisibility,
  onDelete,
}: {
  item: NavigationItem
  isBusy: boolean
  onEdit: () => void
  onToggleVisibility: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`grid gap-4 px-5 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center ${
        isDragging ? "relative z-10 bg-blue-50 shadow-lg" : "bg-white"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="inline-flex h-10 w-10 cursor-grab touch-none items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:cursor-grabbing"
        aria-label={`Drag ${item.title}`}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900">{item.title}</h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              item.is_visible
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {item.is_visible ? "Visible" : "Hidden"}
          </span>
          {item.open_in_new_tab && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
              <ExternalLink className="mr-1 h-3 w-3" />
              New Tab
            </span>
          )}
        </div>
        <p className="mt-1 truncate font-mono text-sm text-slate-500">
          {item.url}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Position {item.display_order}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:justify-end">
        <button
          type="button"
          disabled={isBusy}
          onClick={onToggleVisibility}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          title={item.is_visible ? "Hide item" : "Show item"}
        >
          {isBusy ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : item.is_visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onEdit}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
          title="Edit item"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onDelete}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          title="Delete item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
    </label>
  )
}

function CheckboxCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4"
      />
      <span>
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  )
}

function sortItems(items: NavigationItem[]): NavigationItem[] {
  return [...items].sort(
    (first, second) =>
      first.display_order - second.display_order || first.id - second.id
  )
}

function isValidNavigationUrl(value: string): boolean {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  )
}

function showApiError(error: unknown, fallbackMessage: string) {
  console.error(error)

  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail

    if (typeof detail === "string") {
      toast.error(detail)
      return
    }

    if (Array.isArray(detail) && detail.length > 0) {
      toast.error(detail[0]?.msg || fallbackMessage)
      return
    }
  }

  toast.error(fallbackMessage)
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
