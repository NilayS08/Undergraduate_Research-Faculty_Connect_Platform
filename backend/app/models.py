from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, Table, CheckConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base

# Association tables
project_skills = Table(
    'project_skills', Base.metadata,
    Column('project_id', Integer, ForeignKey('research_projects.project_id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skills.skill_id'), primary_key=True)
)

student_skills = Table(
    'student_skills', Base.metadata,
    Column('student_id', Integer, ForeignKey('students.student_id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skills.skill_id'), primary_key=True)
)

project_members = Table(
    'project_members', Base.metadata,
    Column('project_id', Integer, ForeignKey('research_projects.project_id'), primary_key=True),
    Column('student_id', Integer, ForeignKey('students.student_id'), primary_key=True),
    Column('joined_at', DateTime(timezone=True), server_default=func.now())
)

class Admin(Base):
    __tablename__ = "admin"
    admin_id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True)

class Student(Base):
    __tablename__ = "students"
    student_id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    major = Column(String(100))
    gpa = Column(DECIMAL(3,2))
    year_level = Column(Integer)
    research_interests = Column(Text)
    email = Column(String(100), unique=True)
    admin_id = Column(Integer, ForeignKey('admin.admin_id'))

    skills = relationship("Skill", secondary=student_skills, back_populates="students")
    applications = relationship("Application", back_populates="student")
    projects = relationship("ResearchProject", secondary=project_members, back_populates="members")
    password = Column(String(255)) 

class Faculty(Base):
    __tablename__ = "faculty"
    faculty_id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    department = Column(String(100))
    research_areas = Column(Text)
    email = Column(String(100), unique=True)
    admin_id = Column(Integer, ForeignKey('admin.admin_id'))
    projects = relationship("ResearchProject", back_populates="faculty")
    password = Column(String(255))

class ResearchProject(Base):
    __tablename__ = "research_projects"
    project_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200))
    description = Column(Text)
    status = Column(String(50))
    max_students = Column(Integer)
    faculty_id = Column(Integer, ForeignKey('faculty.faculty_id'))
    admin_id = Column(Integer, ForeignKey('admin.admin_id'), nullable=True)

    faculty = relationship("Faculty", back_populates="projects")
    skills = relationship("Skill", secondary=project_skills, back_populates="projects")
    applications = relationship("Application", back_populates="project")
    members = relationship("Student", secondary=project_members, back_populates="projects")

class Application(Base):
    __tablename__ = "applications"
    application_id = Column(Integer, primary_key=True)
    status = Column(String(50))
    cover_letter = Column(Text)
    student_id = Column(Integer, ForeignKey('students.student_id'))
    project_id = Column(Integer, ForeignKey('research_projects.project_id'))

    student = relationship("Student", back_populates="applications")
    project = relationship("ResearchProject", back_populates="applications")

class Skill(Base):
    __tablename__ = "skills"
    skill_id = Column(Integer, primary_key=True)
    skill_name = Column(String(100))
    category = Column(String(50))

    projects = relationship("ResearchProject", secondary=project_skills, back_populates="skills")
    students = relationship("Student", secondary=student_skills, back_populates="skills")

class StudentAchievement(Base):
    __tablename__ = "student_achievements"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.student_id'))
    project_id = Column(Integer, ForeignKey('research_projects.project_id'))
    title = Column(String(200))
    awarded_on = Column(DateTime(timezone=True), server_default=func.now())
