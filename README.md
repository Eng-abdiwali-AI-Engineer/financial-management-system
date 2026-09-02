# Smart Financial Management

A professional full-stack financial management dashboard inspired by the supplied reference design. It uses **React + Vite + Tailwind CSS + Node.js + Express + SQLite** with JWT authentication.

## Included
- Dark navy accounting sidebar matching the reference layout
- Financial Overview dashboard
- Revenue / expense / net profit / profit margin KPI cards
- Responsive revenue, expense and profit trend chart
- Income and expense donut summaries
- Sales, Purchases and Expenses registers
- Add and delete transactions
- Banking accounts and cash activity
- Reports and Tax Center
- Profile / business settings
- JWT login + bcrypt password hashing
- Login and self-service signup with role-based access (`Administrator` and `User`)
- Administrator control center for company totals and changing member roles
- User-scoped transaction entry for sales, purchases, and expenses
- SQLite database with demo seed data
- Responsive desktop/tablet/mobile layout

## Demo login
- Email: `admin@example.com`
- Password: `Admin@123`

New accounts register as `User`. The seeded demo account is the `Administrator` account.

## Requirements
- Node.js 22+ (Node 24 LTS recommended)
- npm

## Run
From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Frontend: http://localhost:3000  
API: http://localhost:5000/api/health

## Production build
```bash
npm run build
npm start
```

The SQLite database is created automatically at `server/finance.db` on first server start.

## Design reference
The supplied reference image is stored as `public/design-reference.jpg` for project documentation. The application itself recreates the visual system with responsive HTML/CSS and charts rather than placing the screenshot in the UI.

## Suggested next production upgrades
- Role-based permissions (Admin, Accountant, Manager, Viewer)
- Invoice/PDF generation
- Bank reconciliation
- Supplier and customer master data
- Recurring transactions
- Audit logs
- CSV/Excel/PDF exports
- PostgreSQL for multi-user deployment
- Secure refresh tokens and production secret management
