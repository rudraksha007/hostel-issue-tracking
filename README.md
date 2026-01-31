# 🏨 Hostel Issue Tracking System

A comprehensive full-stack web platform that enables students and hostel/campus authorities to efficiently report, track, and resolve hostel-related issues. Built with modern technologies and containerized for easy deployment.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

## ✨ Features

### Core Features
- **🔐 Role-Based Access Control**: Secure authentication with three distinct roles (Student, Staff, Management)
- **📝 Issue Reporting System**: Report issues with categories, priority levels, media uploads, and visibility controls
- **🔄 Issue Status Workflow**: Complete lifecycle tracking from Reported → Assigned → In Progress → Resolved → Closed
- **📢 Announcements**: Hostel-specific news and updates with targeted distribution
- **🔍 Lost & Found Module**: Report and track lost or found items with claim workflow
- **📊 Analytics Dashboard**: Data-driven insights on issue trends, resolution times, and hostel-wise statistics
- **💬 Community Interaction**: Comments, threaded replies, and reactions on public issues
- **🔗 Duplicate Management**: Merge similar issues while preserving all reporters

### User Roles
- **Student**: Report issues, view status, interact with announcements, and participate in discussions
- **Warden**: Has access to his/ her assigned floors
- **Staff**: Almost identical access as students except they are assigned tasks for issues created by student
- **Admin**: Full system control, issue assignment, analytics, and moderation capabilities

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Bun** - Fast all-in-one JavaScript runtime
- **Express** - Web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **Bcrypt** - Password hashing
- **Zod**: Validations
- **Cookie-Parser** - Cookie handling

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Turborepo** - Monorepo build system

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **Bun** >= 1.3.5
- **Docker** >= 20.x
- **Docker Compose** >= 2.x

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hostel-issue-tracking
```

### 2. Configure Environment Variables

⚠️ **IMPORTANT**: You must configure the environment variables before building and running the application.

#### Step 2.1: Copy the example environment file

```bash
cp .env.example .env
```

#### Step 2.2: Edit the `.env` file with your configuration

```bash
nano .env  # or use your preferred editor
```

Configure the following variables:

```env
# Root password for the application (change this to a secure password)
ROOT_PASSWORD="YourSecurePassword123"

# Backend server port
PORT=3001

# PostgreSQL database connection string
# Format: postgresql://username:password@host:port/database
DATABASE_URL="postgresql://myuser:mypass@db:5432/mydb"

# Backend API base URL (for internal Docker network communication)
BACKEND_BASE_URL="http://backend:3001/api"
```

#### Step 2.3: Create and configure database environment file

Create a `.env.db` file for PostgreSQL configuration:

```bash
nano .env.db
```

Add the following (ensure these match your `DATABASE_URL`):

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypass
POSTGRES_DB=mydb
```

### 3. Build the Docker Containers

Build all services using Docker Compose:

```bash
docker compose build
```

This will:
- Build the backend service with all dependencies
- Build the web frontend service
- Pull the PostgreSQL image

### 4. Start the Application

Start all services in detached mode:

```bash
docker compose up -d
```

Or run in foreground to see logs:

```bash
docker compose up
```

### 5. Access the Application

Once all containers are running:

- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL Database**: localhost:5432

### 6. Initialize First Admin Account

⚠️ **CRITICAL FIRST STEP**: Before you can use the application, you must create the first admin account.

After the containers are running, execute the following API call to generate the first admin:

```bash
curl -X POST http://localhost:3001/api/auth/v1/fa
```

Or open this URL in your browser:
```
http://localhost:3001/api/auth/v1/fa
```

This will create the first admin account with:
- **User ID**: 1
- **Username**: `root`
- **Password**: `root`

**Default Login Credentials:**
- Username: `root`
- Password: `root`

⚠️ **IMPORTANT**: Change the root password immediately after first login for security!

### 7. Access the Web Interface

Now you can access the web application at http://localhost:3000 and log in with the credentials above.

## 📁 Project Structure

```
hostel-issue-tracking/
├── apps/
│   ├── backend/           # Express.js API server
│   │   ├── src/
│   │   │   ├── auth/      # Authentication routes
│   │   │   ├── issues/    # Issue management
│   │   │   ├── lnf/       # Lost & Found module
│   │   │   ├── announcement/ # Announcements
│   │   │   ├── management/   # Admin features
│   │   │   └── users/     # User management
│   │   └── Dockerfile
│   └── web/               # Next.js frontend
│       ├── app/
│       │   ├── dashboard/ # Dashboard views
│       │   ├── issues/    # Issue tracking UI
│       │   ├── lnf/       # Lost & Found UI
│       │   └── management/ # Admin UI
│       └── Dockerfile
├── packages/
│   ├── db/                # Prisma schema and migrations
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Shared UI components
├── docker-compose.yaml    # Container orchestration
├── turbo.json            # Turborepo configuration
└── .env.example          # Environment variables template
```

## 💻 Development

### Local Development (without Docker)

If you prefer to run the application locally without Docker:

#### 1. Install dependencies

```bash
bun install
```

#### 2. Setup local PostgreSQL database

Ensure PostgreSQL is running locally and update your `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hostel_db"
```

#### 3. Run migrations

```bash
bun run migrate
```

#### 4. Start development servers

```bash
bun run dev
```

This will start:
- Backend server at http://localhost:3001
- Frontend dev server at http://localhost:3000

### Available Scripts

- `bun run dev` - Start development servers
- `bun run build` - Build all packages
- `bun run lint` - Run linting
- `bun run generate` - Generate Prisma client
- `bun run migrate` - Run database migrations
- `bun run deploy` - Deploy migrations (production)
- `bun run format` - Format code with Prettier

## 🐳 Production Deployment

### Using Docker Compose (Recommended)

1. **Configure production environment variables** in `.env`
2. **Build containers**: `docker compose build`
3. **Start services**: `docker compose up -d`
4. **View logs**: `docker compose logs -f`

### Managing the Application

```bash
# Stop all services
docker compose down

# Restart services
docker compose restart

# View running containers
docker compose ps

# View logs for specific service
docker compose logs -f web
docker compose logs -f backend

# Rebuild and restart after code changes
docker compose up -d --build
```

## 📚 API Documentation

The backend API is organized into the following modules:

- **/api/auth** - Authentication and session management
- **/api/issues** - Issue reporting and tracking
- **/api/announcements** - Hostel announcements
- **/api/lnf** - Lost & Found items
- **/api/management** - Administrative functions
- **/api/users** - User management
- **/api/agg** - Analytics and aggregated data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Stop the containers and try again
docker compose down
docker compose up -d
```

**Database connection errors:**
- Ensure `.env.db` is properly configured
- Verify the `DATABASE_URL` in `.env` matches the database credentials
- Check if PostgreSQL container is running: `docker compose ps`

**Migration errors:**
```bash
# Reset and re-run migrations
docker compose down -v
docker compose up -d
```

**Build failures:**
```bash
# Clean rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for better hostel management


Link to Demo: [Demo](https://drive.google.com/file/d/1sk8KjJFc3iHbYCd5WrLvsoAYn2hf3mMN/view?usp=sharing) <br>
Link to Code archive: [Code](https://drive.google.com/file/d/1GCsF6uZRis158vg_xS9BKjV1ku4ZGrji/view?usp=sharing)