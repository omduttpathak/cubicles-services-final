import { useEffect, useMemo, useState, type ReactNode } from "react"
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
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
  GripVertical,
  Link2,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createAdminFooterLink,
  deleteAdminFooterLink,
  getAdminFooterLinks,
  updateAdminFooterLink,
  updateAdminFooterLinkOrder,
  type AdminFooterLink,
  type FooterLinkRequest,
} from "@/api/adminFooterLinksApi"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: FooterLinkRequest = {
  group_name: "Services",
  title: "",
  url: "",
  open_in_new_tab: false,
  display_order: 1,
  is_visible: true,
}

export default function AdminFooterLinks() {
  const [items, setItems] = useState<AdminFooterLink[]>([])
  const [formData, setFormData] = useState<FooterLinkRequest>(initialFormData)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [busyItemId, setBusyItemId] = useState<number | null>(null)
  const [orderChanged, setOrderChanged] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const groupedItems = useMemo(() => {
    const groups = new Map<string, AdminFooterLink[]>()

    items.forEach((item) => {
      const group = groups.get(item.group_name) ?? []

      group.push(item)
      groups.set(item.group_name, group)
    })

    return Array.from(groups.entries())
      .map(([groupName, links]) => ({
        groupName,
        links: sortGroup(links),
      }))
      .sort((first, second) => first.groupName.localeCompare(second.groupName))
  }, [items])

  const visibleCount = useMemo(
    () => items.filter((item) => item.is_visible).length,
    [items]
  )

  const hiddenCount = items.length - visibleCount

  async function loadFooterLinks() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminFooterLinks()

      setItems(response)
      setOrderChanged(false)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadFooterLinks()
  }, [])

  function updateField<Key extends keyof FooterLinkRequest>(
    field: Key,
    value: FooterLinkRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function nextDisplayOrder(groupName: string): number {
    return items.filter((item) => item.group_name === groupName).length + 1
  }

  function openCreateForm() {
    setEditingId(null)
    setFormData({
      ...initialFormData,
      display_order: nextDisplayOrder(initialFormData.group_name),
    })
    setIsFormOpen(true)
  }

  function openEditForm(item: AdminFooterLink) {
    setEditingId(item.id)
    setFormData({
      group_name: item.group_name,
      title: item.title,
      url: item.url,
      open_in_new_tab: item.open_in_new_tab,
      display_order: item.display_order,
      is_visible: item.is_visible,
    })
    setIsFormOpen(true)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  function closeForm() {
    if (isSubmitting) {
      return
    }

    setEditingId(null)
    setFormData(initialFormData)
    setIsFormOpen(false)
  }

  async function handleSubmit() {
    const groupName = formData.group_name.trim()
    const title = formData.title.trim()
    const url = formData.url.trim()

    if (!groupName || !title) {
      toast.error("Group name and link title are required.")
      return
    }

    if (!isValidUrl(url)) {
      toast.error("URL must start with /, http://, https://, mailto: or tel:.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: FooterLinkRequest = {
        group_name: groupName,
        title,
        url,
        open_in_new_tab: formData.open_in_new_tab,
        display_order:
          editingId === null
            ? nextDisplayOrder(groupName)
            : formData.display_order,
        is_visible: formData.is_visible,
      }

      if (editingId === null) {
        const created = await createAdminFooterLink(payload)

        setItems((current) => [...current, created])
        toast.success("Footer link created successfully.")
      } else {
        const updated = await updateAdminFooterLink(editingId, payload)

        setItems((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        )

        toast.success("Footer link updated successfully.")
      }

      closeForm()
    } catch (error) {
      showApiError(error, "Unable to save footer link.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleVisibility(item: AdminFooterLink) {
    try {
      setBusyItemId(item.id)

      const updated = await updateAdminFooterLink(item.id, {
        group_name: item.group_name,
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
      showApiError(error, "Unable to update footer-link visibility.")
    } finally {
      setBusyItemId(null)
    }
  }

  async function handleDelete(item: AdminFooterLink) {
    if (!window.confirm(`Delete "${item.title}" from the footer?`)) {
      return
    }

    try {
      setBusyItemId(item.id)

      await deleteAdminFooterLink(item.id)

      const remaining = normalizeOrders(
        items.filter((currentItem) => currentItem.id !== item.id)
      )

      setItems(remaining)
      setOrderChanged(remaining.length > 0)

      if (editingId === item.id) {
        closeForm()
      }

      toast.success("Footer link deleted successfully.")
    } catch (error) {
      showApiError(error, "Unable to delete footer link.")
    } finally {
      setBusyItemId(null)
    }
  }

  function handleDragEnd(groupName: string, event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setItems((current) => {
      const groupLinks = sortGroup(
        current.filter((item) => item.group_name === groupName)
      )

      const oldIndex = groupLinks.findIndex((item) => item.id === active.id)
      const newIndex = groupLinks.findIndex((item) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1) {
        return current
      }

      const reordered = arrayMove(groupLinks, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          display_order: index + 1,
        })
      )

      const byId = new Map(reordered.map((item) => [item.id, item]))

      return current.map((item) => byId.get(item.id) ?? item)
    })

    setOrderChanged(true)
  }

  async function saveOrder() {
    if (!orderChanged || items.length === 0) {
      return
    }

    try {
      setIsSavingOrder(true)

      const normalized = normalizeOrders(items)

      const updated = await updateAdminFooterLinkOrder(
        normalized.map((item) => ({
          id: item.id,
          group_name: item.group_name,
          display_order: item.display_order,
        }))
      )

      setItems(updated)
      setOrderChanged(false)
      toast.success("Footer-link order saved successfully.")
    } catch (error) {
      showApiError(error, "Unable to save footer-link order.")
    } finally {
      setIsSavingOrder(false)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading footer links..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Footer Links"
        message="The footer links could not be loaded."
        onRetry={() => {
          void loadFooterLinks()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Footer Links | Cubicles Services Admin"
        description="Manage grouped links displayed in the website footer."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Site Management
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Footer Links
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage footer columns, links, visibility, external targets, and
                display order.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={!orderChanged || isSavingOrder}
                onClick={() => {
                  void saveOrder()
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSavingOrder ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                {isSavingOrder ? "Saving Order..." : "Save Order"}
              </button>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                <Plus className="size-4" />
                Add Footer Link
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Links"
            value={items.length}
            description="All footer links"
            icon={<Link2 className="size-5" />}
          />

          <SummaryCard
            label="Visible"
            value={visibleCount}
            description="Displayed publicly"
            icon={<Eye className="size-5" />}
            tone="success"
          />

          <SummaryCard
            label="Hidden"
            value={hiddenCount}
            description="Excluded from footer"
            icon={<EyeOff className="size-5" />}
            tone="neutral"
          />

          <SummaryCard
            label="Groups"
            value={groupedItems.length}
            description="Footer columns"
            icon={<FolderKanban className="size-5" />}
            tone="featured"
          />
        </div>

        {orderChanged && (
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-extrabold text-amber-900">
                Footer order has changed
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Save the new order before leaving this page.
              </p>
            </div>

            <button
              type="button"
              disabled={isSavingOrder}
              onClick={() => {
                void saveOrder()
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingOrder ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              {isSavingOrder ? "Saving..." : "Save Order"}
            </button>
          </div>
        )}

        {isFormOpen && (
          <FormCard
            title={editingId === null ? "Add Footer Link" : "Edit Footer Link"}
            description="Links using the same group name appear together in one footer column."
            action={
              <button
                type="button"
                disabled={isSubmitting}
                onClick={closeForm}
                aria-label="Close footer-link form"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField id="footer-group-name" label="Group Name" required>
                <input
                  id="footer-group-name"
                  type="text"
                  maxLength={100}
                  value={formData.group_name}
                  placeholder="Services"
                  onChange={(event) =>
                    updateField("group_name", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.group_name.length}
                  maximum={100}
                />
              </FormField>

              <FormField id="footer-link-title" label="Link Title" required>
                <input
                  id="footer-link-title"
                  type="text"
                  maxLength={100}
                  value={formData.title}
                  placeholder="Cloud Migration"
                  onChange={(event) => updateField("title", event.target.value)}
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <CharacterCount current={formData.title.length} maximum={100} />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  id="footer-link-url"
                  label="URL"
                  required
                  description="Examples: /services/cloud-migration, https://example.com, mailto:hello@example.com"
                >
                  <input
                    id="footer-link-url"
                    type="text"
                    maxLength={500}
                    value={formData.url}
                    placeholder="/services/cloud-migration"
                    onChange={(event) => updateField("url", event.target.value)}
                    className={`${inputClassName} font-mono text-sm`}
                    disabled={isSubmitting}
                  />

                  <CharacterCount current={formData.url.length} maximum={500} />
                </FormField>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ToggleCard
                title="Visible"
                description="Show this link in the public footer."
                checked={formData.is_visible}
                disabled={isSubmitting}
                onChange={(checked) => updateField("is_visible", checked)}
              />

              <ToggleCard
                title="Open in New Tab"
                description="Recommended for external websites and documents."
                checked={formData.open_in_new_tab}
                disabled={isSubmitting}
                onChange={(checked) => updateField("open_in_new_tab", checked)}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={closeForm}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleSubmit()
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}

                {isSubmitting ? "Saving..." : "Save Footer Link"}
              </button>
            </div>
          </FormCard>
        )}

        {groupedItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Link2 className="size-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No Footer Links
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Add the first footer link to create a footer column.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="size-4" />
              Add Footer Link
            </button>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {groupedItems.map((group) => (
              <FormCard
                key={group.groupName}
                title={group.groupName}
                description={`${group.links.length} ${
                  group.links.length === 1 ? "link" : "links"
                } in this footer column.`}
                action={
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <FolderKanban className="size-5" />
                  </div>
                }
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(group.groupName, event)}
                >
                  <SortableContext
                    items={group.links.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {group.links.map((item) => (
                        <SortableFooterLinkRow
                          key={item.id}
                          item={item}
                          isBusy={busyItemId === item.id}
                          onEdit={() => openEditForm(item)}
                          onToggleVisibility={() => {
                            void toggleVisibility(item)
                          }}
                          onDelete={() => {
                            void handleDelete(item)
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </FormCard>
            ))}
          </div>
        )}

        <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
              <CheckCircle2 className="size-5" />
            </div>

            <div>
              <h2 className="font-extrabold text-slate-950">Footer guidance</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep group names consistent, use short link labels, and open
                only genuinely external destinations in a new tab.
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  )
}

function SortableFooterLinkRow({
  item,
  isBusy,
  onEdit,
  onToggleVisibility,
  onDelete,
}: {
  item: AdminFooterLink
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
  } = useSortable({
    id: item.id,
  })

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`rounded-2xl border p-4 transition ${
        isDragging
          ? "relative z-10 border-blue-300 bg-blue-50 shadow-xl"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="inline-flex size-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:cursor-grabbing"
          aria-label={`Drag ${item.title}`}
        >
          <GripVertical className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-slate-950">{item.title}</h3>

            <VisibilityBadge isVisible={item.is_visible} />

            {item.open_in_new_tab && (
              <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 ring-inset">
                <ExternalLink className="mr-1 size-3" />
                New Tab
              </span>
            )}
          </div>

          <p className="mt-2 truncate font-mono text-sm text-slate-500">
            {item.url}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            Position {item.display_order}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={isBusy}
          onClick={onToggleVisibility}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          title={item.is_visible ? "Hide link" : "Show link"}
        >
          {isBusy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : item.is_visible ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </button>

        <button
          type="button"
          disabled={isBusy}
          onClick={onEdit}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
          title="Edit link"
        >
          <Pencil className="size-4" />
        </button>

        <button
          type="button"
          disabled={isBusy}
          onClick={onDelete}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          title="Delete link"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  )
}

function VisibilityBadge({ isVisible }: { isVisible: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        isVisible
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isVisible ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />

      {isVisible ? "Visible" : "Hidden"}
    </span>
  )
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  tone = "default",
}: {
  label: string
  value: number
  description: string
  icon: ReactNode
  tone?: "default" | "success" | "neutral" | "featured"
}) {
  const toneClasses = {
    default: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    neutral: "bg-slate-100 text-slate-700",
    featured: "bg-violet-50 text-violet-700",
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${toneClasses[tone]}`}>{icon}</div>
      </div>
    </div>
  )
}

function ToggleCard({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
        checked
          ? "border-blue-200 bg-blue-50/70"
          : "border-slate-200 bg-white hover:bg-slate-50"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>

      <span>
        <span className="block text-sm font-extrabold text-slate-950">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  )
}

function sortGroup(items: AdminFooterLink[]): AdminFooterLink[] {
  return [...items].sort(
    (first, second) =>
      first.display_order - second.display_order || first.id - second.id
  )
}

function normalizeOrders(items: AdminFooterLink[]): AdminFooterLink[] {
  const groups = new Map<string, AdminFooterLink[]>()

  items.forEach((item) => {
    const group = groups.get(item.group_name) ?? []

    group.push(item)
    groups.set(item.group_name, group)
  })

  const normalized: AdminFooterLink[] = []

  groups.forEach((groupItems) => {
    sortGroup(groupItems).forEach((item, index) => {
      normalized.push({
        ...item,
        display_order: index + 1,
      })
    })
  })

  return normalized
}

function isValidUrl(value: string): boolean {
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
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
