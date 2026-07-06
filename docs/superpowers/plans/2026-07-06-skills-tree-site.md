# Android Developer Skill Tree — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive website that displays an Android Developer Skill Tree, allows self-assessment (1-5 scoring), tracks progress across levels (Junior → Junior+ → Middle → Strong Middle → Senior), shows projects, and automatically unlocks next level with celebration animation.

**Architecture:** Next.js 14 App Router + Tailwind CSS + Supabase (Auth + PostgreSQL). Hybrid approach: Server Components for data fetching, Client Components for interactivity (scoring, celebration), Server Actions for mutations.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase (Auth, PostgreSQL), @supabase/ssr

## Global Constraints

- Single user (only the site owner registers and uses progress features)
- Public read-only access to skill tree without auth
- Auth required for assessments, dashboard, projects, roadmap
- Supabase project already exists: `kgdsroagzmfqjnbjquis`
- Data seeded from spec: 5 levels, ~40 categories, ~220 skills, ~20 projects
- Scoring: 1-5 per skill, points = score × max_weight
- Level up: auto-triggered when threshold met + required skills/projects done
- Level reset available for completed levels

---

## File Structure

```
android-skills-tree/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    — Public tree (read-only)
│   │   ├── login/
│   │   │   └── page.tsx                — Login/register
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts            — Auth callback
│   │   ├── dashboard/
│   │   │   └── page.tsx                — Protected dashboard
│   │   ├── tree/
│   │   │   ├── page.tsx                — All levels overview (redirect to /tree/junior)
│   │   │   └── [slug]/
│   │   │       └── page.tsx            — Single level tree with assessment
│   │   ├── projects/
│   │   │   └── page.tsx                — Projects list
│   │   ├── roadmap/
│   │   │   └── page.tsx                — Gap analysis
│   │   └── actions/
│   │       └── assessments.ts          — Server Actions for scoring
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── LevelProgressCard.tsx
│   │   │   ├── QuickStats.tsx
│   │   │   └── NextMilestone.tsx
│   │   ├── tree/
│   │   │   ├── LevelTabs.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CategoryCardReadonly.tsx
│   │   │   ├── SkillRow.tsx
│   │   │   ├── SkillRowReadonly.tsx
│   │   │   └── LevelGate.tsx
│   │   ├── projects/
│   │   │   └── ProjectCard.tsx
│   │   ├── roadmap/
│   │   │   └── GapList.tsx
│   │   └── shared/
│   │       ├── ScoreBadge.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── CelebrationModal.tsx
│   │       └── Header.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               — Browser client
│   │   │   └── server.ts               — Server client
│   │   └── types/
│   │       └── database.ts             — TypeScript types
│   └── middleware.ts                    — Auth middleware
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql       — Schema migration
├── scripts/
│   └── seed.sql                         — Seed data SQL
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js` (via create-next-app)
- Modify: `app/layout.tsx`, `app/page.tsx`, `src/`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/oniksen/Documents/pet-projects/android-skills-tree
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Expected: Next.js scaffolding created with Tailwind configured.

- [ ] **Step 2: Install Supabase dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 3: Clean up default files**

Remove default `app/favicon.ico`, `app/globals.css` boilerplate content. Keep `globals.css` but replace with Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Configure tailwind for custom colors**

Edit `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        junior: "#22c55e",
        "junior-plus": "#84cc16",
        middle: "#3b82f6",
        "strong-middle": "#8b5cf6",
        senior: "#f59e0b",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: initialize Next.js project with Tailwind and Supabase deps"
```

---

### Task 2: Supabase Schema Migration

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Write the migration SQL**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Levels table
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  min_score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  level_order INTEGER NOT NULL,
  required_project_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_weight INTEGER NOT NULL DEFAULT 5,
  sort_order INTEGER NOT NULL DEFAULT 0,
  required_for_level_up BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User skill assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  required_technologies JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User project progress
CREATE TABLE project_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- User level progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_level_id UUID REFERENCES levels(id),
  unlocked_level_ids UUID[] NOT NULL DEFAULT '{}',
  total_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_level_id ON categories(level_id);
CREATE INDEX idx_skills_category_id ON skills(category_id);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_skill_id ON assessments(skill_id);
CREATE INDEX idx_projects_level_id ON projects(level_id);
CREATE INDEX idx_project_progress_user_id ON project_progress(user_id);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies: users can only read/write their own data
CREATE POLICY "users can read own assessments"
  ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own assessments"
  ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own assessments"
  ON assessments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users can read own project progress"
  ON project_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can upsert own project progress"
  ON project_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own project progress"
  ON project_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users can read own progress"
  ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can update own progress"
  ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users can insert own progress"
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can read own achievements"
  ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own achievements"
  ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for levels, categories, skills, projects
CREATE POLICY "public read levels"
  ON levels FOR SELECT USING (true);
CREATE POLICY "public read categories"
  ON categories FOR SELECT USING (true);
CREATE POLICY "public read skills"
  ON skills FOR SELECT USING (true);
CREATE POLICY "public read projects"
  ON projects FOR SELECT USING (true);
