import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
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
  ChevronDown,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Home,
  Monitor,
  RefreshCw,
  Save,
  Search,
  Smartphone,
  Tablet,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminHomepageSettings,
  updateAdminHomepageSettings,
  type HomepageSection,
  type UpdateHomepageSettingsRequest,
} from "@/api/adminHomepageApi"
import type { HomepageSettings } from "@/api/homepageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"
import { fallbackHomepageSettings } from "@/pages/Home"

type EditorPanel = HomepageSection | "seo"
type PreviewDevice = "desktop" | "tablet" | "mobile"

const defaultSectionOrder: HomepageSection[] = [
  "hero",
  "services",
  "technologies",
  "benefits",
  "industries",
  "case_studies",
  "testimonials",
  "stats",
  "faq",
  "cta",
]

const initialFormData: UpdateHomepageSettingsRequest = {
  ...fallbackHomepageSettings,
}

delete (initialFormData as Partial<HomepageSettings>).id

const sectionLabels: Record<HomepageSection, string> = {
  hero: "Hero",
  services: "Services",
  technologies: "Technologies",
  benefits: "Benefits",
  industries: "Industries",
  case_studies: "Case Studies",
  testimonials: "Testimonials",
  stats: "Statistics",
  faq: "FAQs",
  cta: "Call to Action",
}

type VisibilityField =
  | "show_hero"
  | "show_services"
  | "show_technologies"
  | "show_benefits"
  | "show_industries"
  | "show_case_studies"
  | "show_testimonials"
  | "show_stats"
  | "show_faq"
  | "show_cta"

const visibilityFields: Record<HomepageSection, VisibilityField> = {
  hero: "show_hero",
  services: "show_services",
  technologies: "show_technologies",
  benefits: "show_benefits",
  industries: "show_industries",
  case_studies: "show_case_studies",
  testimonials: "show_testimonials",
  stats: "show_stats",
  faq: "show_faq",
  cta: "show_cta",
}

const previewWidths: Record<PreviewDevice, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
}

