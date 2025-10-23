"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { User, GraduationCap, Award, Plus } from "lucide-react"
import { api, Student, Project, Application, Skill } from "@/lib/api"

type ApplicationStatus = "Pending" | "Accepted" | "Rejected"

interface StudentDashboardProps {
  onUpdateProfile?: (profile: Partial<Student>) => void
  onAddSkill?: (skill: Skill) => void
  onWithdrawApplication?: (projectId: string) => void
}

export default function StudentDashboard({
  onUpdateProfile = (data) => console.log("Update profile:", data),
  onAddSkill = (skill) => console.log("Add skill:", skill),
  onWithdrawApplication = (id) => console.log("Withdraw application:", id),
}: StudentDashboardProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [appliedProjects, setAppliedProjects] = useState<Application[]>([])
  const [matchedProjects, setMatchedProjects] = useState<Project[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState("")
  const [editForm, setEditForm] = useState<Partial<Student>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get student ID from logged-in user
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (!user.user_id || user.role !== "student") {
          throw new Error("No student user logged in")
        }

        const [studentData, skillsData, projectsData] = await Promise.all([
          api.getStudent(user.user_id),
          api.getSkills(),
          api.getProjects()
        ])
        setStudent(studentData)
        setEditForm(studentData)
        setAvailableSkills(skillsData)
        setMatchedProjects(projectsData.slice(0, 2)) // Show first 2 as matches for demo
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleUpdateProfile = async () => {
    if (student) {
      try {
        await api.updateStudent(student.student_id, editForm)
        setStudent({ ...student, ...editForm })
        onUpdateProfile(editForm)
        setIsEditModalOpen(false)
      } catch (err) {
        console.error('Failed to update profile:', err)
      }
    }
  }

  const handleAddSkill = () => {
    if (selectedSkill && student) {
      const skillToAdd = availableSkills.find(s => s.skill_name === selectedSkill)
      if (skillToAdd && !student.skills.some(s => s.skill_id === skillToAdd.skill_id)) {
        onAddSkill(skillToAdd)
        setSelectedSkill("")
        setIsAddSkillModalOpen(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <p className="text-red-500">Error: {error || 'Student not found'}</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "Accepted":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "Rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile and track your applications</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl">
                    {student.first_name?.[0] || 'S'}{student.last_name?.[0] || 'T'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{student.first_name} {student.last_name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Major</p>
                  <p className="text-foreground">{student.major}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="text-foreground">{student.year_level}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">GPA</p>
                  <p className="text-foreground">{student.gpa}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Research Interests</p>
                <div className="flex flex-wrap gap-2">
                  {student.research_interests?.split(',').map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Skills</p>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddSkillModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <Badge key={skill.skill_id} variant="outline">
                      {skill.skill_name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setIsEditModalOpen(true)}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Applications and Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applied Projects */}
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track the status of your project applications</CardDescription>
            </CardHeader>
            <CardContent>
              {appliedProjects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">You haven't applied to any projects yet.</p>
              ) : (
                <div className="space-y-4">
                  {appliedProjects.map((project) => (
                    <div
                      key={project.application_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{project.project_id}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Application #{project.application_id}</p>
                        <p className="text-xs text-muted-foreground">
                          Status: {project.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(project.status as ApplicationStatus)}>
                          {project.status}
                        </Badge>
                        {project.status === "Pending" && (
                          <Button size="sm" variant="ghost" onClick={() => onWithdrawApplication(project.application_id.toString())}>
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matched Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Projects that match your skills and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchedProjects.map((project) => (
                  <div
                    key={project.project_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{project.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((skill) => (
                          <Badge key={skill.skill_id} variant="outline" className="text-xs">
                            {skill.skill_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your student profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  value={editForm.major || ""}
                  onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={editForm.year_level?.toString()} onValueChange={(value) => setEditForm({ ...editForm, year_level: parseInt(value) })}>
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Freshman</SelectItem>
                    <SelectItem value="2">Sophomore</SelectItem>
                    <SelectItem value="3">Junior</SelectItem>
                    <SelectItem value="4">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                value={editForm.gpa?.toString() || ""}
                onChange={(e) => setEditForm({ ...editForm, gpa: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Research Interests (comma-separated)</Label>
              <Textarea
                id="interests"
                value={editForm.research_interests || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    research_interests: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Skill Modal */}
      <Dialog open={isAddSkillModalOpen} onOpenChange={setIsAddSkillModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>Select a skill to add to your profile</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {availableSkills.filter((skill) => !student.skills.some(s => s.skill_id === skill.skill_id)).map((skill) => (
                  <SelectItem key={skill.skill_id} value={skill.skill_name}>
                    {skill.skill_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill} disabled={!selectedSkill}>
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}