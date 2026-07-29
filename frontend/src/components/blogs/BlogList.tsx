import { Link } from "react-router-dom"
import { blogs } from "@/data/blogs"
import { ArrowRight } from "lucide-react"

export default function BlogList() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {blog.category}
              </span>

              <h2 className="mt-5 text-2xl font-bold">{blog.title}</h2>

              <p className="mt-4 text-slate-600">{blog.excerpt}</p>

              <div className="mt-6 text-sm text-slate-500">
                {blog.author} • {blog.date}
              </div>

              <Link
                to={`/blogs/${blog.slug}`}
                className="mt-8 inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
              >
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
