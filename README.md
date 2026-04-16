# Project Task Board

## Description

A full-stack task management application where users can manage projects, tasks, and track progress using a dashboard and Kanban-style task board.

## Tech Stack

- **Frontend:** React.js (React 18, React Router v6, Axios)
- **Backend:** ASP.NET Core Web API (.NET 10)
- **Database:** SQLite with Entity Framework Core

## Repository Structure

```
project-task-board/
├── frontend/        ← React app
├── backend/         ← .NET Core API
│   └── TaskBoard.Api/
├── screenshots/
└── README.md
```

## Features

- Create, update, and delete projects
- Task management (CRUD operations)
- Task status tracking (To Do, In Progress, Review, Done)
- Kanban-style task board
- Dashboard with task statistics (overdue, due this week, tasks by status)
- Add comments to tasks
- Filter and sort tasks by priority, status, due date
- Paginated task list
- Global exception handling

## Screenshots

### Dashboard
![Dashboard](screenshots/Screenshot%202026-04-16%20at%2012.26.14%E2%80%AFPM.png)
![Dashboard](screenshots/Screenshot%202026-04-16%20at%2012.26.41%E2%80%AFPM.png)

### Task Board
![Task Board](screenshots/Screenshot%202026-04-16%20at%2012.27.13%E2%80%AFPM.png)
![Task Board](screenshots/Screenshot%202026-04-16%20at%2012.27.34%E2%80%AFPM.png)

### Task Details
![Task Details](screenshots/Screenshot%202026-04-16%20at%2012.27.57%E2%80%AFPM.png)
![Task Details](screenshots/Screenshot%202026-04-16%20at%2012.28.32%E2%80%AFPM.png)

## Setup Instructions

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- `dotnet tool install --global dotnet-ef`

### Backend

```bash
cd backend/TaskBoard.Api
dotnet restore
dotnet ef database update
dotnet run
```

API runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`

## API Endpoints

### Projects
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | /api/projects      | List all projects |
| POST   | /api/projects      | Create project    |
| GET    | /api/projects/{id} | Get project       |
| PUT    | /api/projects/{id} | Update project    |
| DELETE | /api/projects/{id} | Delete project    |

### Tasks
| Method | Endpoint                 | Description                   |
|--------|--------------------------|-------------------------------|
| GET    | /api/projects/{id}/tasks | List tasks (filter/sort/page) |
| POST   | /api/projects/{id}/tasks | Create task                   |
| GET    | /api/tasks/{id}          | Get task                      |
| PUT    | /api/tasks/{id}          | Update task                   |
| DELETE | /api/tasks/{id}          | Delete task                   |

### Comments
| Method | Endpoint                 | Description    |
|--------|--------------------------|----------------|
| GET    | /api/tasks/{id}/comments | List comments  |
| POST   | /api/tasks/{id}/comments | Add comment    |
| DELETE | /api/comments/{id}       | Delete comment |

### Dashboard
| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| GET    | /api/dashboard | Get statistics |

## Future Improvements

- Drag and drop Kanban board
- Authentication & user roles
- Notifications
