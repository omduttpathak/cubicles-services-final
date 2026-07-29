import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LockKeyhole } from "lucide-react"
import { toast } from "sonner"

import { loginAdmin } from "@/api/authApi"
import SEO from "@/components/seo/SEO"
import { saveAccessToken } from "@/utils/auth"

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("admin@cubiclesservices.com")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await loginAdmin({
        email: email.trim(),
        password,
      })

      saveAccessToken(response.access_token)

      toast.success("Login successful.")

      navigate("/admin/dashboard")
    } catch (error) {
      console.error(error)

      toast.error("Invalid email or password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO
        title="Admin Login | Cubicles Services"
        description="Secure administrator login for Cubicles Services."
      />

      <section className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6 py-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <LockKeyhole className="h-8 w-8 text-blue-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Admin Login
            </h1>

            <p className="mt-3 text-slate-600">
              Sign in to manage Cubicles Services.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="admin@cubiclesservices.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