export default function AdminHomepage() {
  const [formData, setFormData] =
    useState<UpdateHomepageSettingsRequest>(initialFormData)
  const [openPanel, setOpenPanel] = useState<EditorPanel>("hero")
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop")
  const [previewKey, setPreviewKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editorRefs = useRef<
    Partial<Record<EditorPanel, HTMLDivElement | null>>
  >({})
  const previewRef = useRef<HTMLIFrameElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const sendPreviewUpdate = useCallback(() => {
    const settings: HomepageSettings = {
      id: 0,
      ...formData,
    }

    previewRef.current?.contentWindow?.postMessage(
      {
        type: "homepage-preview-update",
        settings,
      },
      window.location.origin
    )
  }, [formData])

  useEffect(() => {
    const timeout = window.setTimeout(sendPreviewUpdate, 120)

    return () => window.clearTimeout(timeout)
  }, [previewKey, sendPreviewUpdate])

  useEffect(() => {
    function handlePreviewReady(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "homepage-preview-ready"
      ) {
        sendPreviewUpdate()
      }
    }

    window.addEventListener("message", handlePreviewReady)

    return () => {
      window.removeEventListener("message", handlePreviewReady)
    }
  }, [sendPreviewUpdate])

  function updateField<Key extends keyof UpdateHomepageSettingsRequest>(
    field: Key,
    value: UpdateHomepageSettingsRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function toggleSection(section: HomepageSection) {
    const field = visibilityFields[section]

    setFormData((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setFormData((current) => {
      const oldIndex = current.section_order.indexOf(
        active.id as HomepageSection
      )
      const newIndex = current.section_order.indexOf(over.id as HomepageSection)

      if (oldIndex === -1 || newIndex === -1) {
        return current
      }

      return {
        ...current,
        section_order: arrayMove(current.section_order, oldIndex, newIndex),
      }
    })
  }

  function openEditorPanel(panel: EditorPanel) {
    setOpenPanel(panel)

    window.requestAnimationFrame(() => {
      editorRefs.current[panel]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  async function loadHomepageSettings() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminHomepageSettings()
      const { id: _id, ...settings } = response

      setFormData({
        ...settings,
        section_order:
          settings.section_order.length === defaultSectionOrder.length
            ? settings.section_order
            : defaultSectionOrder,
      })
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit() {
    try {
      setIsSubmitting(true)

      const updated = await updateAdminHomepageSettings({
        ...formData,
        hero_badge: formData.hero_badge.trim(),
        hero_title: formData.hero_title.trim(),
        hero_description: formData.hero_description.trim(),
        primary_button_text: formData.primary_button_text.trim(),
        primary_button_url: formData.primary_button_url.trim(),
        secondary_button_text: formData.secondary_button_text.trim(),
        secondary_button_url: formData.secondary_button_url.trim(),
        cta_title: formData.cta_title.trim(),
        cta_description: formData.cta_description.trim(),
        cta_button_text: formData.cta_button_text.trim(),
        cta_button_url: formData.cta_button_url.trim(),
        seo_title: formData.seo_title.trim(),
        seo_description: formData.seo_description.trim(),
        services_title: formData.services_title.trim(),
        services_description: formData.services_description.trim(),
        technologies_title: formData.technologies_title.trim(),
        technologies_description: formData.technologies_description.trim(),
        benefits_title: formData.benefits_title.trim(),
        benefits_description: formData.benefits_description.trim(),
        industries_title: formData.industries_title.trim(),
        industries_description: formData.industries_description.trim(),
        case_studies_title: formData.case_studies_title.trim(),
        case_studies_description: formData.case_studies_description.trim(),
        testimonials_title: formData.testimonials_title.trim(),
        testimonials_description: formData.testimonials_description.trim(),
        stats_title: formData.stats_title.trim(),
        stats_description: formData.stats_description.trim(),
        faq_title: formData.faq_title.trim(),
        faq_description: formData.faq_description.trim(),
      })

      const { id: _id, ...settings } = updated
      setFormData(settings)
      toast.success("Homepage settings updated successfully.")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the homepage settings.")
        } else {
          toast.error("Unable to update homepage settings.")
        }
      } else {
        toast.error("Unable to update homepage settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadHomepageSettings()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading homepage settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Homepage Settings"
        message="The homepage settings could not be loaded."
        onRetry={() => {
          void loadHomepageSettings()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Homepage Builder | Cubicles Services Admin"
        description="Manage homepage content, visibility and section order."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Homepage Builder
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Edit content and review unsaved changes in the live preview.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void handleSubmit()
            }}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Live Homepage Preview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Preview changes before saving them to the public website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PreviewDeviceButton
                label="Desktop"
                icon={<Monitor className="h-4 w-4" />}
                active={previewDevice === "desktop"}
                onClick={() => setPreviewDevice("desktop")}
              />
              <PreviewDeviceButton
                label="Tablet"
                icon={<Tablet className="h-4 w-4" />}
                active={previewDevice === "tablet"}
                onClick={() => setPreviewDevice("tablet")}
              />
              <PreviewDeviceButton
                label="Mobile"
                icon={<Smartphone className="h-4 w-4" />}
                active={previewDevice === "mobile"}
                onClick={() => setPreviewDevice("mobile")}
              />

              <button
                type="button"
                onClick={() => setPreviewKey((current) => current + 1)}
                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Public Site
              </a>
            </div>
          </div>

          <div className="overflow-x-auto bg-slate-200 p-4">
            <div
              className="mx-auto overflow-hidden rounded-lg bg-white shadow-lg transition-[width] duration-300"
              style={{
                width: previewWidths[previewDevice],
                maxWidth: "100%",
              }}
            >
              <iframe
                key={previewKey}
                ref={previewRef}
                src="/admin/homepage-preview"
                title="Homepage live preview"
                onLoad={sendPreviewUpdate}
                className="h-[720px] w-full border-0 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <AccordionPanel
              panel="hero"
              title="Hero Section"
              description="Main homepage introduction."
              isOpen={openPanel === "hero"}
              onToggle={() => setOpenPanel("hero")}
              registerRef={(element) => {
                editorRefs.current.hero = element
              }}
            >
              <TextField
                label="Hero Badge"
                value={formData.hero_badge}
                onChange={(value) => updateField("hero_badge", value)}
              />
              <TextAreaField
                label="Hero Title"
                value={formData.hero_title}
                onChange={(value) => updateField("hero_title", value)}
              />
              <TextAreaField
                label="Hero Description"
                value={formData.hero_description}
                onChange={(value) => updateField("hero_description", value)}
              />
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="Primary Button Text"
                  value={formData.primary_button_text}
                  onChange={(value) =>
                    updateField("primary_button_text", value)
                  }
                />
                <TextField
                  label="Primary Button URL"
                  value={formData.primary_button_url}
                  onChange={(value) => updateField("primary_button_url", value)}
                />
                <TextField
                  label="Secondary Button Text"
                  value={formData.secondary_button_text}
                  onChange={(value) =>
                    updateField("secondary_button_text", value)
                  }
                />
                <TextField
                  label="Secondary Button URL"
                  value={formData.secondary_button_url}
                  onChange={(value) =>
                    updateField("secondary_button_url", value)
                  }
                />
              </div>
            </AccordionPanel>

            <SectionContentPanel
              panel="services"
              title="Services Section"
              isOpen={openPanel === "services"}
              onToggle={() => setOpenPanel("services")}
              registerRef={(element) => {
                editorRefs.current.services = element
              }}
              sectionTitle={formData.services_title}
              sectionDescription={formData.services_description}
              onTitleChange={(value) => updateField("services_title", value)}
              onDescriptionChange={(value) =>
                updateField("services_description", value)
              }
            />

            <SectionContentPanel
              panel="technologies"
              title="Technologies Section"
              isOpen={openPanel === "technologies"}
              onToggle={() => setOpenPanel("technologies")}
              registerRef={(element) => {
                editorRefs.current.technologies = element
              }}
              sectionTitle={formData.technologies_title}
              sectionDescription={formData.technologies_description}
              onTitleChange={(value) =>
                updateField("technologies_title", value)
              }
              onDescriptionChange={(value) =>
                updateField("technologies_description", value)
              }
            />

            <SectionContentPanel
              panel="benefits"
              title="Benefits Section"
              isOpen={openPanel === "benefits"}
              onToggle={() => setOpenPanel("benefits")}
              registerRef={(element) => {
                editorRefs.current.benefits = element
              }}
              sectionTitle={formData.benefits_title}
              sectionDescription={formData.benefits_description}
              onTitleChange={(value) => updateField("benefits_title", value)}
              onDescriptionChange={(value) =>
                updateField("benefits_description", value)
              }
            />

            <SectionContentPanel
              panel="industries"
              title="Industries Section"
              isOpen={openPanel === "industries"}
              onToggle={() => setOpenPanel("industries")}
              registerRef={(element) => {
                editorRefs.current.industries = element
              }}
              sectionTitle={formData.industries_title}
              sectionDescription={formData.industries_description}
              onTitleChange={(value) => updateField("industries_title", value)}
              onDescriptionChange={(value) =>
                updateField("industries_description", value)
              }
            />

            <SectionContentPanel
              panel="case_studies"
              title="Case Studies Section"
              isOpen={openPanel === "case_studies"}
              onToggle={() => setOpenPanel("case_studies")}
              registerRef={(element) => {
                editorRefs.current.case_studies = element
              }}
              sectionTitle={formData.case_studies_title}
              sectionDescription={formData.case_studies_description}
              onTitleChange={(value) =>
                updateField("case_studies_title", value)
              }
              onDescriptionChange={(value) =>
                updateField("case_studies_description", value)
              }
            />

            <SectionContentPanel
              panel="testimonials"
              title="Testimonials Section"
              isOpen={openPanel === "testimonials"}
              onToggle={() => setOpenPanel("testimonials")}
              registerRef={(element) => {
                editorRefs.current.testimonials = element
              }}
              sectionTitle={formData.testimonials_title}
              sectionDescription={formData.testimonials_description}
              onTitleChange={(value) =>
                updateField("testimonials_title", value)
              }
              onDescriptionChange={(value) =>
                updateField("testimonials_description", value)
              }
            />

            <SectionContentPanel
              panel="stats"
              title="Statistics Section"
              isOpen={openPanel === "stats"}
              onToggle={() => setOpenPanel("stats")}
              registerRef={(element) => {
                editorRefs.current.stats = element
              }}
              sectionTitle={formData.stats_title}
              sectionDescription={formData.stats_description}
              onTitleChange={(value) => updateField("stats_title", value)}
              onDescriptionChange={(value) =>
                updateField("stats_description", value)
              }
            />

            <SectionContentPanel
              panel="faq"
              title="FAQ Section"
              isOpen={openPanel === "faq"}
              onToggle={() => setOpenPanel("faq")}
              registerRef={(element) => {
                editorRefs.current.faq = element
              }}
              sectionTitle={formData.faq_title}
              sectionDescription={formData.faq_description}
              onTitleChange={(value) => updateField("faq_title", value)}
              onDescriptionChange={(value) =>
                updateField("faq_description", value)
              }
            />

            <AccordionPanel
              panel="cta"
              title="Call to Action"
              description="Final conversion section."
              isOpen={openPanel === "cta"}
              onToggle={() => setOpenPanel("cta")}
              registerRef={(element) => {
                editorRefs.current.cta = element
              }}
            >
              <TextAreaField
                label="CTA Title"
                value={formData.cta_title}
                onChange={(value) => updateField("cta_title", value)}
              />
              <TextAreaField
                label="CTA Description"
                value={formData.cta_description}
                onChange={(value) => updateField("cta_description", value)}
              />
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="CTA Button Text"
                  value={formData.cta_button_text}
                  onChange={(value) => updateField("cta_button_text", value)}
                />
                <TextField
                  label="CTA Button URL"
                  value={formData.cta_button_url}
                  onChange={(value) => updateField("cta_button_url", value)}
                />
              </div>
            </AccordionPanel>

            <AccordionPanel
              panel="seo"
              title="Search Engine Optimization"
              description="Metadata used by search engines."
              icon={<Search className="h-5 w-5" />}
              isOpen={openPanel === "seo"}
              onToggle={() => setOpenPanel("seo")}
              registerRef={(element) => {
                editorRefs.current.seo = element
              }}
            >
              <TextField
                label="SEO Title"
                value={formData.seo_title}
                onChange={(value) => updateField("seo_title", value)}
              />
              <TextAreaField
                label="SEO Description"
                value={formData.seo_description}
                onChange={(value) => updateField("seo_description", value)}
              />
            </AccordionPanel>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Homepage Status</h2>
                  <p className="text-sm text-slate-500">
                    Control public visibility.
                  </p>
                </div>
              </div>

              <ToggleField
                title="Homepage Active"
                description="Keep enabled so public settings are available."
                checked={formData.is_active}
                onChange={(checked) => updateField("is_active", checked)}
              />
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Section Order & Visibility
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Drag sections, toggle visibility, or jump directly to editing.
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.section_order}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="mt-5 space-y-3">
                    {formData.section_order.map((section) => {
                      const visibilityField = visibilityFields[section]

                      return (
                        <SortableSectionRow
                          key={section}
                          section={section}
                          label={sectionLabels[section]}
                          isVisible={formData[visibilityField]}
                          isEditing={openPanel === section}
                          onToggle={() => toggleSection(section)}
                          onEdit={() => openEditorPanel(section)}
                        />
                      )
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              <button
                type="button"
                onClick={() => openEditorPanel("seo")}
                className={`mt-3 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  openPanel === "seo"
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500">
                  <Search className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
                  SEO Settings
                </span>
                <Edit3 className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function PreviewDeviceButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-blue-300 bg-blue-50 text-blue-700"
          : "border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  )
}

function SortableSectionRow({
  section,
  label,
  isVisible,
  isEditing,
  onToggle,
  onEdit,
}: {
  section: HomepageSection
  label: string
  isVisible: boolean
  isEditing: boolean
  onToggle: () => void
  onEdit: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center gap-2 rounded-xl border p-3 ${
        isDragging
          ? "z-10 border-blue-300 bg-white shadow-lg"
          : isEditing
            ? "border-blue-300 bg-blue-50"
            : "border-slate-200 bg-white"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="inline-flex h-9 w-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg border border-slate-200 text-slate-500"
        aria-label={`Drag ${label} section`}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-slate-800"
      >
        {label}
      </button>

      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
          isVisible
            ? "bg-green-50 text-green-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {isVisible ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}

function AccordionPanel({
  panel,
  title,
  description,
  icon,
  isOpen,
  onToggle,
  registerRef,
  children,
}: {
  panel: EditorPanel
  title: string
  description: string
  icon?: ReactNode
  isOpen: boolean
  onToggle: () => void
  registerRef: (element: HTMLDivElement | null) => void
  children: ReactNode
}) {
  return (
    <div
      ref={registerRef}
      id={`homepage-editor-${panel}`}
      className="scroll-mt-24 overflow-hidden rounded-xl bg-white shadow-sm"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-6 py-5 text-left hover:bg-slate-50"
      >
        {icon && (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold text-slate-900">
            {title}
          </span>
          <span className="mt-1 block text-sm text-slate-500">
            {description}
          </span>
        </span>

        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 px-6 py-6">
          <div className="space-y-5">{children}</div>
        </div>
      )}
    </div>
  )
}

function SectionContentPanel({
  panel,
  title,
  isOpen,
  onToggle,
  registerRef,
  sectionTitle,
  sectionDescription,
  onTitleChange,
  onDescriptionChange,
}: {
  panel: HomepageSection
  title: string
  isOpen: boolean
  onToggle: () => void
  registerRef: (element: HTMLDivElement | null) => void
  sectionTitle: string
  sectionDescription: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}) {
  return (
    <AccordionPanel
      panel={panel}
      title={title}
      description="Public heading and description."
      isOpen={isOpen}
      onToggle={onToggle}
      registerRef={registerRef}
    >
      <TextField
        label="Section Title"
        value={sectionTitle}
        onChange={onTitleChange}
      />
      <TextAreaField
        label="Section Description"
        value={sectionDescription}
        onChange={onDescriptionChange}
      />
    </AccordionPanel>
  )
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-slate-700">
        {label} <span className="text-red-600">*</span>
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-slate-700">
        {label} <span className="text-red-600">*</span>
      </span>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClassName} leading-7`}
      />
    </label>
  )
}

function ToggleField({
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
    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
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

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
