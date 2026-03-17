# 🌱 Bloom Together — Educational Learning Platform

A comprehensive, role-based educational platform built with **React**, **TypeScript**, **Tailwind CSS**, and **Lovable Cloud**. Bloom Together connects **Teachers**, **Students**, and **Parents** in a unified learning ecosystem.

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)

---

## 🚀 Live Demo

**Published URL:** [bloom-together-edu.lovable.app](https://bloom-together-edu.lovable.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Security](#security)
- [Getting Started](#getting-started)

---

## Overview

Bloom Together is a full-stack educational platform that enables teachers to create courses, build curriculum hierarchies, assign MCQ-based assessments, and provide personalized feedback — all while giving students and parents real-time visibility into academic progress.

---

## Features

### 🔐 Authentication & Roles

- **Email/password authentication** with secure signup and login
- **Three distinct roles:** Teacher, Student, Parent
- Role-based routing and dashboards — each role sees only what's relevant
- Automatic profile creation on signup via database triggers
- **Developer bypass tool** (🔧) for quick role-switching during development

### 👨‍🏫 Teacher Dashboard

- **Overview stats:** Total courses, assignments, students, and pending reviews
- Quick actions to create courses or assignments directly from the dashboard
- View all owned courses at a glance
- **Edit Profile:** Update name, school, phone, bio, and contact information

### 📚 Course Management (Teacher)

- **Full CRUD** for courses — create, view, update, and delete
- Custom course icons and color themes
- Course descriptions for student discovery

### 📖 Curriculum Builder (Teacher)

- **Three-tier content hierarchy:** Courses → Chapters → Subchapters
- Ordering via sort order for structured curriculum flow
- **Subchapter media types:**
  - 📝 Text content
  - 🎥 Video (URL-based)
  - 🎧 Audio
  - 📄 Documents
- Chapter descriptions for context
- Full CRUD on chapters and subchapters within owned courses

### 📝 Assignment System (Teacher)

- **MCQ Assignment Builder** with dynamic question/option management
- Per-question difficulty levels (Easy, Medium, Hard)
- Overall assignment difficulty tagging
- Link assignments to specific courses
- Optional due dates
- 2–6 answer options per question with correct answer marking
- View all created assignments with full question/answer previews
- Input validation (title length, minimum questions, minimum options, correct answer required)

### 👨‍🎓 Student Dashboard

- **Overview stats:** Available courses, total chapters, total lessons, motivational streak
- Browse and view all available courses
- Course detail pages with chapter and subchapter content

### 📋 Student Assignments

- View all assignments across available courses
- **Take MCQ assignments** — interactive question-by-question interface
- Auto-scoring upon submission
- View scores for completed assignments
- Visual distinction between pending and completed assignments (icons + score display)

### 💬 Feedback System

#### Teacher Side
- **Student Feedback page** — view all student submissions across assignments
- See student name, assignment title, score, and percentage
- Visual progress bars for performance at a glance
- **Write personalized feedback** with an optional "Performance Insights" field
- Edit previously given feedback
- Character limits enforced (max 2000 chars)

#### Student Side
- **My Feedback page** — view all received feedback from teachers
- See scores, teacher feedback, and performance insights per submission

#### Parent Side
- **Parent Feedback page** — monitor child's feedback and performance
- **Parent Progress page** — track academic progress across courses
- **Parent Dashboard** — overview of child's learning journey

### 🏠 Landing Page

- Public-facing landing page with platform overview
- Role-based sign-up call to action
- Responsive design for all devices

### 🛠 Developer Tools

- **Dev Bypass widget** — floating button (bottom-right) for instant role switching
- Supports three dev accounts (teacher, student, parent)
- Auto-creates dev accounts on first use
- Falls back to local mock mode if backend is unavailable
- Session-based — doesn't persist across browser restarts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui component library |
| **State Management** | TanStack React Query v5 |
| **Routing** | React Router v6 |
| **Backend** | Lovable Cloud (PostgreSQL + Auth + Edge Functions) |
| **Authentication** | Email/password with role-based access |
| **Forms** | React Hook Form + Zod validation |
| **Notifications** | Sonner toast notifications |
| **Charts** | Recharts (for progress visualization) |
| **Icons** | Lucide React |

---

## Architecture

```
src/
├── components/            # Shared UI components
│   ├── ui/                # shadcn/ui primitives (60+ components)
│   ├── DashboardLayout    # Role-aware sidebar + main content layout
│   ├── DevBypass          # Developer role-switching tool
│   └── NavLink            # Active-aware navigation links
├── contexts/
│   └── AuthContext         # Global auth state, login/signup/logout, role detection
├── hooks/
│   ├── useAssignments     # Assignment CRUD, submissions, scoring, feedback
│   ├── useCourses         # Course/chapter/subchapter CRUD with validation
│   ├── useStudentCourses  # Student-specific course data fetching
│   └── use-mobile         # Responsive breakpoint detection
├── integrations/
│   ├── backend/client     # Backend client configuration
│   └── supabase/          # Auto-generated types & client
├── pages/
│   ├── teacher/           # TeacherDashboard, Courses, CourseDetail,
│   │                      #   Assignments, Feedback
│   ├── student/           # StudentDashboard, Courses, Assignments, Feedback
│   ├── parent/            # ParentDashboard, Progress, Feedback
│   ├── AuthPage           # Login/Signup with role selection
│   ├── LandingPage        # Public landing page
│   └── Index              # Route guard — redirects based on role
├── types/                 # Shared TypeScript interfaces
└── data/                  # Mock data for fallback/dev mode
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (name, email, school, bio, phone, avatar) |
| `user_roles` | Role assignments (`teacher`, `student`, `parent`) — separate table for security |
| `courses` | Course metadata (title, description, icon, color, teacher_id) |
| `chapters` | Course chapters with sort ordering and descriptions |
| `subchapters` | Lesson content with media type support (text, video, audio, document) |
| `assignments` | MCQ assignments linked to courses with difficulty and due dates |
| `mcq_questions` | Individual questions per assignment with difficulty tagging |
| `mcq_options` | Answer options per question (with correct answer flag) |
| `submissions` | Student answers (JSONB), auto-calculated scores, teacher feedback & insights |
| `course_enrollments` | Student-course enrollment tracking |

### Views

| View | Purpose |
|------|---------|
| `public_profiles` | Security view exposing only `name` + `avatar_url` for cross-user display |

### Functions

| Function | Purpose |
|----------|---------|
| `has_role(user_id, role)` | Security definer function for RLS — checks role without recursion |
| `handle_new_user()` | Trigger function — auto-creates profile and role on signup |
| `update_updated_at_column()` | Trigger function — auto-updates timestamps on row changes |

---

## Security

- **Row Level Security (RLS)** enabled on all tables
- Teachers can only manage their own courses, chapters, and assignments
- Students can only view/submit their own submissions
- Parents have read-only access to their child's data
- `has_role()` **security definer** function prevents RLS recursion
- `public_profiles` view limits exposed user data to name and avatar only
- **Input validation** at both frontend (React) and database levels (CHECK constraints)
- No anonymous signups — all users must authenticate with email/password
- Roles stored in a **dedicated `user_roles` table** (not on profiles) to prevent privilege escalation
- Foreign key constraints enforce data integrity across all related tables

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or bun)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd bloom-together-edu

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Development Tips

- Use the **🔧 Dev Bypass** button (bottom-right corner) to quickly switch between Teacher, Student, and Parent roles without logging out
- Dev accounts (`dev-teacher@bloom.local`, `dev-student@bloom.local`, `dev-parent@bloom.local`) are auto-created on first use
- If the backend is unavailable, the app automatically falls back to local mock mode

### Testing

```bash
# Run unit tests
npm run test
```

---

## 📄 License

This project is built with [Lovable](https://lovable.dev).
