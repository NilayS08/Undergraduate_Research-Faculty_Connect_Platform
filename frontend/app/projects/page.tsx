"use client"

import { useRouter } from "next/navigation"
import ProjectsList from "@/components/projects-list"

export default function ProjectsPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ProjectsList
          onView={(projectId) => {
            // Navigate to dynamic project detail page
            router.push(`/projects/${projectId}`)
          }}
          onApply={(projectId) => {
            // For now, route to sign-in (stub). Replace with apply flow later.
            router.push(`/signin?apply=${projectId}`)
          }}
        />
      </div>
    </main>
  )
}
