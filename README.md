# 📚 Apna Library 

A premium Digital Library Management System built with the **Golden Stack** (Next.js, Hono, and Cloudflare D1). This project uses a **pnpm Monorepo** structure for maximum performance and clean development.

## 🏗️ Project Structure

- `apps/web`: Frontend built with **Next.js 15 (Turbopack)** and **Tailwind CSS**.
- `apps/api`: Backend API built with **Hono** running on **Cloudflare Workers**.
- `packages/`: (Optional) Shared TypeScript types and logic.

---

## 🚀 Getting Started

### 1. Prerequisites
- [pnpm](https://pnpm.io/installation) installed via Homebrew.
- [Node.js](https://nodejs.org/) v20 or higher.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-updates/) for Cloudflare D1.

### 2. Installation
From the root directory, run:
```bash
pnpm install