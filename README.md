# Epitome Kia Website

Dealership website for Epitome Kia built with Next.js 14, Tailwind CSS, and Prisma.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your database connection and API keys.

4. Generate Prisma client and push schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Header, Footer, Navigation
│   ├── forms/          # Form components
│   └── features/       # Feature-specific components
├── lib/                # Utilities and helpers
└── types/              # TypeScript types
```

## License

Proprietary - Epitome Kia
