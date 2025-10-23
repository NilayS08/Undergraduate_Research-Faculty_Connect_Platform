"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import ProjectDetail from "@/components/project-detail"

// Minimal sample map so the page renders standalone without backend.
// In a real app, you'd fetch by params.id.
const SAMPLE_MAP: Record<
  string,
  {
    id: string
    title: string
    description: string
    facultyName: string
    facultyEmail: string
    department: string
    maxStudents: number
    currentApplicants: number
    status: "Recruiting" | "In Progress" | "Completed"
    skills: string[]
  }
> = {
  "1": {
    id: "1",
    title: "Machine Learning for Climate Prediction",
    description:
      "Develop advanced ML models to predict climate patterns using historical weather data. Students will gain hands-on experience with deep learning, data preprocessing, and evaluation.",
    facultyName: "Dr. Sarah Chen",
    facultyEmail: "sarah.chen@university.edu",
    department: "Computer Science",
    maxStudents: 3,
    currentApplicants: 8,
    status: "Recruiting",
    skills: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
  },
  "2": {
    id: "2",
    title: "Web Accessibility Research",
    description:
      "Study and implement accessibility features aligned with WCAG. Explore assistive tech, audits, and inclusive design patterns in modern web apps.",
    facultyName: "Prof. Michael Rodriguez",
    facultyEmail: "m.rodriguez@university.edu",
    department: "Human-Computer Interaction",
    maxStudents: 2,
    currentApplicants: 5,
    status: "In Progress",
    skills: ["React", "Research Writing"],
  },
  "3": {
    id: "3",
    title: "Protein Folding Simulation",
    description:
      "Use computational methods to simulate protein structures and predict folding patterns for drug discovery applications.",
    facultyName: "Dr. Emily Watson",
    facultyEmail: "emily.watson@university.edu",
    department: "Biochemistry",
    maxStudents: 4,
    currentApplicants: 12,
    status: "Recruiting",
    skills: ["Biology", "Chemistry", "Python", "Data Analysis"],
  },
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const project = SAMPLE_MAP[resolvedParams.id]
  if (!project) return notFound()

  return (
    <main className="min-h-screen">
      <ProjectDetail project={project} onApplySubmit={(data) => console.log("[apply]", data)} />
    </main>
  )
}
