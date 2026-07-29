import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
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
  }

  function startEditing(job: AdminJobOpening) {
    setEditingId(job.id)

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
    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.location.trim() ||
      !formData.employment_type.trim() ||
      !formData.experience.trim() ||
      !formData.short_description.trim()
    ) {
      toast.error("Please complete all required job-opening fields.")
      return
    }

    const slug = createSlug(formData.slug)

    if (!slug) {
      toast.error("Please enter a valid slug.")
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

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          const message = detail
            .map((item) => {
              const field = Array.isArray(item?.loc)
                ? item.loc.filter((part: unknown) => part !== "body").join(".")
                : "field"

              return `${field}: ${item?.msg || "Please check this value."}`
            })
            .join(" | ")

          toast.error(message)
        } else {
          toast.error("Unable to save the job opening.")
        }
      } else {
        toast.error("Unable to save the job opening.")
      }
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

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string"
            ? detail
            : "Unable to delete the job opening."
        )
      } else {
        toast.error("Unable to delete the job opening.")
      }

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

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            Careers Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Job Openings
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Add, edit, reorder, hide and remove the positions displayed on the
            public Careers page.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Openings" value={jobs.length} />
          <SummaryCard label="Active" value={activeCount} />
          <SummaryCard label="Inactive" value={inactiveCount} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add Job Opening" : "Edit Job Opening"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new public career opportunity."
                    : "Update the selected career opportunity."}
                </p>
              </div>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  title="Cancel editing"
                  aria-label="Cancel editing"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <FormField id="job-title" label="Job Title" required>
                <input
                  id="job-title"
                  type="text"
                  maxLength={150}
                  value={formData.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="DevOps Engineer"
                  className={inputClassName}
                />
              </FormField>

              <FormField id="job-slug" label="Slug" required>
                <input
                  id="job-slug"
                  type="text"
                  maxLength={180}
                  value={formData.slug}
                  onChange={(event) =>
                    updateField("slug", createSlug(event.target.value))
                  }
                  placeholder="devops-engineer"
                  className={inputClassName}
                />

                <p className="mt-1 text-xs text-slate-500">
                  Lowercase letters, numbers and hyphens only.
                </p>
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
                />

                <CharacterCount
                  current={formData.short_description.length}
                  maximum={1000}
                />
              </FormField>

              <FormField id="job-description" label="Full Description">
                <textarea
                  id="job-description"
                  rows={7}
                  value={formData.description ?? ""}
                  onChange={(event) =>
                    updateField("description", event.target.value || null)
                  }
                  placeholder="Describe the role in more detail."
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="job-responsibilities" label="Responsibilities">
                <textarea
                  id="job-responsibilities"
                  rows={7}
                  value={formData.responsibilitiesText}
                  onChange={(event) =>
                    updateField("responsibilitiesText", event.target.value)
                  }
                  placeholder={`Enter one responsibility per line.\nDesign CI/CD pipelines\nManage Kubernetes platforms`}
                  className={`${inputClassName} leading-7`}
                />

                <p className="mt-1 text-xs text-slate-500">
                  Enter one responsibility per line.
                </p>
              </FormField>

              <FormField id="job-requirements" label="Requirements">
                <textarea
                  id="job-requirements"
                  rows={7}
                  value={formData.requirementsText}
                  onChange={(event) =>
                    updateField("requirementsText", event.target.value)
                  }
                  placeholder={`Enter one requirement per line.\nAWS or Azure experience\nStrong Linux knowledge`}
                  className={`${inputClassName} leading-7`}
                />

                <p className="mt-1 text-xs text-slate-500">
                  Enter one requirement per line.
                </p>
              </FormField>

              <FormField id="job-skills" label="Skills">
                <textarea
                  id="job-skills"
                  rows={4}
                  value={formData.skillsText}
                  onChange={(event) =>
                    updateField("skillsText", event.target.value)
                  }
                  placeholder="AWS, Azure, Docker, Kubernetes, Terraform"
                  className={`${inputClassName} leading-7`}
                />

                <p className="mt-1 text-xs text-slate-500">
                  Separate skills with commas or new lines.
                </p>
              </FormField>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="font-semibold text-slate-900">Display Position</p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  New openings are added at the bottom. Use the arrow buttons
                  beside existing openings to change their order.
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(event) =>
                    updateField("is_active", event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block font-semibold text-slate-900">
                    Active
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-slate-500">
                    Active openings appear on the public Careers page.
                  </span>
                </span>
              </label>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleSubmit()
                }}
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId === null ? (
                  <Plus className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}

                {isSubmitting
                  ? "Saving..."
                  : editingId === null
                    ? "Add Job Opening"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Job Openings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {jobs.length} total openings
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search job openings..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {searchTerm.trim() && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Clear the search field to reorder job openings.
              </div>
            )}

            {filteredJobs.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-400" />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No Job Openings Found
                </h2>

                <p className="mt-3 text-slate-600">
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
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900">
                              {job.title}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                job.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {job.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            /{job.slug}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
                            <span>{job.location}</span>
                            <span>{job.employment_type}</span>
                            <span>{job.experience}</span>

                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">
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
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={orderingDisabled || isLast}
                                onClick={() => {
                                  void moveJob(job.id, "down")
                                }}
                                title="Move job opening down"
                                aria-label={`Move ${job.title} down`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
                            {job.short_description}
                          </p>

                          {job.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(job)}
                            title="Edit job opening"
                            aria-label={`Edit ${job.title}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === job.id}
                            onClick={() => {
                              void handleDelete(job)
                            }}
                            title="Delete job opening"
                            aria-label={`Delete ${job.title}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  children: ReactNode
}

function FormField({ id, label, required = false, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-medium text-slate-700">
        {label}

        {required && <span className="text-red-600"> *</span>}
      </label>

      {children}
    </div>
  )
}

function CharacterCount({
  current,
  maximum,
}: {
  current: number
  maximum: number
}) {
  return (
    <p className="mt-1 text-right text-xs text-slate-500">
      {current}/{maximum}
    </p>
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

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
