"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Edit, UserX, Trash2 } from "lucide-react"

// Sample data
const SAMPLE_USERS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    role: "Student",
    status: "Active",
    joinedDate: "2024-09-01",
  },
  {
    id: "2",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "Faculty",
    status: "Active",
    joinedDate: "2020-01-15",
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "sarah.w@university.edu",
    role: "Student",
    status: "Active",
    joinedDate: "2024-09-01",
  },
  {
    id: "4",
    name: "Prof. Michael Rodriguez",
    email: "m.rodriguez@university.edu",
    role: "Faculty",
    status: "Active",
    joinedDate: "2018-08-20",
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma.d@university.edu",
    role: "Student",
    status: "Inactive",
    joinedDate: "2023-09-01",
  },
  {
    id: "6",
    name: "Dr. Emily Watson",
    email: "emily.watson@university.edu",
    role: "Faculty",
    status: "Active",
    joinedDate: "2019-01-10",
  },
  {
    id: "7",
    name: "Michael Brown",
    email: "michael.b@university.edu",
    role: "Student",
    status: "Active",
    joinedDate: "2024-09-01",
  },
  {
    id: "8",
    name: "Prof. James Liu",
    email: "james.liu@university.edu",
    role: "Faculty",
    status: "Active",
    joinedDate: "2015-07-01",
  },
]

const SAMPLE_ADMIN_PROJECTS = [
  {
    id: "1",
    title: "Machine Learning for Climate Prediction",
    facultyName: "Dr. Sarah Chen",
    status: "Recruiting",
    applicants: 8,
    createdDate: "2024-12-15",
  },
  {
    id: "2",
    title: "Web Accessibility Research",
    facultyName: "Prof. Michael Rodriguez",
    status: "In Progress",
    applicants: 5,
    createdDate: "2024-11-20",
  },
  {
    id: "3",
    title: "Protein Folding Simulation",
    facultyName: "Dr. Emily Watson",
    status: "Recruiting",
    applicants: 12,
    createdDate: "2025-01-05",
  },
  {
    id: "4",
    title: "Compiler Optimization Techniques",
    facultyName: "Prof. James Liu",
    status: "Completed",
    applicants: 3,
    createdDate: "2024-10-01",
  },
  {
    id: "5",
    title: "Neural Network Architecture Search",
    facultyName: "Dr. Sarah Chen",
    status: "In Progress",
    applicants: 6,
    createdDate: "2024-12-20",
  },
]

const ITEMS_PER_PAGE = 10

interface AdminPanelProps {
  users?: typeof SAMPLE_USERS
  projects?: typeof SAMPLE_ADMIN_PROJECTS
  onEditUser?: (userId: string) => void
  onDeactivateUser?: (userId: string) => void
  onChangeProjectStatus?: (projectId: string, status: string) => void
  onRemoveProject?: (projectId: string) => void
}

export default function AdminPanel({
  users = SAMPLE_USERS,
  projects = SAMPLE_ADMIN_PROJECTS,
  onEditUser = (id) => console.log("Edit user:", id),
  onDeactivateUser = (id) => console.log("Deactivate user:", id),
  onChangeProjectStatus = (id, status) => console.log("Change project status:", id, status),
  onRemoveProject = (id) => console.log("Remove project:", id),
}: AdminPanelProps) {
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("All")
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [projectSearchQuery, setProjectSearchQuery] = useState("")
  const [projectCurrentPage, setProjectCurrentPage] = useState(1)

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    const matchesRole = userRoleFilter === "All" || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const userTotalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const userStartIndex = (userCurrentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(userStartIndex, userStartIndex + ITEMS_PER_PAGE)

  // Filter projects
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      project.facultyName.toLowerCase().includes(projectSearchQuery.toLowerCase()),
  )

  const projectTotalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const projectStartIndex = (projectCurrentPage - 1) * ITEMS_PER_PAGE
  const paginatedProjects = filteredProjects.slice(projectStartIndex, projectStartIndex + ITEMS_PER_PAGE)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Recruiting":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Inactive":
      case "Completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users and projects across the platform</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value)
                      setUserCurrentPage(1)
                    }}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={userRoleFilter}
                  onValueChange={(value) => {
                    setUserRoleFilter(value)
                    setUserCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Student">Students</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.joinedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => onEditUser(user.id)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDeactivateUser(user.id)}
                                disabled={user.status === "Inactive"}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {userTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setUserCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={userCurrentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {userCurrentPage} of {userTotalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setUserCurrentPage((p) => Math.min(userTotalPages, p + 1))}
                    disabled={userCurrentPage === userTotalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>View and manage all research projects</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or faculty..."
                  value={projectSearchQuery}
                  onChange={(e) => {
                    setProjectSearchQuery(e.target.value)
                    setProjectCurrentPage(1)
                  }}
                  className="pl-9"
                />
              </div>

              {/* Projects Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No projects found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium max-w-xs">{project.title}</TableCell>
                          <TableCell className="text-muted-foreground">{project.facultyName}</TableCell>
                          <TableCell>
                            <Select
                              value={project.status}
                              onValueChange={(value) => onChangeProjectStatus(project.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Recruiting">Recruiting</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{project.applicants}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(project.createdDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => onRemoveProject(project.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {projectTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProjectCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={projectCurrentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {projectCurrentPage} of {projectTotalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProjectCurrentPage((p) => Math.min(projectTotalPages, p + 1))}
                    disabled={projectCurrentPage === projectTotalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
