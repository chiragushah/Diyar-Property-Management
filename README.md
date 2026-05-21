# PropSphere - AI-Enhanced Property Management System

**PropSphere** is a comprehensive, production-ready Property Management and CRM system built with Next.js 15, Prisma (SQLite), and Google Gemini AI.

## 🌟 Key Features

### 🏢 Property & Unit Management
- Full CRUD for properties and units.
- Track occupancy status and details.
- Role-based access control for Managers, Owners, and Tenants.

### 🎯 CRM (Leads Pipeline)
- **AI Lead Scoring**: Automatically predicts conversion potential for every lead.
- **Kanban Board**: Drag-and-drop interface for moving leads through customizable stages.
- Lead tracking and assignment.

### 🛠️ Maintenance & AI Triage
- Kanban board for tracking repair requests.
- **AI Triage**: Intelligently analyzes issue descriptions to set priority levels automatically.

### 📂 Document Management System (DMS)
- Centralized repository for all property-related documents.
- Support for Lease agreements, IDs, Insurance, and Maintenance records.

### 📊 Projects & Invoicing
- Track property improvements via milestones.
- **Automatic Invoicing**: Invoices are generated and sent instantly when a milestone is marked as complete.

### 💰 Financials & Predictive AI
- Transaction ledger for income and expenses.
- **Financial Forecasting**: AI-powered insights that predict future cash flow trends.

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini (Flash 1.5)
- **Database**: SQLite (Dev) / Any SQL (Prod) via Prisma ORM
- **UI**: shadcn/ui, Tailwind CSS, Recharts
- **Auth**: NextAuth.js

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm
- Google Gemini API Key

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-key"
   ```
4. Setup Database: `npx prisma db push`
5. Run Dev: `npm run dev`

## 🚢 Deployment Guide

### Option 1: Vercel (Recommended)
1. Push code to GitHub.
2. Link repository in Vercel Dashboard.
3. Add Environment Variables (as above).
4. **Important**: For production, use a hosted database (PostgreSQL/MySQL) and update `DATABASE_URL`.
5. Deploy!

### Option 2: Docker
1. Build the image:
   ```bash
   docker build -t propmgmt-crm .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e NEXTAUTH_SECRET=your_secret \
     -e NEXTAUTH_URL=http://your-domain.com \
     -e GEMINI_API_KEY=your_key \
     propmgmt-crm
   ```

### Option 3: Manual Production Server
1. Build locally: `npm run build`
2. Start server: `npm start`
3. Use a process manager like **PM2** to keep it running: `pm2 start npm -- name "propmgmt" -- start`
