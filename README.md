# Next.js + Prisma Postgres Example

![nextjs demo logos](https://github.com/user-attachments/assets/878d39b7-ca99-4dc5-a095-94ca9d010486)

This example demonstrates how to build a full-stack web application using [Next.js](https://nextjs.org/), [Prisma Client](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma), and [Prisma Postgres](https://www.prisma.io/postgres).

> **TL;DR:** Prisma Postgres is a new kind of Postgres database that's optimized for developer productivity. It offers instant provisioning, built-in connection pooling, edge caching, and seamless integration with Prisma ORM.
>
> [Learn more about Prisma Postgres →](https://www.prisma.io/postgres)

## Getting started

### 1. Fill out .env file

If you just want to run the app locally, rename `.env.example` to `.env` and fill in the values.

#### 1.1 Create a Prisma Postgres instance

Go to [the Console](https://console.prisma.io) and create a new Prisma Postgres instance. Use the `DATABASE_URL` value from the new instance to fill out the `.env` file.

#### 1.2 Create a GitHub OAuth app

Go to [the GitHub Developer Settings](https://github.com/settings/developers) and create a new OAuth app.

For the required fields:

- Application name and homepage URL can be whatever you want.
- Authorization callback URL should be `http://localhost:3000/api/auth/callback/github`

After creating the app, you'll be redirected to the app's page. Copy the `Client ID` and `Client Secret` values and use them to fill out `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` in the `.env` file.

#### 1.3 Fill out Auth.js secrets

Run `npx auth secret --copy` to generate a new `AUTH_SECRET` value. Fill out the `.env` file with the new value.

### 2. Install dependencies

Install npm dependencies:

```
npm install
```

### 3. Create and seed the database

Run the following command to create your database. This also creates the needed tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

**If you switched to Prisma Postgres in the previous step**, you need to trigger seeding manually (because Prisma Postgres already created an empty database instance for you, so seeding isn't triggered):

```
npx prisma db seed
```

### 4. Start the Next.js server

```
npm run dev
```

The server is now running on `http://localhost:3000`.

<details>
<summary>📸 Expand for a tour of the app</summary>

### Homepage

Logged out view:
![Homepage](/public/logged-out-homepage.png)

Logged in view:
![Homepage](/public/logged-in-homepage.png)

### User Profile

![User Profile](/public/user-profile.png)

### Creating Posts

![Create Post](/public/create-post.png)

### View your posts and drafts

![View Posts](/public/view-posts.png)

</details>

## Project Plan

# 🛠️ Service Center CRM - Development Checklist

A custom CRM system for a printer repair business built with **Next.js**, **shadcn/ui**, **NextAuth**, **Prisma**, and **PostgreSQL** (or MongoDB).

---

## ⚙️ Phase 1: Project Setup

- ✅ Create Next.js App: `npx create-next-app@latest service-center-crm`
- ✅ Navigate into project: `cd service-center-crm`
- ✅ Initialize Git repository (optional): `git init`
- ✅ Install dependencies:
  ```bash
  npm install @auth/prisma-adapter bcrypt next-auth prisma @prisma/client
  npm install lucide-react tailwind-variants class-variance-authority
  ```

✅ Full Development Roadmap for service-center-crm
⚙️ Phase 1: Project Setup
Initialize Git repo (if needed)

Install dependencies:

bash
Copy
Edit
npm install @auth/prisma-adapter bcrypt next-auth prisma @prisma/client
npm install lucide-react tailwind-variants class-variance-authority
Initialize Prisma:

bash
Copy
Edit
npx prisma init
Setup your database (PostgreSQL recommended — local or Supabase/Neon)

Update .env with DATABASE_URL

🎨 Phase 2: UI Setup (Tailwind + shadcn/ui)
Install shadcn/ui:

bash
Copy
Edit
npx shadcn-ui@latest init
Add common components:

bash
Copy
Edit
npx shadcn-ui@latest add button input card form
🔐 Phase 3: Authentication System
Design your User model in prisma/schema.prisma with role enum:

Fields: id, email, password, name, role, timestamps

Run migration:

bash
Copy
Edit
npx prisma migrate dev --name init
Create lib/prisma.ts – singleton Prisma client

Setup NextAuth config in lib/auth.ts

Create NextAuth API route in app/api/auth/[...nextauth]/route.ts

Create signup + login forms using shadcn/ui components

Hash password on signup using bcrypt

Protect pages and routes based on roles (RBAC)

📊 Phase 4: CRM Dashboard UI
Create role-based layout with sidebar/top nav

Setup pages:

/dashboard (Owner/Admin overview)

/jobs (repair orders)

/technicians

/customers

/profile

/login, /signup

Show/hide menu items based on session.user.role

🧰 Phase 5: Core Features (CRM Logic)
Create Job model in Prisma:

Fields: id, title, customerName, status, assignedTo, notes, timestamps

Relations to User (technician) if needed

Migrate and update Prisma client

Create CRUD UI for Jobs (Add/Edit/Delete/View)

Create filters by status, technician, date

Setup Supervisor view (filtered job list)

Setup Technician view (assigned jobs only)

☁️ Phase 6: Deployment & Security
Set up environment variables for production

Deploy to Vercel (recommended)

Use a managed DB (Supabase, Railway, Neon)

Enable HTTPS, domain, email protection

Add rate limiting or audit logs (optional)

📦 Phase 7: Optional Add-ons
Email notification system (e.g., for status update)

File upload for job photos (use Cloudinary or UploadThing)

Customer-facing job status portal

Basic analytics dashboard (completed jobs, avg time, etc.)

✅ Full Development Roadmap for service-center-crm
⚙️ Phase 1: Project Setup
Initialize Git repo (if needed)

Install dependencies:

bash
Copy
Edit
npm install @auth/prisma-adapter bcrypt next-auth prisma @prisma/client
npm install lucide-react tailwind-variants class-variance-authority
Initialize Prisma:

bash
Copy
Edit
npx prisma init
Setup your database (PostgreSQL recommended — local or Supabase/Neon)

Update .env with DATABASE_URL

🎨 Phase 2: UI Setup (Tailwind + shadcn/ui)
Install shadcn/ui:

bash
Copy
Edit
npx shadcn-ui@latest init
Add common components:

bash
Copy
Edit
npx shadcn-ui@latest add button input card form
🔐 Phase 3: Authentication System
Design your User model in prisma/schema.prisma with role enum:

Fields: id, email, password, name, role, timestamps

Run migration:

bash
Copy
Edit
npx prisma migrate dev --name init
Create lib/prisma.ts – singleton Prisma client

Setup NextAuth config in lib/auth.ts

Create NextAuth API route in app/api/auth/[...nextauth]/route.ts

Create signup + login forms using shadcn/ui components

Hash password on signup using bcrypt

Protect pages and routes based on roles (RBAC)

📊 Phase 4: CRM Dashboard UI
Create role-based layout with sidebar/top nav

Setup pages:

/dashboard (Owner/Admin overview)

/jobs (repair orders)

/technicians

/customers

/profile

/login, /signup

Show/hide menu items based on session.user.role

🧰 Phase 5: Core Features (CRM Logic)
Create Job model in Prisma:

Fields: id, title, customerName, status, assignedTo, notes, timestamps

Relations to User (technician) if needed

Migrate and update Prisma client

Create CRUD UI for Jobs (Add/Edit/Delete/View)

Create filters by status, technician, date

Setup Supervisor view (filtered job list)

Setup Technician view (assigned jobs only)

☁️ Phase 6: Deployment & Security
Set up environment variables for production

Deploy to Vercel (recommended)

Use a managed DB (Supabase, Railway, Neon)

Enable HTTPS, domain, email protection

Add rate limiting or audit logs (optional)

📦 Phase 7: Optional Add-ons
Email notification system (e.g., for status update)

File upload for job photos (use Cloudinary or UploadThing)

Customer-facing job status portal

Basic analytics dashboard (completed jobs, avg time, etc.)
