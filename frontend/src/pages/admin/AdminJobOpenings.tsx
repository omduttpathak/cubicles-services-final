import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Filter,
  MapPin,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createAdminJobOpening,
  deleteAdminJobOpening,
  getAdminJobOpenings,
  updateAdminJobOpening,
  updateJobOpeningOrder,
  type AdminJobOpening,
  type JobOpeningRequest,
} from "@/api/adminJobOpeningsApi"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

type JobOpeningFormState = Omit<
  JobOpeningRequest,
  "responsibilities" | "requirements" | "skills"
> & {
  responsibilitiesText: string
  requirementsText: string
  skillsText: string
}

const initialFormData: JobOpeningFormState = {
  title: "",
  slug: "",
  location: "",
  employment_type: "Full Time",
  experience: "",
  short_description: "",
  description: null,
  responsibilitiesText: "",
  requirementsText: "",
  skillsText: "",
  display_order: 0,
  is_active: true,
}

export default function AdminJobOpenings() {
  const [jobs, setJobs] = useState<AdminJobOpening[]>([])
  const [formData, setFormData] = useState<JobOpeningFormState>(initialFormData)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function loadJobOpenings() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminJobOpenings()

      setJobs(sortJobs(response))
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJobOpenings()
  }, [])

  const filteredJobs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return jobs
    }

    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(keyword) ||
        job.slug.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.employment_type.toLowerCase().includes(keyword) ||
        job.experience.toLowerCase().includes(keyword)
      )
    })
  }, [jobs, searchTerm])

  const activeCount = jobs.filter((job) => job.is_active).length
  const inactiveCount = jobs.length - activeCount

  const requiredChecks = useMemo(
    () => [
      formData.title.trim().length > 0,
      formData.slug.trim().length > 0,
      formData.location.trim().length > 0,
      formData.employment_type.trim().length > 0,
      formData.experience.trim().length > 0,
      formData.short_description.trim().length > 0,
    ],
    [formData]
  )

  const completedRequiredFields = requiredChecks.filter(Boolean).length
  const completionPercentage = Math.round(
    (completedRequiredFields / requiredChecks.length) * 100
  )

  function updateField<Key extends keyof JobOpeningFormState>(
    field: Key,
    value: JobOpeningFormState[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleTitleChange(value: string) {
    setFormData((current) => ({
      ...current,
      title: value,
      slug:
        editingId === null || !current.slug.trim()
          ? createSlug(value)
          : current.slug,
    }))
  }

  function resetForm() {
    setFormData(initialFormData)
    setEditingId(null)
    setFormError(null)
  }

  function startEditing(job: AdminJobOpening) {
    setEditingId(job.id)
    setFormError(null)

    setFormData({
      title: job.title,
      slug: job.slug,
      location: job.location,
      employment_type: job.employment_type,
      experience: job.experience,
      short_description: job.short_description,
      description: job.description,
      responsibilitiesText: job.responsibilities.join("\n"),
      requirementsText: job.requirements.join("\n"),
      skillsText: job.skills.join(", "),
      display_order: job.display_order,
      is_active: job.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return
    }

    setFormError(null)

    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.location.trim() ||
      !formData.employment_type.trim() ||
      !formData.experience.trim() ||
      !formData.short_description.trim()
    ) {
      const message = "Please complete all required job-opening fields."
      setFormError(message)
      toast.error(message)
      return
    }

    const slug = createSlug(formData.slug)

    if (!slug) {
      const message = "Please enter a valid slug."
      setFormError(message)
      toast.error(message)
      return
    }

    const payload: JobOpeningRequest = {
      title: formData.title.trim(),
      slug,
      location: formData.location.trim(),
      employment_type: formData.employment_type.trim(),
      experience: formData.experience.trim(),
      short_description: formData.short_description.trim(),
      description: formData.description?.trim() || null,
      responsibilities: parseLineList(formData.responsibilitiesText),
      requirements: parseLineList(formData.requirementsText),
      skills: parseFlexibleList(formData.skillsText),
      display_order:
        editingId !== null
          ? Math.max(1, formData.display_order)
          : jobs.length + 1,
      is_active: formData.is_active,
    }

    try {
      setIsSubmitting(true)

      if (editingId !== null) {
        const updated = await updateAdminJobOpening(editingId, payload)

        setJobs((current) =>
          sortJobs(current.map((job) => (job.id === editingId ? updated : job)))
        )

        toast.success("Job opening updated successfully.")
      } else {
        const created = await createAdminJobOpening(payload)

        setJobs((current) => sortJobs([...current, created]))

        toast.success("Job opening created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      const message = getApiErrorMessage(
        error,
        "Unable to save the job opening."
      )

      setFormError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(job: AdminJobOpening) {
    const confirmed = window.confirm(`Delete "${job.title}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(job.id)

      await deleteAdminJobOpening(job.id)

      const remainingJobs = jobs.filter(
        (currentJob) => currentJob.id !== job.id
      )

      if (remainingJobs.length > 0) {
        const updated = await updateJobOpeningOrder(
          remainingJobs.map((currentJob) => currentJob.id)
        )

        setJobs(sortJobs(updated))
      } else {
        setJobs([])
      }

      if (editingId === job.id) {
        resetForm()
      }

      toast.success("Job opening deleted successfully.")
    } catch (error) {
      console.error(error)

      toast.error(
        getApiErrorMessage(error, "Unable to delete the job opening.")
      )

      void loadJobOpenings()
    } finally {
      setDeletingId(null)
    }
  }

  async function moveJob(jobId: number, direction: "up" | "down") {
    if (searchTerm.trim()) {
      toast.error("Clear the search before reordering job openings.")
      return
    }

    const currentIndex = jobs.findIndex((job) => job.id === jobId)

    if (currentIndex === -1) {
      return
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= jobs.length) {
      return
    }

    const reordered = [...jobs]

    ;[reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ]

    try {
      setIsOrdering(true)

      const updated = await updateJobOpeningOrder(
        reordered.map((job) => job.id)
      )

      setJobs(sortJobs(updated))
      toast.success("Display order updated.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to update display order.")
    } finally {
      setIsOrdering(false)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading job openings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Job Openings"
        message="The job openings could not be loaded."
        onRetry={() => {
          void loadJobOpenings()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Job Openings | Cubicles Services Admin"
        description="Manage public job openings and career opportunities."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Careers Management
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Job Openings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Add, edit, reorder, hide, and remove the positions displayed on
                the public Careers page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Plus className="size-4" />
              Add Job Opening
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Openings"
            value={jobs.length}
            description="All career opportunities"
            icon={<BriefcaseBusiness className="size-5" />}
          />

          <SummaryCard
            label="Active"
            value={activeCount}
            description="Visible on the Careers page"
            icon={<CheckCircle2 className="size-5" />}
            tone="success"
          />

          <SummaryCard
            label="Inactive"
            value={inactiveCount}
            description="Hidden from public visitors"
            icon={<FileText className="size-5" />}
            tone="neutral"
          />
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm"
          >
            {formError}
          </div>
        )}

        <div className="grid gap-6 2xl:grid-cols-[460px_minmax(0,1fr)]">
          <aside className="h-fit 2xl:sticky 2xl:top-24">
            <FormCard
              title={
                editingId === null ? "Add Job Opening" : "Edit Job Opening"
              }
              description={
                editingId === null
                  ? "Create a new public career opportunity."
                  : "Update the selected career opportunity."
              }
              action={
                editingId !== null ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    title="Cancel editing"
                    aria-label="Cancel editing"
                    className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <X className="size-4" />
                  </button>
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BriefcaseBusiness className="size-5" />
                  </div>
                )
              }
            >
              <div className="space-y-5">
                <FormField id="job-title" label="Job Title" required>
                  <input
                    id="job-title"
                    type="text"
                    maxLength={150}
                    value={formData.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="DevOps Engineer"
                    className={inputClassName}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id="job-slug"
                  label="Slug"
                  required
                  description={`Public URL: /careers/${
                    formData.slug || "job-opening-slug"
                  }`}
                >
                  <input
                    id="job-slug"
                    type="text"
                    maxLength={180}
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    placeholder="devops-engineer"
                    className={`${inputClassName} font-mono text-sm`}
                    disabled={isSubmitting}
                  />
                </FormField>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="job-location" label="Location" required>
                    <input
                      id="job-location"
                      type="text"
                      maxLength={150}
                      value={formData.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="New Delhi / Remote"
                      className={inputClassName}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField
                    id="job-employment-type"
                    label="Employment Type"
                    required
                  >
                    <select
                      id="job-employment-type"
                      value={formData.employment_type}
                      onChange={(event) =>
                        updateField("employment_type", event.target.value)
                      }
                      className={inputClassName}
                      disabled={isSubmitting}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </FormField>
                </div>

                <FormField id="job-experience" label="Experience" required>
                  <input
                    id="job-experience"
                    type="text"
                    maxLength={100}
                    value={formData.experience}
                    onChange={(event) =>
                      updateField("experience", event.target.value)
                    }
                    placeholder="3-5 Years"
                    className={inputClassName}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id="job-short-description"
                  label="Short Description"
                  required
                >
                  <textarea
                    id="job-short-description"
                    rows={5}
                    maxLength={1000}
                    value={formData.short_description}
                    onChange={(event) =>
                      updateField("short_description", event.target.value)
                    }
                    placeholder="A concise summary displayed on the Careers page."
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />

                  <CharacterCount
                    current={formData.short_description.length}
                    maximum={1000}
                  />
                </FormField>

                <FormField id="job-description" label="Full Description">
                  <textarea
                    id="job-description"
                    rows={6}
                    value={formData.description ?? ""}
                    onChange={(event) =>
                      updateField("description", event.target.value || null)
                    }
                    placeholder="Describe the role in more detail."
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id="job-responsibilities"
                  label="Responsibilities"
                  description="Enter one responsibility per line."
                >
                  <textarea
                    id="job-responsibilities"
                    rows={6}
                    value={formData.responsibilitiesText}
                    onChange={(event) =>
                      updateField("responsibilitiesText", event.target.value)
                    }
                    placeholder={`Design CI/CD pipelines\nManage Kubernetes platforms`}
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id="job-requirements"
                  label="Requirements"
                  description="Enter one requirement per line."
                >
                  <textarea
                    id="job-requirements"
                    rows={6}
                    value={formData.requirementsText}
                    onChange={(event) =>
                      updateField("requirementsText", event.target.value)
                    }
                    placeholder={`AWS or Azure experience\nStrong Linux knowledge`}
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id="job-skills"
                  label="Skills"
                  description="Separate skills with commas or new lines."
                >
                  <textarea
                    id="job-skills"
                    rows={4}
                    value={formData.skillsText}
                    onChange={(event) =>
                      updateField("skillsText", event.target.value)
                    }
                    placeholder="AWS, Azure, Docker, Kubernetes, Terraform"
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />
                </FormField>

                <ToggleField
                  title="Active"
                  description="Active openings appear on the public Careers page."
                  checked={formData.is_active}
                  disabled={isSubmitting}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <CompletionPanel
                  completed={completedRequiredFields}
                  total={requiredChecks.length}
                  percentage={completionPercentage}
                  isActive={formData.is_active}
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    void handleSubmit()
                  }}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingId === null ? (
                    <Plus className="mr-2 size-4" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}

                  {isSubmitting
                    ? "Saving..."
                    : editingId === null
                      ? "Add Job Opening"
                      : "Save Changes"}
                </button>
              </div>
            </FormCard>
          </aside>

          <div className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Existing Job Openings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {jobs.length} total openings
                  </p>
                </div>

                <div className="relative w-full xl:max-w-md">
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search job openings..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {searchTerm.trim() && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <Filter className="size-4 shrink-0" />
                  Clear the search field to reorder job openings.
                </div>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <BriefcaseBusiness className="size-7" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  No Job Openings Found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {searchTerm
                    ? "No job openings match your search."
                    : "Create your first job opening."}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {filteredJobs.map((job) => {
                  const jobIndex = jobs.findIndex(
                    (currentJob) => currentJob.id === job.id
                  )

                  const isFirst = jobIndex === 0
                  const isLast = jobIndex === jobs.length - 1
                  const orderingDisabled =
                    isOrdering || Boolean(searchTerm.trim())

                  return (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-950">
                              {job.title}
                            </h3>

                            <StatusBadge isActive={job.is_active} />
                          </div>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            /{job.slug}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <MetaBadge
                              icon={<MapPin className="size-3.5" />}
                              text={job.location}
                            />

                            <MetaBadge
                              icon={<BriefcaseBusiness className="size-3.5" />}
                              text={job.employment_type}
                            />

                            <MetaBadge
                              icon={<Users className="size-3.5" />}
                              text={job.experience}
                            />
                          </div>

                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                            {job.short_description}
                          </p>

                          {job.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 ring-inset"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                            <span className="text-sm font-semibold text-slate-700">
                              Position {job.display_order}
                            </span>

                            <button
                              type="button"
                              disabled={orderingDisabled || isFirst}
                              onClick={() => {
                                void moveJob(job.id, "up")
                              }}
                              title="Move job opening up"
                              aria-label={`Move ${job.title} up`}
                              className={orderButtonClassName}
                            >
                              <ArrowUp className="size-4" />
                            </button>

                            <button
                              type="button"
                              disabled={orderingDisabled || isLast}
                              onClick={() => {
                                void moveJob(job.id, "down")
                              }}
                              title="Move job opening down"
                              aria-label={`Move ${job.title} down`}
                              className={orderButtonClassName}
                            >
                              <ArrowDown className="size-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(job)}
                            title="Edit job opening"
                            aria-label={`Edit ${job.title}`}
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === job.id}
                            onClick={() => {
                              void handleDelete(job)
                            }}
                            title="Delete job opening"
                            aria-label={`Delete ${job.title}`}
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
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
  tone?: "default" | "success" | "neutral"
}) {
  const toneClasses = {
    default: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    neutral: "bg-slate-100 text-slate-700",
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

function ToggleField({
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

function CompletionPanel({
  completed,
  total,
  percentage,
  isActive,
}: {
  completed: number
  total: number
  percentage: number
  isActive: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Form completion
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {completed} of {total} required fields completed
          </p>
        </div>

        <span className="text-sm font-black text-blue-700">{percentage}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div
        className={`mt-4 rounded-xl border px-3 py-2 text-xs font-bold ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        {isActive ? "Opening will be visible" : "Opening will remain hidden"}
      </div>
    </div>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-red-50 text-red-700 ring-red-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  )
}

function MetaBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
      {icon}
      {text}
    </span>
  )
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseLineList(value: string): string[] {
  return uniqueValues(
    value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  )
}

function parseFlexibleList(value: string): string[] {
  return uniqueValues(
    value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
  )
}

function uniqueValues(values: string[]): string[] {
  const seen = new Set<string>()

  return values.filter((value) => {
    const normalized = value.toLowerCase()

    if (seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

function sortJobs(jobs: AdminJobOpening[]): AdminJobOpening[] {
  return [...jobs].sort(
    (first, second) =>
      first.display_order - second.display_order || first.id - second.id
  )
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const detail = error.response?.data?.detail

  if (typeof detail === "string") {
    return detail
  }

  if (!Array.isArray(detail) || detail.length === 0) {
    return fallback
  }

  return detail
    .map((item) => {
      const field = Array.isArray(item?.loc)
        ? item.loc.filter((part: unknown) => part !== "body").join(".")
        : "field"

      return `${field}: ${item?.msg || "Please check this value."}`
    })
    .join(" | ")
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

const orderButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
