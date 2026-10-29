# FreelanceHub — Freelancer Marketplace Platform (React + Vite) 🚀

A comprehensive, responsive two-sided digital marketplace web application engineered with **React, Vite, CSS Grid & Flexbox, and LocalStorage client-side persistence**. The platform features Role-Based Access Control (RBAC), multi-criteria project discovery, live card previews, milestone escrow allocation, and an executive administrator governance dashboard.

---

## 📌 Table of Contents
1. [Core Requirements Compliance](#-core-requirements-compliance)
2. [Module Identification & Functionalities](#-module-identification--functionalities)
   - [Public Marketplace Module](#1-public-marketplace-module)
   - [User Module (Client & Freelancer Workspaces)](#2-user-module)
   - [Admin Module (Governance & Control Panel)](#3-admin-module)
   - [Landing Module (Hero & Metrics)](#4-landing-module)
3. [Login & Signup Implementation (LocalStorage)](#-login--signup-implementation-local-storage)
4. [Technology Architecture & State Management](#-technology-architecture--state-management)
5. [Project File Structure](#-project-file-structure)
6. [Getting Started & Local Execution](#-getting-started--local-execution)
7. [Student Review & Viva Demonstration Walkthrough](#-student-review--viva-demonstration-walkthrough)

---

## 🎯 Core Requirements Compliance

| Requirement | Implementation Details | Status |
| :--- | :--- | :--- |
| **1. React + Vite Project** | Configured with `vite`, `@vitejs/plugin-react`, `react@19`, and `lucide-react`. Fast HMR development and optimized production bundling (`npm run build`). | ✅ **Fully Implemented** |
| **2. Module Identification** | Distinct architectural modules implemented: **Admin Module**, **User Module** (Client + Freelancer), **Marketplace Module**, and **Landing Module**. | ✅ **Fully Implemented** |
| **3. Login & Signup with Local Storage** | Robust client-side authentication with validation, password checks, account suspension enforcement, persistent session management, and 1-click demo logins. | ✅ **Fully Implemented** |

---

## 🏢 Module Identification & Functionalities

```
                            ┌───────────────────────────────────────────────┐
                            │           FreelanceHub Web Platform           │
                            │             (React + Vite SPA)                │
                            └──────────────────────┬────────────────────────┘
                                                   │
         ┌─────────────────────────────────────────┼────────────────────────────────────────┐
         │                                         │                                        │
         ▼                                         ▼                                        ▼
┌──────────────────┐                     ┌──────────────────┐                     ┌──────────────────┐
│   Marketplace    │                     │   User Module    │                     │   Admin Module   │
│     Module       │                     │ (Client/Freelance│                     │  (Governance)    │
└────────┬─────────┘                     └────────┬─────────┘                     └────────┬─────────┘
         │                                        │                                        │
  • Live Projects List                     • Client Project Mgmt                   • 4 Executive KPIs
  • Top Freelancer Cards                   • View Proposals & Hire                 • Project Moderation
  • Multi-Filter & Search                  • Freelancer Bid Tracker                • User Directory/RBAC
  • Post Project Form                      • Saved Job Bookmarks                   • Escrow Oversight
  • Live Card Preview                      • Profile Settings Sync                 • System Audit Logs
```

### 1. Public Marketplace Module (`src/modules/marketplace/`)
- **Hero & Search Engine**: Real-time keyword search across project titles, descriptions, and technology tags (React, UI/UX, Mobile, AI, Full Stack).
- **Multi-Criteria Filter Engine**:
  - Category tabs (*All, Web Dev, UI/UX & Design, Mobile Apps, AI & Data*).
  - Budget tier dropdown (*All, Under ₹10,000, ₹10,000 – ₹25,000, ₹25,000+*).
  - Sort ordering (*Newest, Budget: High to Low, Budget: Low to High*).
- **Project Cards**: Displays client verification badges, category tags, required skills, listed budget, proposal counts, and bookmark star toggle.
- **Vetted Freelancer Directory**: Verified profiles with ratings, reviews, hourly rates, and an interactive **Profile Inspection Modal**.
- **Client Project Publisher**: Post job form with real-time **Live Card Preview** that updates instantaneously as the user types.

### 2. User Module (`src/modules/user/`)
A unified workspace customized to the authenticated user's role:
- **Client Workspace**:
  - *My Posted Projects*: Tabular view of all projects posted by the client with status badges (*Approved, Pending, In Progress, Rejected*).
  - *Applicant Proposals Inspector*: Modal view of bids, delivery timelines, and cover letters submitted for each project.
  - *One-Click Hire & Escrow Allocation*: Accepting a bid immediately sets the proposal to "Accepted", the project to "In Progress", and locks funds into "Held in Escrow".
- **Freelancer Workspace**:
  - *My Submitted Bids*: Comprehensive tracker of all bids submitted by the freelancer with delivery timelines, client decisions (*Pending, Accepted/Hired*), and Escrow states.
  - *Saved Projects*: Dedicated grid of bookmarked opportunities with 1-click application and bookmark management.
- **Profile Settings**:
  - Edit personal details, professional title, hourly rate, skills, and bio with instant `localStorage` synchronization.

### 3. Admin Module (`src/modules/admin/`)
A secured control panel accessible exclusively by users with the `Admin` role:
- **Route Guard Interceptor**: Blocks non-administrators with security alert toasts and redirects.
- **4 Executive KPI Stat Cards**:
  - 👥 *Total Registered Users*
  - 💼 *Total Projects on Platform*
  - ⏳ *Pending Moderation Approvals*
  - 💰 *Total Platform Escrow & Transaction Volume (₹)*
- **Project Moderation & Governance**:
  - Filter projects by moderation state (*All, Pending, Approved, Rejected*).
  - Actions: Approve project (instantly publishes to marketplace), Reject/Take Down, Feature toggle, or Delete.
- **User Directory & RBAC Management**:
  - Table of all accounts stored in `localStorage`.
  - Actions: Suspend / Reactivate account (suspended accounts cannot log in), Role Switcher dropdown (*Freelancer ⇄ Client ⇄ Admin*), Delete user account, and "+ Add New User" modal.
- **Platform Proposals & Escrow Oversight**:
  - Full visibility into all proposals, bid amounts, and financial escrow allocations across the platform.
- **Real-Time System Audit Log**:
  - Chronological, timestamped activity stream tracking administrative and marketplace transactions.

---

## 🔐 Login & Signup Implementation (Local Storage)

Authentication and session state are managed via the browser's `localStorage` API:

### LocalStorage Schema:
- `freelancehub_users_v3`: Array of registered user accounts.
- `freelancehub_session_v3`: Active authenticated user object.
- `freelancehub_projects_v3`: Platform projects list with moderation states.
- `freelancehub_applications_v3`: Submitted proposals and escrow states.
- `freelancehub_bookmarks_v3`: Array of bookmarked project IDs.
- `freelancehub_audit_logs_v3`: Timestamped system event logs.
- `freelancehub_theme_v2`: User's theme preference (`"dark"` or `"light"`).

### Pre-Configured Test Credentials:

| Role | Username / Email | Password | Permissions & Workflow |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin** | `prudhvi` *(or `prudhvi@freelancehub.com`)* | `prudhvi@2408` | Full access to Admin Command Center, User RBAC, and Project Moderation |
| **🏢 Client** | `client@freelancehub.com` | `client123` | Post projects, view proposals, award contracts & allocate escrow |
| **💻 Freelancer** | `rahul@freelancehub.com` | `user123` | Browse jobs, submit proposals, track bids, bookmark jobs |

> 💡 **Quick Demo Login Feature**: The Auth Modal includes 1-click quick login buttons (`🛡️ Demo Admin (prudhvi)`, `🏢 Demo Client`, `💻 Demo Freelancer`) so reviewers and evaluators can immediately switch between roles without manually typing credentials!

---

## 📁 Project File Structure

```
FREELANCER MARKET/
├── index.html                   # HTML entrypoint mounting React root
├── vite.config.js               # Vite bundler configuration
├── package.json                 # React 19, Vite, Lucide dependencies & scripts
├── public/
│   ├── assets/
│   │   └── logo.webp            # Brand logo asset
│   └── fonts/
│       └── GeistPixel-Circle.woff2 # Pixel display font
├── src/
│   ├── main.jsx                 # Application entry point with AuthProvider & ToastProvider
│   ├── App.jsx                  # Root state orchestration & Module routing
│   ├── index.css                # Design system: Glassmorphism, CSS Grid, Flexbox, Dark/Light modes
│   ├── context/
│   │   ├── AuthContext.jsx      # LocalStorage user authentication, session state & RBAC
│   │   └── ToastContext.jsx     # Ambient notification toasts (Success, Error, Info)
│   ├── data/
│   │   ├── initialData.js       # Seed users, projects, proposals, and audit logs
│   │   └── storage.js           # LocalStorage CRUD operations & schema initialization
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx       # Header with module switcher, role badge, theme toggle
│   │   │   └── Footer.jsx       # Platform footer
│   │   └── modals/
│   │       ├── AuthModal.jsx    # Sign In & Sign Up with LocalStorage & 1-click demo logins
│   │       ├── ApplyModal.jsx   # Bid submission modal
│   │       ├── ProfileModal.jsx # Freelancer profile view modal
│   │       ├── ClientProposalsModal.jsx # Client review proposals & Escrow allocation
│   │       └── AdminUserModal.jsx # Admin create user modal
│   └── modules/
│       ├── landing/
│       │   └── LandingModule.jsx # Full-bleed video background, trust row, stats count-up
│       ├── marketplace/
│       │   ├── MarketplaceModule.jsx # Hero search, multi-filters, project grid, talent directory
│       │   └── PostProjectSection.jsx # Post job form with Real-time Live Card Preview
│       ├── user/
│       │   └── UserModule.jsx   # Client & Freelancer workspaces, bid tracker, bookmarks, profile
│       └── admin/
│           └── AdminModule.jsx  # Governance, 4 KPIs, moderation, RBAC directory, escrow, audit logs
```

---

## 🚀 Getting Started & Local Execution

### 1. Install Dependencies:
```bash
npm install
```

### 2. Run the Development Server:
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

### 3. Build for Production:
```bash
npm run build
```

---

## 🎓 Student Review & Viva Demonstration Walkthrough

Use this step-by-step walkthrough to present the project during practical exams and project evaluation:

### Step 1: Explain the React + Vite Architecture (1 Minute)
- Explain that **FreelanceHub** is engineered with **React** and **Vite** for fast HMR and modular component architecture.
- Point out the clean folder structure: `src/modules/` (Admin, User, Marketplace, Landing), `src/context/` (Auth & Toast), and `src/data/` (LocalStorage engine).

### Step 2: Demonstrate Authentication & LocalStorage (2 Minutes)
- Click **Sign In** in the navigation bar.
- Show the two tabs: **Sign In** and **Create Account**.
- Open DevTools (`F12` -> `Application` tab -> `Local Storage`) and show the examiner the persistent keys:
  - `freelancehub_users_v3`
  - `freelancehub_session_v3`
  - `freelancehub_projects_v3`
- Click **🛡️ Demo Admin (prudhvi)**: observe automatic redirection to the **Admin Module**.

### Step 3: Demonstrate the Admin Module (2 Minutes)
- Show the **4 Dynamic KPI Cards** calculating directly from LocalStorage (Registered Users, Total Projects, Pending Moderation, Escrow Volume).
- In the **Project Moderation** tab, click **Approve** or **Reject** on a project.
- In the **User Directory & RBAC** tab, show how an admin can change a user's role or click **Suspend** to immediately lock an account out.
- Show the **System Audit Log** tab recording all user and admin events chronologically.

### Step 4: Demonstrate the User Module (Client & Freelancer Roles) (2 Minutes)
- Click the profile dropdown and switch to **🏢 Demo Client**:
  - Automatically redirected to the **User Portal** (`Client Mode`).
  - Show the **Client Project Management** table.
  - Click **View Proposals**: examine submitted bids and click **Accept Proposal & Escrow Funds**. Notice the status updates to "Accepted" and funds move to "Held in Escrow".
- Switch to **💻 Demo Freelancer**:
  - Show the **Freelancer Proposal Tracker** with bid amounts, timelines, and live status.
  - Show the **Saved Projects (Bookmarks)** tab.
  - Show the **Profile Settings** tab and edit a field to demonstrate instant LocalStorage synchronization.

### Step 5: Demonstrate the Public Marketplace & Live Preview (1 Minute)
- Click **Marketplace** in the navigation bar.
- Test the **Multi-Criteria Filter Engine**:
  - Click category pills (*Web Dev, Mobile Apps, AI & Data*).
  - Test the **Budget Tier Filter** (e.g. "₹25,000+").
  - Test the **Live Search Bar** (e.g. search for "React").
- Scroll down to **Post Your Project**:
  - Type a title and budget in the form; demonstrate to the examiner how the **Live Card Preview** on the right updates instantaneously as you type!
- Click the **Theme Switcher** (sun/moon icon) in the header to demonstrate Dark and Light mode persistence.
