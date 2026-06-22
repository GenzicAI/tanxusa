# TanXUSA.com

The execution and delivery arm of Genzic.AI — built with Next.js 14, Tailwind CSS, Prisma, and NextAuth.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Demo Data (Optional)

```bash
npx tsx scripts/seed.ts
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this project to a GitHub repository
2. Import it in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example` in Vercel's project settings
4. Deploy!

### Required Vercel Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for auth sessions |
| `NEXTAUTH_URL` | Your production URL (e.g., https://tanxusa.com) |
| `AWS_REGION` | S3 bucket region |
| `AWS_BUCKET_NAME` | S3 bucket name |
| `AWS_FOLDER_PREFIX` | S3 folder prefix |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `ABACUSAI_API_KEY` | API key for AI chat feature |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (Credentials Provider)
- **Storage:** AWS S3 (file uploads)
- **AI Chat:** LLM API integration
- **Animations:** Framer Motion
- **UI Components:** Radix UI + shadcn/ui
