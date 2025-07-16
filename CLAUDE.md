# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 URL shortener application with PostgreSQL database, built for deployment on Zeabur. The application provides URL shortening, QR code generation, and dark/light theme toggle functionality with Chinese localization.

## Essential Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npx prisma generate  # Generate Prisma client after schema changes
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open database browser
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom dark mode implementation
- **QR Generation**: qrcode.js library
- **Icons**: Lucide React

### Database Schema
Single `Url` model with:
- `originalUrl` (unique): The original long URL
- `shortCode` (unique, 6 chars): URL-safe short identifier
- `title` (optional): Auto-fetched page title
- Indexed on both `originalUrl` and `shortCode` for performance

### Key Architecture Patterns

**Short Code Generation**: Uses URL-safe characters (A-Z, a-z, 0-9, -, _) with collision detection and retry logic (max 10 attempts).

**URL Validation**: Automatically adds `https://` prefix to URLs without protocol, validates format using URL constructor.

**Title Fetching**: Server-side HTML parsing with 5-second timeout and error handling.

**Database Strategy**: Uses unique constraints to prevent duplicate URLs and returns existing short codes for the same URL.

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── shorten/route.ts     # POST endpoint for URL shortening
│   │   └── title/route.ts       # GET endpoint for title fetching
│   ├── [shortCode]/page.tsx     # Dynamic route for redirects
│   ├── layout.tsx               # Root layout with fonts and metadata
│   ├── page.tsx                 # Main UI component
│   └── not-found.tsx            # 404 page for invalid short codes
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   └── url-shortener.ts         # Core business logic utilities
└── prisma/
    └── schema.prisma            # Database schema
```

## Environment Variables

Required environment variables:
```
DATABASE_URL=postgresql://...           # PostgreSQL connection string
NEXT_PUBLIC_BASE_URL=https://...       # Base URL for short link generation
```

## Key Implementation Details

### Short Code Generation
- 6-character length using URL-safe character set
- Collision detection with database unique constraint
- Retry mechanism with exponential backoff

### URL Processing Flow
1. Validate and normalize URL (add protocol if missing)
2. Check for existing URL in database
3. Generate unique short code if new URL
4. Fetch page title asynchronously
5. Store in database and return result

### UI State Management
- Single-page application with React hooks
- Client-side QR code generation
- Dark mode toggle with CSS class manipulation
- Smooth scrolling and clipboard integration

### Error Handling
- Comprehensive try-catch blocks in API routes
- User-friendly Chinese error messages
- Graceful degradation for title fetching failures
- Proper HTTP status codes in API responses

## Development Notes

The application follows Chinese localization throughout the UI. All error messages, labels, and user-facing text are in Traditional Chinese.

Database uses `cuid()` for primary keys and implements proper indexing for performance. The short code generation algorithm ensures URL-safe characters and handles collisions gracefully.

The UI implements responsive design with mobile-first approach and comprehensive dark mode support using Tailwind CSS classes.