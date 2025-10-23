# Undergraduate Research-Faculty Connect Platform

## Project Description

The Undergraduate Research-Faculty Connect Platform is a comprehensive web application designed to bridge the gap between undergraduate students and faculty research opportunities. This platform facilitates seamless connections between students seeking research experience and faculty members looking for talented undergraduate researchers.

### Key Features

- **Student Portal**: Browse available research projects, create profiles, and apply to projects
- **Faculty Portal**: Post research projects, review applications, and manage student researchers
- **Project Management**: Comprehensive project listing with filtering and search capabilities
- **Application System**: Streamlined application process with cover letters and status tracking
- **Skill Matching**: Connect students with projects based on skills and interests
- **Dashboard Analytics**: Real-time insights for both students and faculty

## How It Works

### For Students
1. **Registration & Profile Creation**: Students create detailed profiles including academic information, research interests, and skills
2. **Project Discovery**: Browse through available research projects with advanced filtering options
3. **Application Process**: Apply to projects with personalized cover letters
4. **Status Tracking**: Monitor application status and receive notifications
5. **Research Collaboration**: Once accepted, collaborate with faculty and other students

### For Faculty
1. **Project Posting**: Create detailed project descriptions with requirements and expectations
2. **Application Review**: Review student applications and profiles
3. **Student Selection**: Accept or reject applications based on fit
4. **Project Management**: Track project progress and student contributions
5. **Research Oversight**: Guide undergraduate researchers through their projects

### System Architecture

The platform is built using a modern full-stack architecture:

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: FastAPI with Python, SQLAlchemy ORM, and MySQL database
- **Authentication**: Role-based authentication system (Student/Faculty)
- **API**: RESTful API with comprehensive endpoints for all operations

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks and localStorage
- **HTTP Client**: Fetch API

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.13
- **ORM**: SQLAlchemy
- **Database**: MySQL
- **Authentication**: Custom role-based system
- **API Documentation**: Swagger/OpenAPI

### Database
- **Primary Database**: MySQL
- **ORM**: SQLAlchemy with Alembic migrations
- **Connection**: PyMySQL driver

## Project Structure

```
Undergraduate_Research-Faculty_Connect_Platform/
├── backend/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── models.py      # Database models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── crud.py        # Database operations
│   │   ├── db.py          # Database configuration
│   │   └── main.py        # FastAPI application
│   └── dbmsenv/           # Python virtual environment
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
├── Database.sql          # Database schema
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.13+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv dbmsenv
   source dbmsenv/bin/activate  # On Windows: dbmsenv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure database connection in `app/db.py`

5. Run database migrations:
   ```bash
   python -m app.main
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Projects
- `GET /projects/` - List all projects
- `POST /projects/` - Create new project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project

### Students
- `GET /students/` - List all students
- `POST /students/` - Create student profile
- `GET /students/{id}` - Get student details
- `PUT /students/{id}` - Update student profile

### Faculty
- `GET /faculty/` - List all faculty
- `GET /faculty/{id}` - Get faculty details

### Applications
- `GET /applications/project/{id}` - Get applications for project
- `POST /applications/` - Submit application
- `PUT /applications/{id}/accept` - Accept application
- `PUT /applications/{id}/reject` - Reject application

## Database Schema

<!-- ER Diagram will be added here -->
*ER Diagram placeholder - to be added*

## Features Overview

### Student Features
- **Profile Management**: Create and maintain detailed academic profiles
- **Project Discovery**: Search and filter research opportunities
- **Application Tracking**: Monitor application status and history
- **Skill Showcase**: Highlight relevant skills and experience
- **Research Portfolio**: Build a portfolio of research experience

### Faculty Features
- **Project Creation**: Post detailed research project descriptions
- **Application Management**: Review and manage student applications
- **Student Selection**: Choose the best candidates for projects
- **Project Oversight**: Track project progress and student performance
- **Research Collaboration**: Facilitate effective student-faculty collaboration

### System Features
- **Role-based Access**: Secure authentication for students and faculty
- **Real-time Updates**: Live status updates for applications and projects
- **Advanced Search**: Powerful filtering and search capabilities
- **Responsive Design**: Mobile-friendly interface for all devices
- **Data Analytics**: Insights and reporting for both user types

## Development

### Running the Application
1. Start the backend server:
   ```bash
   cd backend
   source dbmsenv/bin/activate
   python -m app.main
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is developed as part of a Database Management Systems course project.

## Contact

For questions or support, please contact the development team.

---

*This platform aims to revolutionize undergraduate research opportunities by creating meaningful connections between students and faculty members.*