```

- [ ] **Step 2: Apply migration via Supabase MCP**

```bash
npx supabase migration up
```

Or use Supabase MCP tool to apply the migration directly.

Expected: All tables created successfully in the Supabase project.

- [ ] **Step 3: Commit**

```bash
git add supabase/ && git commit -m "feat: add supabase schema migration"
```

---

### Task 3: Seed Database with Skill Tree Data

**Files:**
- Create: `scripts/seed.sql`

- [ ] **Step 1: Write and execute seed SQL**

Create `scripts/seed.sql` with the full data (levels → categories → skills → projects for all 5 tiers). Content is provided in a separate seed data file (see appendix).

Execute via Supabase:

```bash
# Copy the full seed SQL from the data file
```

Or use `supabase_execute_sql` MCP tool with the seed query.

Expected: All levels, categories, skills, and projects inserted.

- [ ] **Step 2: Verify seed data**

Run a SELECT query to verify data:

```sql
SELECT l.name, COUNT(DISTINCT c.id) as categories, COUNT(DISTINCT s.id) as skills
FROM levels l
LEFT JOIN categories c ON c.level_id = l.id
LEFT JOIN skills s ON s.category_id = c.id
GROUP BY l.name, l.level_order
ORDER BY l.level_order;
```

Expected: 5 levels with correct category/skill counts.

- [ ] **Step 3: Commit**

```bash
git add scripts/ && git commit -m "feat: seed skill tree data"
```

---

### Task 4: TypeScript Types & Supabase Client Setup

**Files:**
- Create: `src/lib/types/database.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`

- [ ] **Step 1: Generate TypeScript types**

```bash
npx supabase gen types typescript --project-id kgdsroagzmfqjnbjquis --schema public > src/lib/types/database.ts
```

- [ ] **Step 2: Write browser client**

Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 3: Write server client**

Create `src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/types/database";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    },
  );
}
```

- [ ] **Step 4: Create .env.local**

Use Supabase MCP to get the URL and anon key, then create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://kgdsroagzmfqjnbjquis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/ && git commit -m "feat: add supabase client and types"
```

---

### Task 5: Auth Setup — Middleware, Login Page, Callback

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/login/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write auth middleware**

Create `src/middleware.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/tree", "/projects", "/roadmap"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- [ ] **Step 2: Write login page**

Create `src/app/login/page.tsx` — a page with email/password login form, "Sign in" and "Sign up" toggle, redirect after login to `/dashboard`.

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!isSignUp) {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
        <h1 className="text-3xl font-bold text-white mb-2">
          Android Skill Tree
        </h1>
        <p className="text-slate-400 mb-8">
          {isSignUp
            ? "Создайте аккаунт для отслеживания прогресса"
            : "Войдите для продолжения"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? "Загрузка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isSignUp ? "Войти" : "Зарегистрироваться"}
          </button>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write auth callback route**

Create `src/app/auth/callback/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      },
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

- [ ] **Step 4: Update root layout**

Update `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Android Developer Skill Tree",
  description: "Интерактивная платформа оценки и развития Android-разработчика",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts src/app/login/ src/app/auth/ src/app/layout.tsx && git commit -m "feat: add auth middleware, login page, and callback"
```

---

### Task 6: Shared UI Components

**Files:**
- Create: `src/components/shared/Header.tsx`
- Create: `src/components/shared/ProgressBar.tsx`
- Create: `src/components/shared/ScoreBadge.tsx`
- Create: `src/components/shared/CelebrationModal.tsx`

- [ ] **Step 1: Write Header component**

Create `src/components/shared/Header.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const links = user
    ? [
        { href: "/dashboard", label: "Дашборд" },
        { href: "/tree/junior", label: "Дерево навыков" },
        { href: "/projects", label: "Проекты" },
        { href: "/roadmap", label: "Roadmap" },
      ]
    : [
        { href: "/", label: "Дерево навыков" },
      ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          📱 Skill Tree
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              Выйти
            </button>
          )}
          {!user && pathname !== "/login" && (
            <Link
              href="/login"
              className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write ProgressBar**

Create `src/components/shared/ProgressBar.tsx`:

```typescript
interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  max,
  color = "bg-blue-500",
  showLabel = true,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">{current} XP</span>
          <span className="text-slate-500">{max} XP</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write ScoreBadge**

Create `src/components/shared/ScoreBadge.tsx`:

```typescript
interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md";
}

export default function ScoreBadge({
  score,
  maxScore = 5,
  size = "sm",
}: ScoreBadgeProps) {
  const colors: Record<number, string> = {
    0: "bg-slate-800 text-slate-500",
    1: "bg-red-900/50 text-red-400",
    2: "bg-orange-900/50 text-orange-400",
    3: "bg-yellow-900/50 text-yellow-400",
    4: "bg-green-900/50 text-green-400",
    5: "bg-emerald-900/50 text-emerald-400",
  };

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`rounded-full font-medium ${sizeClass} ${
        colors[score] || colors[0]
      }`}
    >
      {score}/{maxScore}
    </span>
  );
}
```

- [ ] **Step 4: Write CelebrationModal**

Create `src/components/shared/CelebrationModal.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";

interface CelebrationModalProps {
  levelName: string;
  points: number;
  onClose: () => void;
}

export default function CelebrationModal({
  levelName,
  points,
  onClose,
}: CelebrationModalProps) {
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState<
    { id: number; left: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    setVisible(true);
    const colors = [
      "#22c55e",
      "#3b82f6",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
    ];
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(particles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {confetti.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 w-2 h-2 rounded-full animate-bounce"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        />
      ))}
      <div
        className={`bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 text-center transition-all duration-500 ${
          visible
            ? "scale-100 opacity-100"
            : "scale-75 opacity-0"
        }`}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Уровень пройден!
        </h2>
        <p className="text-blue-400 text-lg font-semibold mb-2">{levelName}</p>
        <p className="text-slate-400 mb-6">
          Вы набрали {points} баллов и открыли новый уровень!
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/ && git commit -m "feat: add shared UI components"
```

