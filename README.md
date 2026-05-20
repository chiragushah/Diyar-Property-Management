# PropMgmt CRM - Comprehensive Property Management System

A full-featured Property Management System (PMS) and CRM built with Next.js 15, Prisma, and Tailwind CSS.

## 🌟 Key Features

### 🏢 Property & Unit Management
- Full CRUD for properties and units.
- Track occupancy status and details.
- Role-based access control for Managers, Owners, and Tenants.

### 🎯 CRM (Leads Pipeline)
- **Kanban Board**: Drag-and-drop interface for moving leads through customizable stages (New, Contacted, Qualified, Viewing, Lease Sent, Closed).
- Lead tracking and assignment.
- Automated status updates.

### 📂 Document Management System (DMS)
- Centralized repository for all property-related documents.
- Support for Lease agreements, IDs, Insurance, and Maintenance records.
- Metadata tracking (size, type, linked entities).

### 🛠️ Maintenance Module
- Kanban board for tracking repair requests.
- Priority levels (Low, Medium, High, Urgent).
- Link requests to specific leases and units.

### 📊 Financials & Analytics
- Transaction ledger for income and expenses.
- Real-time financial summary (Income, Expenses, Net Profit).
- Visual analytics using Recharts on the main dashboard.

## 🚀 Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **UI**: shadcn/ui, Tailwind CSS, Lucide React
- **Auth**: NextAuth.js
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma db push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚢 Hosting & Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add the following environment variables:
   - `NEXTAUTH_SECRET`: A random string for auth.
   - `NEXTAUTH_URL`: Your deployment URL.
   - `DATABASE_URL`: If using a hosted database like PostgreSQL (update `prisma/schema.prisma` provider to `postgresql`).
4. Vercel will automatically detect Next.js and deploy.

### Docker
1. Build the image:
   ```bash
   docker build -t propmgmt-crm .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 propmgmt-crm
   ```

## 🔒 Security
- Password hashing with bcrypt.
- Protected API routes and Server Actions.
- Session-based authentication.
