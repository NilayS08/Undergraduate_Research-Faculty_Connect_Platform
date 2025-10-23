const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Project {
  project_id: number
  title: string
  description: string
  status: string
  max_students: number
  faculty_id: number
  skills: Skill[]
}

export interface Student {
  student_id: number
  first_name: string
  last_name: string
  major: string
  gpa: number
  year_level: number
  research_interests: string
  email: string
  skills: Skill[]
}

export interface Faculty {
  faculty_id: number
  first_name: string
  last_name: string
  department: string
  research_areas: string
  email: string
}

export interface Skill {
  skill_id: number
  skill_name: string
  category: string
}

export interface Application {
  application_id: number
  status: string
  cover_letter: string
  student_id: number
  project_id: number
}

// API utility functions
export const api = {
  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects/`)
    if (!response.ok) throw new Error('Failed to fetch projects')
    return response.json()
  },

  async getProject(id: number): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`)
    if (!response.ok) throw new Error('Failed to fetch project')
    return response.json()
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "faculty") {
      throw new Error("Only faculty members can create projects");
    }

    // Automatically attach faculty_id (if the user is a faculty member)
    const projectWithFaculty = {
      ...project,
      faculty_id: user.role === "faculty" ? user.user_id : null,
    };
  
    // Send to backend
    const response = await fetch(`${API_BASE_URL}/projects/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectWithFaculty),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create project:", errorText);
      throw new Error("Failed to create project");
    }
  
    const data = await response.json();
    console.log("Project created successfully:", data);
    return data;
  },
  
  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    })
    if (!response.ok) throw new Error('Failed to update project')
    return response.json()
  },

  // Students
  async getStudent(id: number): Promise<Student> {
    console.log("Fetching student:", `${API_BASE_URL}/students/${id}`);
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Backend response:", text);
      throw new Error(`Failed to fetch student (status ${response.status}): ${text}`);
    }
    return response.json();
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    })
    if (!response.ok) throw new Error('Failed to create student')
    return response.json()
  },

  async updateStudent(id: number, student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    })
    if (!response.ok) throw new Error('Failed to update student')
    return response.json()
  },

  // Faculty
  async getFaculty(): Promise<Faculty[]> {
    const response = await fetch(`${API_BASE_URL}/faculty/`)
    if (!response.ok) throw new Error('Failed to fetch faculty')
    return response.json()
  },

  async getFacultyMember(id: number): Promise<Faculty> {
    const response = await fetch(`${API_BASE_URL}/faculty/${id}`)
    if (!response.ok) throw new Error('Failed to fetch faculty member')
    return response.json()
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const response = await fetch(`${API_BASE_URL}/skills/`)
    if (!response.ok) throw new Error('Failed to fetch skills')
    return response.json()
  },

  async createSkill(skill: Partial<Skill>): Promise<Skill> {
    const response = await fetch(`${API_BASE_URL}/skills/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    })
    if (!response.ok) throw new Error('Failed to create skill')
    return response.json()
  },

  // Applications
  async getApplicationsForProject(projectId: number): Promise<Application[]> {
    console.log("Fetching applications for project:", `${API_BASE_URL}/applications/project/${projectId}`);
    const response = await fetch(`${API_BASE_URL}/applications/project/${projectId}`)
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to fetch applications:", errorText);
      
      // If it's a 404, the endpoint might not exist or no applications found
      if (response.status === 404) {
        console.warn("No applications found or endpoint doesn't exist. Returning empty array.");
        return []; // Return empty array instead of throwing
      }
      
      throw new Error(`Failed to fetch applications (status ${response.status}): ${errorText}`)
    }
    
    return response.json()
  },

  async createApplication(application: Partial<Application>): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    })
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create application:", errorText);
      throw new Error('Failed to create application')
    }
    return response.json()
  },

  async acceptApplication(id: number): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/accept`, {
      method: 'PUT'
    })
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to accept application:", errorText);
      throw new Error('Failed to accept application')
    }
    return response.json()
  },

  async rejectApplication(id: number): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/reject`, {
      method: 'PUT'
    })
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to reject application:", errorText);
      throw new Error('Failed to reject application')
    }
    return response.json()
  }
}