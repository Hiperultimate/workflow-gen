# Workflow Gen

A powerful workflow automation platform that enables users to build and execute automated workflows through a visual node-based interface. Connect various actions and triggers to streamline processes, integrate with external services, and automate repetitive tasks.

## Tech Stack

### Modern Runtime & Build Tools
- **Bun** - Ultra-fast JavaScript runtime and package manager
- **Turborepo** - High-performance monorepo build system with intelligent caching

### Frontend
- **TypeScript** - Type-safe JavaScript for robust development
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible UI components built on Radix UI

### Backend
- **Express** - Fast, unopinionated web framework for Node.js
- **Prisma** - Next-generation ORM for type-safe database access
- **PostgreSQL** - Advanced open-source relational database

## Features

### Core Functionality
- **Visual Workflow Builder** - Drag-and-drop interface to create workflows by connecting nodes
- **Webhook Triggers** - Start workflows via HTTP requests with customizable endpoints
- **Credential Management** - Securely store and manage API keys and authentication credentials
- **Real-time Execution** - Monitor workflow progress and node states in real-time
- **Node-based Architecture** - Modular system for easy extension and customization

### Available Nodes
#### Completed
- **Webhook** - HTTP trigger for starting workflows
- **Email** - Send emails via Resend API
- **Telegram** - Send messages to Telegram chats
- **Credential Management** - Create and manage API credentials

#### In Progress
- **Solana Send Token** - Transfer SOL or SPL tokens on Solana blockchain
- **AI Agent** - Integrate with AI models for intelligent processing
- **Code Tool** - Execute custom JavaScript/TypeScript code
- **Gemini** - Google Gemini AI integration
- **Manual Trigger** - Manually start workflows from the UI

## Project Structure

```
workflow-gen/
├── apps/
│   ├── server/          # Backend API (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── db/              # Database client
│   │   │   ├── middleware/      # Express middleware (auth, etc.)
│   │   │   ├── routers/         # API route handlers
│   │   │   ├── services/        # External service integrations
│   │   │   ├── store/           # State management
│   │   │   ├── types/           # TypeScript type definitions
│   │   │   ├── utils/
│   │   │   │   ├── nodeExecution/  # Node execution logic
│   │   │   │   ├── schemas/       # Validation schemas
│   │   │   │   └── updateNodeStateIfConnected.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── web/              # Frontend application (React + TanStack Router)
│       ├── src/
│       │   ├── api/              # API client functions
│       │   ├── components/
│       │   │   ├── nodes/        # Workflow node components
│       │   │   ├── ui/           # Reusable UI components
│       │   │   └── ...           # Other components
│       │   ├── hooks/            # Custom React hooks
│       │   ├── lib/              # Utilities and schemas
│       │   ├── routes/           # Page routes
│       │   ├── store/            # State management
│       │   └── types.ts          # TypeScript types
│       └── package.json
├── packages/
│   └── db/               # Shared database package (Prisma)
│       ├── prisma/       # Database schema and migrations
│       └── src/          # Database client and types
├── bun.lock
├── turbo.json           # Turborepo configuration
└── package.json
```

## Getting Started

### Prerequisites
- **Bun** - Fast JavaScript runtime (recommended) or Node.js
- **PostgreSQL** - Database (can be run via Docker)

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd workflow-gen
bun install
```

### 2. Database Setup
This project uses PostgreSQL with Prisma. You have two options:

#### Option A: Using Docker (Recommended)
A `docker-compose.yml` file is provided in `packages/db/` for easy database setup:
```bash
cd packages/db
docker-compose up -d
```
This will start a PostgreSQL container with the database ready.

#### Option B: External PostgreSQL
Set up your own PostgreSQL instance and note the connection details.

### 3. Environment Configuration
Copy the example environment files and configure them:

#### Backend (apps/server/.env)
```bash
cp apps/server/.env.example apps/server/.env
```
Edit `apps/server/.env` and set:
- `DATABASE_URL` - Your PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/workflow_gen`)
- `JWT_SECRET` - A secure random string for JWT tokens
- `SOLANA_CONNECTION_URL` - Solana RPC endpoint (optional, for Solana nodes)

#### Frontend (apps/web/.env)
```bash
cp apps/web/.env.example apps/web/.env
```
Edit `apps/web/.env` and set:
- `VITE_SERVER_URL` - Backend API URL (e.g., `http://localhost:3000`)

### 4. Database Migration
Push the Prisma schema to your database:
```bash
bun db:push
```

### 5. Start Development Server
```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Tech Stack

### Modern Runtime & Build Tools
- **Bun** - Ultra-fast JavaScript runtime and package manager
- **Turborepo** - High-performance monorepo build system with intelligent caching

### Frontend
- **TypeScript** - Type-safe JavaScript for robust development
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible UI components built on Radix UI

### Backend
- **Express** - Fast, unopinionated web framework for Node.js
- **Prisma** - Next-generation ORM for type-safe database access
- **PostgreSQL** - Advanced open-source relational database

## Available Scripts

### Development
- `bun dev` - Start all applications (web + server) in development mode with hot reloading
- `bun dev:web` - Start only the frontend web application
- `bun dev:server` - Start only the backend API server

### Building & Deployment
- `bun build` - Build all applications for production
- `bun compile` - Create standalone binaries (server only)

### Database
- `bun db:push` - Push Prisma schema changes to the database
- `bun db:studio` - Open Prisma Studio for database management and exploration
- `bun db:generate` - Generate Prisma client from schema
- `bun db:migrate` - Run database migrations
- `bun db:start` - Start the database container (if using Docker)
- `bun db:stop` - Stop the database container
- `bun db:watch` - Watch for schema changes and auto-generate client

### Quality Assurance
- `bun check-types` - Run TypeScript type checking across all packages
