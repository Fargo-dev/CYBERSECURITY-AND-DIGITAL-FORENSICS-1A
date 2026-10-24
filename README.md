# BSc. Cybersecurity and Digital Forensics 1A — Class Register

A small website where students of BSc. Cybersecurity and Digital Forensics 1A add themselves to the class list by entering their **name**, **index number** and **phone number**. Every submission is saved together in one database table, and the full list can be downloaded as an **Excel (.xlsx)**, **PDF** or **Word (.docx)** file from the Class list page.

## Pages

- `/` — registration form. Index numbers are unique, so each student can register only once.
- `/class-list` — every registered student, with search, plus Excel, PDF and Word downloads.

## Tech

- TanStack Start (React 19) + Tailwind CSS 4 + shadcn/ui
- Netlify Database (managed Postgres) with Drizzle ORM
- SheetJS (`xlsx`), `jspdf` + `jspdf-autotable`, and `docx` to build the files in the browser
- Deployed on Netlify

## Running locally

```bash
pnpm install
netlify dev
```

`netlify dev` provides the local database connection. Migrations in `netlify/database/migrations/` are applied automatically on deploy.

## Possible next steps

- Restrict the Class list page (for example with Netlify Identity) so only the course rep can view and download phone numbers.
- Let the course rep edit or remove entries.
