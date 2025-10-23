"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Users, Eye } from "lucide-react"
import { api, Project, Application, Skill } from "@/lib/api"

interface FacultyDashboardProps {
  facultyId?: number
  onCreateProject?: (project: any) => void
  onReviewApplication?: (applicantId: string, decision: "accept" | "reject") => void
}

export default function FacultyDashboard({
  facultyId = 101, // Default to first faculty for demo
  onCreateProject = (data) => console.log("Create project:", data),
  onReviewApplication = (id, decision) => console.log("Review:", id, decision),
}: FacultyDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [applicants, setApplicants] = useState<Application[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewApplicantsModalOpen, setIsViewApplicantsModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "Recruiting" as const,
    max_students: 1,
    faculty_id: facultyId,
    skills: [] as number[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [projectsData, skillsData] = await Promise.all([
          api.getProjects(),
          api.getSkills()
        ])
        setProjects(projectsData)
        setAvailableSkills(skillsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [facultyId])

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description || newProject.skills.length === 0) {
      return
    }

    try {
      const createdProject = await api.createProject(newProject)
      setProjects([...projects, createdProject])
      onCreateProject(newProject)
      setNewProject({
        title: "",
        description: "",
        status: "Recruiting",
        max_students: 1,
        faculty_id: facultyId,
        skills: [],
      })
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error('Failed to create project:', err)
    }
  }

  const handleViewApplications = async (projectId: string) => {
    setSelectedProjectId(projectId)
    try {
      const applications = await api.getApplicationsForProject(parseInt(projectId))
      setApplicants(applications)
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    }
    setIsViewApplicantsModalOpen(true)
  }

  const projectApplicants = applicants.filter((a) => a.project_id.toString() === selectedProjectId)

  const getStatusColor = (status: "Recruiting" | "In Progress" | "Completed") => {
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Manage your research projects and review applications</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't posted any projects yet.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Post Your First Project</Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge key={skill.skill_id} variant="secondary">
                        {skill.skill_name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{project.currentStudents}</span>
                        {" / "}
                        {project.maxStudents} positions filled
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{project.applicants}</span> pending{" "}
                      {project.applicants === 1 ? "application" : "applications"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewApplications(project.id)}
                  disabled={project.applicants === 0}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Applications ({project.applicants})
                </Button>
                <Button variant="outline">Edit Project</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post New Project</DialogTitle>
            <DialogDescription>Create a new research project and start recruiting students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Machine Learning for Climate Prediction"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the project, research goals, and what students will learn..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recruiting">Recruiting</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Max Students *</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  max="10"
                  value={newProject.max_students}
                  onChange={(e) => setNewProject({ ...newProject, max_students: Number.parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Required Skills *</Label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-border rounded-md p-3">
                {availableSkills.map((skill) => (
                  <div key={skill.skill_id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill.skill_id}`}
                      checked={newProject.skills.includes(skill.skill_id)}
                      onCheckedChange={(checked) => {
                        setNewProject({
                          ...newProject,
                          skills: checked
                            ? [...newProject.skills, skill.skill_id]
                            : newProject.skills.filter((s) => s !== skill.skill_id),
                        })
                      }}
                    />
                    <Label htmlFor={`skill-${skill.skill_id}`} className="text-sm font-normal cursor-pointer">
                      {skill.skill_name}
                    </Label>
                  </div>
                ))}
              </div>
              {newProject.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.skills.map((skillId) => {
                    const skill = availableSkills.find(s => s.skill_id === skillId)
                    return (
                      <Badge key={skillId} variant="secondary">
                        {skill?.skill_name || 'Unknown Skill'}
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.title || !newProject.description || newProject.skills.length === 0}
            >
              Post Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Applicants Modal */}
      <Dialog open={isViewApplicantsModalOpen} onOpenChange={setIsViewApplicantsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Applications</DialogTitle>
            <DialogDescription>
              {projectApplicants.length} {projectApplicants.length === 1 ? "application" : "applications"} for this
              project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {projectApplicants.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No applications yet.</p>
            ) : (
              projectApplicants.map((applicant) => (
                <Card key={applicant.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{applicant.studentName}</CardTitle>
                        <CardDescription>{applicant.email}</CardDescription>
                      </div>
                      <Badge variant="outline">{new Date(applicant.appliedDate).toLocaleDateString()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Major</p>
                        <p className="font-medium">{applicant.major}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Year</p>
                        <p className="font-medium">{applicant.year}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">GPA</p>
                        <p className="font-medium">{applicant.gpa}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Cover Letter</p>
                      <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-3 rounded-md">
                        {applicant.coverLetter}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button className="flex-1" onClick={() => onReviewApplication(applicant.id, "accept")}>
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => onReviewApplication(applicant.id, "reject")}
                    >
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
