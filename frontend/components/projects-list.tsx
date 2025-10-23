"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { api, Project, Skill } from "@/lib/api"

type Status = "Recruiting" | "In Progress" | "Completed" | "All"

interface ProjectsListProps {
  onView?: (projectId: string) => void
  onApply?: (projectId: string) => void
}

const ITEMS_PER_PAGE = 6

export default function ProjectsList({
  onView = (id) => console.log("View project:", id),
  onApply = (id) => console.log("Apply to project:", id),
}: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<Status>("All")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [projectsData, skillsData] = await Promise.all([
          api.getProjects(),
          api.getSkills()
        ])
        setProjects(projectsData)
        setSkills(skillsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Skills filter
      const projectSkillNames = project.skills.map(skill => skill.skill_name)
      const matchesSkills =
        selectedSkills.length === 0 || selectedSkills.some((skill) => projectSkillNames.includes(skill))

      // Status filter
      const matchesStatus = statusFilter === "All" || project.status === statusFilter

      return matchesSearch && matchesSkills && matchesStatus
    })
  }, [projects, searchQuery, selectedSkills, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
    setCurrentPage(1)
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Recruiting":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Title or description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value as Status)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Recruiting">Recruiting</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skills Filter */}
              <div className="space-y-3">
                <Label>Required Skills</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {skills.map((skill) => (
                    <div key={skill.skill_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill.skill_name}
                        checked={selectedSkills.includes(skill.skill_name)}
                        onCheckedChange={() => handleSkillToggle(skill.skill_name)}
                      />
                      <Label htmlFor={skill.skill_name} className="text-sm font-normal cursor-pointer">
                        {skill.skill_name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedSkills.length > 0 || statusFilter !== "All" || searchQuery) && (
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedSkills([])
                    setStatusFilter("All")
                    setSearchQuery("")
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Projects Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Research Projects</h1>
            <p className="text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading projects...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-red-500">Error: {error}</p>
              </CardContent>
            </Card>
          ) : paginatedProjects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No projects match your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {paginatedProjects.map((project) => (
                  <Card key={project.project_id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(project.status as Status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Max Students</p>
                          <p className="text-sm text-foreground">{project.max_students}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                              <Badge key={skill.skill_id} variant="secondary" className="text-xs">
                                {skill.skill_name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1" onClick={() => onView(project.project_id.toString())}>
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => onApply(project.project_id.toString())}
                        disabled={project.status === "Completed"}
                      >
                        Apply
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
