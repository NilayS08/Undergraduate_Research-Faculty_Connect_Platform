# Research Connect Platform Setup

This is a full-stack platform to connect students with faculty for research projects.

## Architecture

- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: MySQL with pre-populated data
- **Frontend**: Next.js with TypeScript
- **API Communication**: RESTful API with CORS enabled

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create the database:
```sql
mysql -u root -p
CREATE DATABASE researchhub;
```

2. Run the database setup script:
```bash
mysql -u root -p researchhub < Database.sql
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate the virtual environment:
```bash
source dbmsenv/bin/activate  # On macOS/Linux
# or
dbmsenv\Scripts\activate     # On Windows
```

3. Install dependencies (if not already installed):
```bash
pip install fastapi uvicorn sqlalchemy pymysql
```

4. Update the database connection in `app/db.py` if needed:
```python
DATABASE_URL = "mysql+pymysql://root:your_password@localhost/researchhub"
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Projects
- `GET /projects/` - List all projects
- `GET /projects/{id}` - Get project by ID
- `POST /projects/` - Create new project
- `PUT /projects/{id}` - Update project

### Students
- `GET /students/` - List all students
- `GET /students/{id}` - Get student by ID
- `POST /students/` - Create new student
- `PUT /students/{id}` - Update student

### Faculty
- `GET /faculty/` - List all faculty
- `GET /faculty/{id}` - Get faculty by ID
- `POST /faculty/` - Create new faculty
- `PUT /faculty/{id}` - Update faculty

### Skills
- `GET /skills/` - List all skills
- `POST /skills/` - Create new skill

### Applications
- `GET /applications/project/{project_id}` - Get applications for a project
- `POST /applications/` - Create new application
- `PUT /applications/{id}/accept` - Accept application
- `PUT /applications/{id}/reject` - Reject application

## Features Implemented

### Backend
- ✅ Complete CRUD operations for all entities
- ✅ CORS configuration for frontend communication
- ✅ SQLAlchemy models matching database schema
- ✅ Pydantic schemas for request/response validation

### Frontend
- ✅ Projects listing with filtering and search
- ✅ Student dashboard with profile management
- ✅ Faculty dashboard with project management
- ✅ Real-time API integration
- ✅ Responsive design with modern UI components

## Database Schema

The database includes the following main entities:
- **Admin**: System administrators
- **Students**: Undergraduate students
- **Faculty**: Research faculty members
- **Research_Projects**: Research project listings
- **Applications**: Student applications to projects
- **Skills**: Technical skills and competencies
- **Project_Skills**: Many-to-many relationship between projects and skills
- **Student_Skills**: Many-to-many relationship between students and skills
- **Project_Members**: Students who are accepted into projects
- **Student_Achievements**: Achievements earned by students

## Usage

1. **Students**: Can browse projects, apply to research opportunities, and manage their profile
2. **Faculty**: Can post research projects, review applications, and manage their projects
3. **Projects**: Display with filtering by skills, status, and search functionality

## Development Notes

- The backend runs on port 8000
- The frontend runs on port 3000
- CORS is configured to allow frontend-backend communication
- All API calls are made through the centralized `lib/api.ts` utility
- Sample data is replaced with live API calls throughout the application
