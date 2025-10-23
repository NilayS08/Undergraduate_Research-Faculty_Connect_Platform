"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, User, Building2, Users } from "lucide-react"
import { Project, Skill } from "@/lib/api"

// Sample data
const SAMPLE_PROJECT = {
  id: "1",
  title: "Machine Learning for Climate Prediction",
  description: `This research project focuses on developing advanced machine learning models to predict climate patterns using historical weather data. Students will gain hands-on experience with deep learning frameworks, data preprocessing, and model evaluation.

The project involves:
- Working with large-scale climate datasets
- Implementing and training neural network architectures
- Evaluating model performance and accuracy
- Writing research papers and presenting findings

This is an excellent opportunity for students interested in AI, environmental science, and data science to contribute to meaningful research that addresses climate change.`,
  facultyName: "Dr. Sarah Chen",
  facultyEmail: "sarah.chen@university.edu",
  department: "Computer Science",
  maxStudents: 3,
  currentApplicants: 8,
  status: "Recruiting" as const,
  skills: [] as Skill[], // Changed to empty array of Skill objects
}

const RELATED_PROJECTS = [
  {
    id: "5",
    title: "Neural Network Architecture Search",
    facultyName: "Dr. Sarah Chen",
    status: "Recruiting" as const,
  },
  {
    id: "6",
    title: "Social Media Sentiment Analysis",
    facultyName: "Dr. Amanda Park",
    status: "In Progress" as const,
  },
  {
    id: "3",
    title: "Protein Folding Simulation",
    facultyName: "Dr. Emily Watson",
    status: "Recruiting" as const,
  },
]

type ProjectType = typeof SAMPLE_PROJECT

interface ProjectDetailProps {
  project?: ProjectType
  onApplySubmit?: (formData: { coverLetter: string; projectId: string }) => void
}

export default function ProjectDetail({
  project = SAMPLE_PROJECT,
  onApplySubmit = (data) => console.log("Apply submitted:", data),
}: ProjectDetailProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [errors, setErrors] = useState<{ coverLetter?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { coverLetter?: string } = {}
    if (!coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required"
    } else if (coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter must be at least 50 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit
    onApplySubmit({
      projectId: project.id,
      coverLetter: coverLetter.trim(),
    })

    // Reset and close
    setCoverLetter("")
    setErrors({})
    setIsApplyModalOpen(false)
  }

  const getStatusColor = (status: typeof project.status) => {
    switch (status) {
      case "Recruiting":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Project Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <CardTitle className="text-3xl">{project.title}</CardTitle>
            <Badge variant="outline" className={`${getStatusColor(project.status)} w-fit`}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Project Description</h3>
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{project.description}</div>
          </div>

          {/* Faculty Info */}
          <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faculty</p>
                <p className="text-foreground">{project.facultyName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <a
                  href={`mailto:${project.facultyEmail}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {project.facultyEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-foreground">{project.department}</p>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills && project.skills.length > 0 ? (
                project.skills.map((skill, index) => (
                  <Badge key={`skill-${skill.skill_id || index}`} variant="secondary">
                    {skill.skill_name || skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specific skills required</p>
              )}
            </div>
          </div>

          {/* Positions */}
          <div className="flex items-center gap-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{project.maxStudents}</span> positions available
              </span>
            </div>
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">{project.currentApplicants}</span> current applicants
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setIsApplyModalOpen(true)}
            disabled={project.status === "Completed"}
          >
            Apply to This Project
          </Button>
        </CardFooter>
      </Card>

      {/* Related Projects */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Related Projects</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {RELATED_PROJECTS.map((relatedProject) => (
            <Card key={relatedProject.id} className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">{relatedProject.title}</CardTitle>
                <CardDescription className="text-sm">{relatedProject.facultyName}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Badge variant="outline" className={getStatusColor(relatedProject.status)}>
                  {relatedProject.status}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply to {project.title}</DialogTitle>
            <DialogDescription>
              Submit your application to work on this research project. Make sure to highlight your relevant skills and
              experience.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="coverLetter">
                  Cover Letter <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Explain why you're interested in this project and what relevant experience you have..."
                  value={coverLetter}
                  onChange={(e) => {
                    setCoverLetter(e.target.value)
                    if (errors.coverLetter) {
                      setErrors({ ...errors, coverLetter: undefined })
                    }
                  }}
                  rows={8}
                  className={errors.coverLetter ? "border-destructive" : ""}
                />
                {errors.coverLetter && <p className="text-sm text-destructive">{errors.coverLetter}</p>}
                <p className="text-xs text-muted-foreground">Minimum 50 characters ({coverLetter.length}/50)</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsApplyModalOpen(false)
                  setCoverLetter("")
                  setErrors({})
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}