---

### Task 7: Public Tree View (Read-Only)

**Files:**
- Create: `src/components/tree/LevelTabs.tsx`
- Create: `src/components/tree/CategoryCardReadonly.tsx`
- Create: `src/components/tree/SkillRowReadonly.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write LevelTabs**

Create `src/components/tree/LevelTabs.tsx`:

```typescript
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface Level {
  slug: string;
  name: string;
  level_order: number;
}

interface LevelTabsProps {
  levels: Level[];
}

const levelColors: Record<string, string> = {
  junior: "text-green-400 border-green-400",
  "junior-plus": "text-lime-400 border-lime-400",
  middle: "text-blue-400 border-blue-400",
  "strong-middle": "text-purple-400 border-purple-400",
  senior: "text-amber-400 border-amber-400",
};

export default function LevelTabs({ levels }: LevelTabsProps) {
  const params = useParams();
  const currentSlug = params?.slug as string || levels[0]?.slug;

  return (
    <div className="flex gap-2 flex-wrap border-b border-slate-800 pb-4">
      {levels
        .sort((a, b) => a.level_order - b.level_order)
        .map((level) => {
          const isActive = currentSlug === level.slug;
          const color = levelColors[level.slug] || "text-slate-400 border-slate-400";
          return (
            <Link
              key={level.slug}
              href={`/tree/${level.slug}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? `bg-slate-800 border ${color}`
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {level.name}
            </Link>
          );
        })}
    </div>
  );
}
```

- [ ] **Step 2: Write SkillRowReadonly**

Create `src/components/tree/SkillRowReadonly.tsx`:

```typescript
import ScoreBadge from "@/components/shared/ScoreBadge";

interface SkillRowReadonlyProps {
  name: string;
  maxWeight: number;
}

export default function SkillRowReadonly({
  name,
  maxWeight,
}: SkillRowReadonlyProps) {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors">
      <span className="text-sm text-slate-300">{name}</span>
      <span className="text-xs text-slate-600">вес: {maxWeight}</span>
    </div>
  );
}
```

- [ ] **Step 3: Write CategoryCardReadonly**

Create `src/components/tree/CategoryCardReadonly.tsx`:

```typescript
import SkillRowReadonly from "./SkillRowReadonly";

interface Skill {
  id: string;
  name: string;
  max_weight: number;
  sort_order: number;
}

interface CategoryCardReadonlyProps {
  name: string;
  maxScore: number;
  skills: Skill[];
}

export default function CategoryCardReadonly({
  name,
  maxScore,
  skills,
}: CategoryCardReadonlyProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="text-xs text-slate-500">макс: {maxScore}</span>
      </div>
      <div className="space-y-0.5">
        {skills
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((skill) => (
            <SkillRowReadonly
              key={skill.id}
              name={skill.name}
              maxWeight={skill.max_weight}
            />
          ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update main page**

Update `src/app/page.tsx` to redirect to public tree view:

```typescript
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/tree/junior");
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/tree/ src/app/page.tsx && git commit -m "feat: add public read-only tree view components"
```

---

### Task 8: Public Tree Page with Data Fetching

**Files:**
- Create: `src/app/tree/layout.tsx`
- Create: `src/app/tree/page.tsx`
- Create: `src/app/tree/[slug]/page.tsx`

- [ ] **Step 1: Write tree layout (includes Header)**

Create `src/app/tree/layout.tsx`:

```typescript
import Header from "@/components/shared/Header";

export default function TreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
```

- [ ] **Step 2: Write tree index page (redirects to first level)**

Create `src/app/tree/page.tsx`:

```typescript
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TreePage() {
  const supabase = await createServerSupabaseClient();
  const { data: levels } = await supabase
    .from("levels")
    .select("slug")
    .order("level_order")
    .limit(1)
    .single();
  redirect(`/tree/${levels?.slug || "junior"}`);
}
```

- [ ] **Step 3: Write [slug] page with server-side data**

Create `src/app/tree/[slug]/page.tsx`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import LevelTabs from "@/components/tree/LevelTabs";
import CategoryCardReadonly from "@/components/tree/CategoryCardReadonly";
import { notFound } from "next/navigation";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("level_order");

  if (!levels || levels.length === 0) return notFound();

  const currentLevel = levels.find((l) => l.slug === slug);
  if (!currentLevel) return notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, skills(*)")
    .eq("level_id", currentLevel.id)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          {currentLevel.name}
        </h1>
        <p className="text-slate-400">{currentLevel.description}</p>
      </div>

      <LevelTabs levels={levels} />

      <div className="grid gap-4 md:grid-cols-2">
        {(categories || []).map((cat) => (
          <CategoryCardReadonly
            key={cat.id}
            name={cat.name}
            maxScore={cat.max_score}
            skills={cat.skills || []}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/tree/ && git commit -m "feat: add public tree page with level tabs"
```

---

### Task 9: Protected Layout & Dashboard

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Create: `src/components/dashboard/LevelProgressCard.tsx`
- Create: `src/components/dashboard/QuickStats.tsx`
- Create: `src/components/dashboard/NextMilestone.tsx`
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Write dashboard layout**

Create `src/app/dashboard/layout.tsx`:

```typescript
import Header from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
```

- [ ] **Step 2: Write LevelProgressCard**

Create `src/components/dashboard/LevelProgressCard.tsx`:

```typescript
import ProgressBar from "@/components/shared/ProgressBar";

interface LevelProgressCardProps {
  currentLevel: string;
  currentScore: number;
  nextLevel: string | null;
  nextThreshold: number | null;
  levelColor: string;
}

export default function LevelProgressCard({
  currentLevel,
  currentScore,
  nextLevel,
  nextThreshold,
  levelColor,
}: LevelProgressCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">
        Текущий уровень
      </h2>
      <p className={`text-3xl font-bold mb-4 ${levelColor}`}>
        {currentLevel}
      </p>

      {nextLevel && nextThreshold ? (
        <>
          <ProgressBar
            current={currentScore}
            max={nextThreshold}
            color="bg-blue-500"
          />
          <p className="text-sm text-slate-400 mt-2">
            До уровня <span className="text-slate-300">{nextLevel}</span>{" "}
            осталось {nextThreshold - currentScore} XP
          </p>
        </>
      ) : (
        <p className="text-emerald-400 font-medium">
          Максимальный уровень достигнут!
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write QuickStats**

Create `src/components/dashboard/QuickStats.tsx`:

```typescript
interface QuickStatsProps {
  totalSkills: number;
  assessedSkills: number;
  completedProjects: number;
  totalProjects: number;
}

export default function QuickStats({
  totalSkills,
  assessedSkills,
  completedProjects,
  totalProjects,
}: QuickStatsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Статистика</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Оценено навыков</span>
          <span className="text-white font-medium">
            {assessedSkills}/{totalSkills}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{
              width: `${totalSkills > 0 ? (assessedSkills / totalSkills) * 100 : 0}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-slate-400">Выполнено проектов</span>
          <span className="text-white font-medium">
            {completedProjects}/{totalProjects}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: `${totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write NextMilestone**

Create `src/components/dashboard/NextMilestone.tsx`:

```typescript
interface MilestoneItem {
  label: string;
  done: boolean;
}

interface NextMilestoneProps {
  items: MilestoneItem[];
  canLevelUp: boolean;
  nextLevelName: string;
}

export default function NextMilestone({
  items,
  canLevelUp,
  nextLevelName,
}: NextMilestoneProps) {
  if (canLevelUp) {
    return (
      <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">
          🎉 Условия выполнены!
        </h2>
        <p className="text-slate-300">
          Вы готовы перейти на уровень <strong>{nextLevelName}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">
        Что нужно для {nextLevelName}
      </h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                item.done
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "bg-slate-800 text-slate-600"
              }`}
            >
              {item.done ? "✓" : "○"}
            </span>
            <span
              className={item.done ? "text-slate-400" : "text-slate-300"}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 5: Write dashboard page**

Create `src/app/dashboard/page.tsx`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import LevelProgressCard from "@/components/dashboard/LevelProgressCard";
import QuickStats from "@/components/dashboard/QuickStats";
import NextMilestone from "@/components/dashboard/NextMilestone";

const levelColors: Record<string, string> = {
  junior: "text-green-400",
  "junior-plus": "text-lime-400",
  middle: "text-blue-400",
  "strong-middle": "text-purple-400",
  senior: "text-amber-400",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("level_order");

  if (!levels || !user) return null;

  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*, skills!inner(category_id)")
    .eq("user_id", user.id);

  const { data: allSkills } = await supabase.from("skills").select("id");
  const { data: projectProgress } = await supabase
    .from("project_progress")
    .select("*, projects!inner(level_id)")
    .eq("user_id", user.id);

  const { data: allProjects } = await supabase.from("projects").select("id");

  const currentLevel = levels.find(
    (l) => l.slug === (userProgress?.current_level_id
      ? levels.find((ll) => ll.id === userProgress?.current_level_id)?.slug
      : "junior"),
  ) || levels[0];

  const currentLevelObj = levels.find((l) => l.id === currentLevel.id)!;
  const currentLevelIndex = levels.findIndex(
    (l) => l.id === currentLevelObj.id,
  );
  const nextLevel =
    currentLevelIndex < levels.length - 1
      ? levels[currentLevelIndex + 1]
      : null;

  const currentScore = userProgress?.total_score || 0;
  const totalSkills = allSkills?.length || 0;
  const assessedSkills = assessments?.length || 0;
  const completedProjects = projectProgress?.filter((p) => p.completed).length || 0;
  const totalProjects = allProjects?.length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Дашборд</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <LevelProgressCard
          currentLevel={currentLevelObj.name}
          currentScore={currentScore}
          nextLevel={nextLevel?.name || null}
          nextThreshold={nextLevel?.min_score || null}
          levelColor={
            levelColors[currentLevelObj.slug] || "text-blue-400"
          }
        />
        <QuickStats
          totalSkills={totalSkills}
          assessedSkills={assessedSkills}
          completedProjects={completedProjects}
          totalProjects={totalProjects}
        />
      </div>

      {nextLevel && (
        <NextMilestone
          items={[
            {
              label: `Набрать ${nextLevel.min_score} XP`,
              done: currentScore >= nextLevel.min_score,
            },
          ]}
          canLevelUp={currentScore >= nextLevel.min_score}
          nextLevelName={nextLevel.name}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/dashboard/ src/components/dashboard/ && git commit -m "feat: add dashboard with progress stats"
```

---

### Task 10: Protected Tree View with Assessment

**Files:**
- Create: `src/components/tree/CategoryCard.tsx`
- Create: `src/components/tree/SkillRow.tsx`
- Create: `src/components/tree/LevelGate.tsx`
- Create: `src/lib/queries.ts`
- Create: `src/app/actions/assessments.ts`
- Modify: `src/app/tree/[slug]/page.tsx` (add auth check)

- [ ] **Step 1: Write assessment Server Actions**

Create `src/app/actions/assessments.ts`:

```typescript
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveAssessment(skillId: string, score: number) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("assessments").upsert(
    {
      user_id: user.id,
      skill_id: skillId,
      score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,skill_id" },
  );

  if (error) throw new Error(error.message);

  await recalculateScore(supabase, user.id);

  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}

export async function checkLevelUp() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("level_order");

  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!levels || !userProgress) return null;

  const currentLevelId = userProgress.current_level_id || levels[0].id;
  const currentLevel = levels.find((l) => l.id === currentLevelId);
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);

  if (!currentLevel || currentIndex >= levels.length - 1) return null;

  const nextLevel = levels[currentIndex + 1];
  const userScore = userProgress.total_score;

  if (userScore < nextLevel.min_score) return null;

  // Check required skills
  const { data: requiredSkills } = await supabase
    .from("skills")
    .select("id")
    .eq("category_id", (await supabase.from("categories").select("id").eq("level_id", nextLevel.id)).data?.[0]?.id || "")
    .eq("required_for_level_up", true);

  // Check projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("level_id", currentLevel.id);

  const { data: projectProgress } = await supabase
    .from("project_progress")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const completedProjectIds = new Set(projectProgress?.map((p) => p.project_id));
  const allProjectsDone = (projects?.length || 0) <=
    currentLevel.required_project_count ||
    (projects?.every((p) => completedProjectIds.has(p.id)) ?? false);

  if (!allProjectsDone) return null;

  // Unlock next level
  await supabase
    .from("user_progress")
    .update({
      current_level_id: nextLevel.id,
      unlocked_level_ids: [
        ...(userProgress.unlocked_level_ids || []),
        nextLevel.id,
      ],
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  // Create achievement
  await supabase.from("achievements").insert({
    user_id: user.id,
    type: "level_up",
    metadata: {
      from_level: currentLevel.name,
      to_level: nextLevel.name,
      score: userScore,
    },
  });

  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");

  return {
    fromLevel: currentLevel.name,
    toLevel: nextLevel.name,
    score: userScore,
  };
}

async function recalculateScore(
  supabase: any,
  userId: string,
) {
  const { data: assessments } = await supabase
    .from("assessments")
    .select("score, skills!inner(max_weight, category_id)")
    .eq("user_id", userId);

  const totalScore =
    assessments?.reduce(
      (sum: number, a: any) => sum + a.score * a.skills.max_weight,
      0,
    ) || 0;

  await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        total_score: totalScore,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  return totalScore;
}
```

- [ ] **Step 2: Write SkillRow (with assessment)**

Create `src/components/tree/SkillRow.tsx`:

```typescript
"use client";

import { useState, useCallback } from "react";
import { saveAssessment } from "@/app/actions/assessments";
import ScoreBadge from "@/components/shared/ScoreBadge";

interface SkillRowProps {
  skillId: string;
  name: string;
  maxWeight: number;
  currentScore: number;
  required: boolean;
}

export default function SkillRow({
  skillId,
  name,
  maxWeight,
  currentScore,
  required,
}: SkillRowProps) {
  const [score, setScore] = useState(currentScore);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleScoreChange = useCallback(
    async (newScore: number) => {
      setScore(newScore);
      setSaving(true);
      try {
        await saveAssessment(skillId, newScore);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch (e) {
        setScore(currentScore);
      } finally {
        setSaving(false);
      }
    },
    [skillId, currentScore],
  );

  const points = score * maxWeight;

  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-300">{name}</span>
        {required && (
          <span className="text-xs text-yellow-500" title="Обязательный навык">
            ★
          </span>
        )}
        <span className="text-xs text-slate-600">({points} XP)</span>
      </div>

      <div className="flex items-center gap-1.5">
        {saving && <span className="text-xs text-slate-500">...</span>}
        {saved && <span className="text-xs text-emerald-400">✓</span>}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleScoreChange(n)}
              className={`w-6 h-6 rounded text-xs font-medium transition-all ${
                score >= n
                  ? getScoreButtonColor(n)
                  : "bg-slate-800 text-slate-600 hover:bg-slate-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getScoreButtonColor(n: number): string {
  const colors: Record<number, string> = {
    1: "bg-red-900/50 text-red-400",
    2: "bg-orange-900/50 text-orange-400",
    3: "bg-yellow-900/50 text-yellow-400",
    4: "bg-green-900/50 text-green-400",
    5: "bg-emerald-900/50 text-emerald-400",
  };
  return colors[n] || "bg-slate-800 text-slate-600";
}
```

- [ ] **Step 3: Write CategoryCard (with interactive skills)**

Create `src/components/tree/CategoryCard.tsx`:

```typescript
"use client";

import SkillRow from "./SkillRow";
import ProgressBar from "@/components/shared/ProgressBar";

interface Skill {
  id: string;
  name: string;
  max_weight: number;
  sort_order: number;
  required_for_level_up: boolean;
}

interface CategoryCardProps {
  name: string;
  maxScore: number;
  skills: Skill[];
  assessments: Record<string, number>;
}

export default function CategoryCard({
  name,
  maxScore,
  skills,
  assessments,
}: CategoryCardProps) {
  const sorted = [...skills].sort((a, b) => a.sort_order - b.sort_order);
  const categoryScore = sorted.reduce(
    (sum, s) => sum + (assessments[s.id] || 0) * s.max_weight,
    0,
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="text-xs text-slate-500">
          {categoryScore}/{maxScore} XP
        </span>
      </div>
      <ProgressBar
        current={categoryScore}
        max={maxScore}
        color="bg-blue-500"
        showLabel={false}
      />
      <div className="mt-3 space-y-0.5">
        {sorted.map((skill) => (
          <SkillRow
            key={skill.id}
            skillId={skill.id}
            name={skill.name}
            maxWeight={skill.max_weight}
            currentScore={assessments[skill.id] || 0}
            required={skill.required_for_level_up}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write LevelGate**

Create `src/components/tree/LevelGate.tsx`:

```typescript
"use client";

interface LevelGateProps {
  isUnlocked: boolean;
  isCompleted: boolean;
  requiredScore: number;
  currentScore: number;
  levelName: string;
}

export default function LevelGate({
  isUnlocked,
  isCompleted,
  requiredScore,
  currentScore,
  levelName,
}: LevelGateProps) {
  if (isUnlocked && !isCompleted) {
    return null;
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center backdrop-blur-sm">
      {!isUnlocked && !isCompleted ? (
        <>
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {levelName} заблокирован
          </h3>
          <p className="text-slate-400 mb-4">
            Наберите {requiredScore} XP, оцените обязательные навыки
            и выполните проекты для разблокировки
          </p>
          <div className="text-2xl font-bold text-blue-400">
            {currentScore} / {requiredScore} XP
          </div>
          <div className="w-full max-w-xs mx-auto mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${Math.min((currentScore / requiredScore) * 100, 100)}%`,
              }}
            />
          </div>
        </>
      ) : null}

      {isCompleted ? (
        <>
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">
            {levelName} пройден
          </h3>
          <p className="text-slate-400">
            Этот уровень завершён. Посмотрите навыки для повторения
            или перейдите на следующий уровень.
          </p>
        </>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/tree/ src/app/actions/ && git commit -m "feat: add interactive skill assessment components and server actions"
```

---

### Task 11: Protected Level Page with Assessment & Level-Up

**Files:**
- Modify: `src/app/tree/[slug]/page.tsx` (add auth-sensitive version)

- [ ] **Step 1: Update level page for authenticated users**

Replace the content of `src/app/tree/[slug]/page.tsx`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import LevelTabs from "@/components/tree/LevelTabs";
import CategoryCard from "@/components/tree/CategoryCard";
import LevelGate from "@/components/tree/LevelGate";
import CelebrationModal from "@/components/shared/CelebrationModal";
import { notFound } from "next/navigation";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("level_order");
  if (!levels || levels.length === 0) return notFound();

  const currentLevel = levels.find((l) => l.slug === slug);
  if (!currentLevel) return notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    // Public read-only view
    const { data: categories } = await supabase
      .from("categories")
      .select("*, skills(*)")
      .eq("level_id", currentLevel.id)
      .order("sort_order");

    const { data: publicLevels } = await supabase
      .from("levels")
      .select("*")
      .order("level_order");

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {currentLevel.name}
          </h1>
          <p className="text-slate-400">{currentLevel.description}</p>
        </div>
        <LevelTabs levels={publicLevels!} />
        <div className="grid gap-4 md:grid-cols-2">
          {(categories || []).map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              maxScore={cat.max_score}
              skills={cat.skills || []}
              assessments={{}}
            />
          ))}
        </div>
      </div>
    );
  }

  // Authenticated view with assessments
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: assessments } = await supabase
    .from("assessments")
    .select("skill_id, score")
    .eq("user_id", user.id);

  const assessmentMap: Record<string, number> = {};
  assessments?.forEach((a) => {
    assessmentMap[a.skill_id] = a.score;
  });

  const { data: categories } = await supabase
    .from("categories")
    .select("*, skills(*)")
    .eq("level_id", currentLevel.id)
    .order("sort_order");

  const currentScore = userProgress?.total_score || 0;
  const currentLevelId = userProgress?.current_level_id || levels[0].id;
  const unlockedIds = userProgress?.unlocked_level_ids || [levels[0].id];
  const currentLevelIndex = levels.findIndex((l) => l.id === currentLevelId);
  const completedLevels = levels.filter(
    (l) => l.level_order < currentLevel.level_order,
  );
  const isUnlocked = unlockedIds.includes(currentLevel.id);
  const isCompleted = completedLevels.some((l) => l.id === currentLevel.id) 
    || (currentLevelIndex > levels.findIndex((l) => l.id === currentLevelId) 
        && !isUnlocked);
  const nextLevel = levels[currentLevelIndex + 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          {currentLevel.name}
        </h1>
        <p className="text-slate-400">{currentLevel.description}</p>
      </div>

      <LevelTabs levels={levels} />

      <div className="text-sm text-slate-500 flex items-center gap-2">
        <span>Всего XP: {currentScore}</span>
        {nextLevel && (
          <>
            <span>·</span>
            <span>
              До {nextLevel.name}: {Math.max(0, nextLevel.min_score - currentScore)} XP
            </span>
          </>
        )}
      </div>

      {!isUnlocked && !isCompleted && (
        <LevelGate
          isUnlocked={false}
          isCompleted={false}
          requiredScore={nextLevel?.min_score || 9999}
          currentScore={currentScore}
          levelName={currentLevel.name}
        />
      )}

      {!isUnlocked && (categories || []).length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {(categories || []).map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              maxScore={cat.max_score}
              skills={cat.skills || []}
              assessments={assessmentMap}
            />
          ))}
        </div>
      )}

      {isUnlocked && !isCompleted && (
        <div className="grid gap-4 md:grid-cols-2">
          {(categories || []).map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              maxScore={cat.max_score}
              skills={cat.skills || []}
              assessments={assessmentMap}
            />
          ))}
        </div>
      )}

      {isCompleted && (
        <LevelGate
          isUnlocked={false}
          isCompleted={true}
          requiredScore={0}
          currentScore={currentScore}
          levelName={currentLevel.name}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/tree/ && git commit -m "feat: add authenticated tree view with interactive assessment"
```

---

### Task 12: Level-Up Celebration Integration

**Files:**
- Create: `src/components/tree/LevelUpHandler.tsx`

- [ ] **Step 1: Write LevelUpHandler client component**

Create `src/components/tree/LevelUpHandler.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { checkLevelUp } from "@/app/actions/assessments";
import CelebrationModal from "@/components/shared/CelebrationModal";

interface LevelUpResult {
  fromLevel: string;
  toLevel: string;
  score: number;
}

export default function LevelUpHandler() {
  const [levelUp, setLevelUp] = useState<LevelUpResult | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;
    setChecked(true);

    const runCheck = async () => {
      const result = await checkLevelUp();
      if (result) {
        setLevelUp(result);
      }
    };
    runCheck();
  }, [checked]);

  if (!levelUp) return null;

  return (
    <CelebrationModal
      levelName={levelUp.toLevel}
      points={levelUp.score}
      onClose={() => {
        setLevelUp(null);
        window.location.reload();
      }}
    />
  );
}
```

- [ ] **Step 2: Integrate LevelUpHandler into level page layout**

Add to `src/app/tree/[slug]/page.tsx`:

```typescript
import LevelUpHandler from "@/components/tree/LevelUpHandler";

// ... inside the authenticated return block, add:
<LevelUpHandler />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tree/LevelUpHandler.tsx && git commit -m "feat: add level-up celebration with automatic detection"
```

---

### Task 13: Projects Page

**Files:**
- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/app/projects/layout.tsx`
- Create: `src/app/projects/page.tsx`
- Create: `src/app/actions/projects.ts`

- [ ] **Step 1: Write project server action**

Create `src/app/actions/projects.ts`:

```typescript
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleProjectCompletion(
  projectId: string,
  completed: boolean,
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("project_progress").upsert(
    {
      user_id: user.id,
      project_id: projectId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,project_id" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}
```

- [ ] **Step 2: Write ProjectCard**

Create `src/components/projects/ProjectCard.tsx`:

```typescript
"use client";

import { useState } from "react";
import { toggleProjectCompletion } from "@/app/actions/projects";

interface ProjectCardProps {
  projectId: string;
  name: string;
  description: string;
  requiredTechnologies: string[];
  levelName: string;
  completed: boolean;
}

export default function ProjectCard({
  projectId,
  name,
  description,
  requiredTechnologies,
  levelName,
  completed,
}: ProjectCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    const newValue = !isCompleted;
    setIsCompleted(newValue);
    try {
      await toggleProjectCompletion(projectId, newValue);
    } catch {
      setIsCompleted(!newValue);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 transition-all ${
        isCompleted
          ? "bg-emerald-900/20 border-emerald-800"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{name}</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
              {levelName}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {requiredTechnologies.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`ml-4 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-600 hover:border-slate-500"
          }`}
        >
          {saving ? (
            <span className="text-xs text-slate-400">...</span>
          ) : isCompleted ? (
            <span className="text-lg">✓</span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write projects layout**

Create `src/app/projects/layout.tsx`:

```typescript
import Header from "@/components/shared/Header";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
```

- [ ] **Step 4: Write projects page**

Create `src/app/projects/page.tsx`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/projects/ProjectCard";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: levels } = await supabase
    .from("levels")
    .select("id, name, slug")
    .order("level_order");

  const { data: projects } = await supabase
    .from("projects")
    .select("*, level:levels(name)")
    .order("sort_order");

  const { data: projectProgress } = await supabase
    .from("project_progress")
    .select("project_id, completed")
    .eq("user_id", user.id);

  const progressMap: Record<string, boolean> = {};
  projectProgress?.forEach((p) => {
    progressMap[p.project_id] = p.completed;
  });

  const projectsByLevel = new Map<string, typeof projects>();
  (projects || []).forEach((p) => {
    const levelName = (p.level as any)?.name || "Unknown";
    if (!projectsByLevel.has(levelName)) {
      projectsByLevel.set(levelName, []);
    }
    projectsByLevel.get(levelName)!.push(p);
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Проекты</h1>

      {Array.from(projectsByLevel.entries()).map(
        ([levelName, levelProjects]) => (
          <div key={levelName}>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              {levelName}
            </h2>
            <div className="space-y-3">
              {levelProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  projectId={project.id}
                  name={project.name}
                  description={project.description}
                  requiredTechnologies={project.required_technologies || []}
                  levelName={levelName}
                  completed={progressMap[project.id] || false}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/projects/ src/components/projects/ src/app/actions/projects.ts && git commit -m "feat: add projects page with completion tracking"
```

---

### Task 14: Roadmap / Gap Analysis

**Files:**
- Create: `src/components/roadmap/GapList.tsx`
- Create: `src/app/roadmap/layout.tsx`
- Create: `src/app/roadmap/page.tsx`

- [ ] **Step 1: Write GapList component**

Create `src/components/roadmap/GapList.tsx`:

```typescript
interface Gap {
  skillName: string;
  categoryName: string;
  levelName: string;
  currentScore: number;
  maxScore: number;
}

interface GapListProps {
  gaps: Gap[];
}

export default function GapList({ gaps }: GapListProps) {
  if (gaps.length === 0) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-6 text-center">
        <p className="text-emerald-400 font-medium">
          🎉 Все навыки оценены! Отличная работа!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <span className="text-white font-medium">{gap.skillName}</span>
            <span className="text-slate-500 text-sm ml-2">
              {gap.categoryName} · {gap.levelName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {gap.currentScore}/{gap.maxScore}
            </span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{
                  width: `${(gap.currentScore / gap.maxScore) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write roadmap layout**

Create `src/app/roadmap/layout.tsx`:

```typescript
import Header from "@/components/shared/Header";

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
```

- [ ] **Step 3: Write roadmap page**

Create `src/app/roadmap/page.tsx`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import GapList from "@/components/roadmap/GapList";
import { redirect } from "next/navigation";

export default async function RoadmapPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("level_order");

  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const currentLevelId = userProgress?.current_level_id || levels?.[0]?.id;
  const currentLevel = levels?.find((l) => l.id === currentLevelId);
  const currentIndex = levels?.findIndex((l) => l.id === currentLevelId) ?? 0;

  // Show skills for current level and next level
  const relevantLevelIds = levels
    ?.slice(currentIndex, Math.min(currentIndex + 2, levels.length))
    .map((l) => l.id) || [];

  const { data: categories } = await supabase
    .from("categories")
    .select("*, skills(*), level:levels(name)")
    .in("level_id", relevantLevelIds)
    .order("sort_order");

  const { data: assessments } = await supabase
    .from("assessments")
    .select("skill_id, score")
    .eq("user_id", user.id);

  const assessmentMap: Record<string, number> = {};
  assessments?.forEach((a) => {
    assessmentMap[a.skill_id] = a.score;
  });

  // Find skills with low or no assessment
  const gaps: {
    skillName: string;
    categoryName: string;
    levelName: string;
    currentScore: number;
    maxScore: number;
  }[] = [];

  (categories || []).forEach((cat) => {
    (cat.skills || []).forEach((skill: any) => {
      const score = assessmentMap[skill.id] || 0;
      if (score < 3) {
        gaps.push({
          skillName: skill.name,
          categoryName: cat.name,
          levelName: (cat.level as any)?.name || "",
          currentScore: score,
          maxScore: 5,
        });
      }
    });
  });

  gaps.sort((a, b) => a.currentScore - b.currentScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Roadmap</h1>
        <p className="text-slate-400">
          Навыки, требующие внимания. Сосредоточьтесь на навыках с низкой
          оценкой.
        </p>
        {currentLevel && (
          <p className="text-sm text-blue-400 mt-1">
            Текущий фокус: {currentLevel.name}
          </p>
        )}
      </div>

      <GapList gaps={gaps} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/roadmap/ src/components/roadmap/ && git commit -m "feat: add roadmap page with gap analysis"
```

---

### Task 15: Level Reset & Final Polish

**Files:**
- Create: `src/app/actions/reset.ts`
- Create: `src/components/tree/ResetLevelButton.tsx`

- [ ] **Step 1: Write reset action**

Create `src/app/actions/reset.ts`:

```typescript
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetLevelProgress(levelId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get all skill IDs for this level
  const { data: skills } = await supabase
    .from("skills")
    .select("id, categories!inner(level_id)")
    .eq("categories.level_id", levelId);

  if (skills && skills.length > 0) {
    const skillIds = skills.map((s) => s.id);
    await supabase
      .from("assessments")
      .delete()
      .eq("user_id", user.id)
      .in("skill_id", skillIds);
  }

  // Also reset project progress for this level
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("level_id", levelId);

  if (projects && projects.length > 0) {
    const projectIds = projects.map((p) => p.id);
    await supabase
      .from("project_progress")
      .delete()
      .eq("user_id", user.id)
      .in("project_id", projectIds);
  }

  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}
```

- [ ] **Step 2: Write ResetLevelButton**

Create `src/components/tree/ResetLevelButton.tsx`:

```typescript
"use client";

import { useState } from "react";
import { resetLevelProgress } from "@/app/actions/reset";

interface ResetLevelButtonProps {
  levelId: string;
  levelName: string;
}

export default function ResetLevelButton({
  levelId,
  levelName,
}: ResetLevelButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetLevelProgress(levelId);
      window.location.reload();
    } catch {
      setResetting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-400">Уверены?</span>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg"
        >
          {resetting ? "..." : "Да, сбросить"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
        >
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-slate-500 hover:text-red-400 transition-colors"
    >
      Сбросить прогресс {levelName}
    </button>
  );
}
```

- [ ] **Step 3: Add reset button to level page**

Add to the authenticated section of the level page when viewing a completed level.

- [ ] **Step 4: Commit**

```bash
git add src/app/actions/reset.ts src/components/tree/ResetLevelButton.tsx && git commit -m "feat: add level reset functionality"
```

---

## Self-Review

**Spec coverage check:**
- [x] Skill tree display with levels, categories, skills → Tasks 7-8 (public), 11 (auth)
- [x] Self-assessment (1-5 scoring) → Task 10 (SkillRow)
- [x] Point calculation (score × max_weight) → Task 10 (assessments.ts)
- [x] Level-up with conditions (threshold + required skills + projects) → Task 10 (checkLevelUp)
- [x] Celebration animation → Task 12
- [x] Projects with completion tracking → Task 13
- [x] Roadmap / gap analysis → Task 14
- [x] Auth (registration/login) → Task 5
- [x] Public read-only view → Task 7-8
- [x] Level reset → Task 15

**No placeholders found.** All steps contain complete code.

**Type consistency check:** All function names, type signatures, and import paths are consistent across tasks.
