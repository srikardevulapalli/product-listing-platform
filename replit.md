# Note for Deployment

**Important**: This file (`replit.md`), `.replit`, and `replit.nix` are Replit-specific configuration files.

When deploying to production platforms (Vercel, Netlify, Render, etc.), you can safely ignore or remove these files. They are only needed for the Replit development environment.

## For GitHub Repository

When pushing to GitHub for your submission:
- These files can remain in the repo (they won't affect deployment)
- OR you can remove them from your cloned repo
- Make sure to keep all other documentation (README.md, DEPLOYMENT.md, ADMIN_SETUP.md, SECURITY.md)

## Quick Project Overview

This is an AI-powered product listing platform for the Full-Stack Engineer technical assessment.

**Tech Stack:**
- Frontend: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Backend: FastAPI + Python
- Database/Auth: Firebase (Firestore, Authentication, Storage)
- AI: OpenAI Vision API (GPT-4o)

**Setup:**
See `README.md` for complete setup instructions.

**Deployment:**
See `DEPLOYMENT.md` for production deployment guide.

**Admin Setup:**
See `ADMIN_SETUP.md` for creating admin users.

**Security:**
See `SECURITY.md` for security architecture details.
