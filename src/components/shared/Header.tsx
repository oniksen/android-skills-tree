"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import StreakBadge from "@/components/shared/StreakBadge";
import {
  LayoutDashboard,
  GitBranch,
  FolderGit2,
  Map,
  Trophy,
  LogIn,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/tree/junior", label: "Дерево навыков", shortLabel: "Дерево", icon: GitBranch },
  { href: "/projects", label: "Проекты", icon: FolderGit2 },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/achievements", label: "Достижения", icon: Trophy },
];

interface HeaderProps {
  children?: React.ReactNode;
  mainClassName?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-blue-500/30">
        <GitBranch className="h-4 w-4" strokeWidth={2.4} />
        <span className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-br from-blue-500/40 to-fuchsia-500/40 blur-md" />
      </span>
      <span className="text-base font-bold tracking-tight">
        <span className="text-gradient">Android</span>{" "}
        <span className="text-white">Skill Tree</span>
      </span>
    </span>
  );
}

function DesktopNavItem({
  item,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
        active ? "text-white" : "text-slate-400 hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-desktop"
          className="absolute inset-0 rounded-xl border border-white/[0.08] bg-gradient-to-r from-blue-500/20 to-indigo-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          initial={false}
        />
      )}
      <span
        className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500 transition-all duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      <item.icon
        className={`relative h-5 w-5 shrink-0 transition-all duration-200 ${
          active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <span className="relative">{item.label}</span>
    </Link>
  );
}

function TabletNavItem({
  item,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      title={item.label}
      className={`relative flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-center text-[10px] leading-tight font-medium transition-colors duration-200 ${
        active ? "text-white" : "text-slate-400 hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-tablet"
          className="absolute inset-0 rounded-xl border border-white/[0.08] bg-blue-500/15"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          initial={false}
        />
      )}
      <item.icon
        className={`relative h-5 w-5 transition-all duration-200 ${
          active ? "text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]" : ""
        }`}
      />
      <span className="relative whitespace-nowrap">{item.shortLabel ?? item.label}</span>
    </Link>
  );
}

function MobileNavItem({
  item,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-200 ${
        active ? "text-blue-400" : "text-slate-400 hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-mobile"
          className="absolute top-1 h-1 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          initial={false}
        />
      )}
      <item.icon
        className={`relative h-5 w-5 transition-transform duration-200 ${
          active ? "scale-110 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]" : ""
        }`}
      />
      <span className="relative">{item.shortLabel ?? item.label}</span>
    </Link>
  );
}

export default function Header({
  children,
  mainClassName = "px-4 pt-8 pb-32 nav-md:pb-8",
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid } : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    await logout();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const segment = (pathname ?? "").split("/")[1] || "";
  const activeHref = segment === "tree" ? "/tree/junior" : `/${segment}`;
  const showNav = !loading && user;

  return (
    <div className="flex min-h-dvh">
      {showNav && (
        <nav
          className="hidden nav-lg:flex sticky top-0 self-start h-dvh z-40 w-64 flex-col border-r border-white/[0.06] bg-slate-950/70 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
          aria-label="Основная навигация"
        >
          <div className="flex h-16 shrink-0 items-center border-b border-white/[0.06] px-6">
            <Link href="/tree/junior" className="transition-opacity hover:opacity-80">
              <Brand />
            </Link>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="group">
                <DesktopNavItem item={item} active={item.href === activeHref} />
              </div>
            ))}
          </div>
        </nav>
      )}

      {showNav && (
        <nav
          className="hidden nav-md:flex nav-lg:hidden sticky top-0 self-start h-dvh z-40 w-max flex-col items-stretch gap-1 border-r border-white/[0.06] bg-slate-950/70 px-3 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur-xl"
          aria-label="Основная навигация"
        >
          {NAV_ITEMS.map((item) => (
            <TabletNavItem key={item.href} item={item} active={item.href === activeHref} />
          ))}
        </nav>
      )}

      <div className="flex min-h-dvh flex-1 min-w-0 flex-col">
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/70 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
          <div className="h-14 flex items-center justify-between gap-4 pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)]">
            <Link
              href="/tree/junior"
              className="nav-lg:hidden truncate transition-opacity hover:opacity-80"
            >
              <Brand />
            </Link>
            <div className="ml-auto flex items-center gap-2">
              {!loading && user && <StreakBadge />}
              {!loading &&
                (user ? (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </motion.button>
                ) : (
                  pathname !== "/login" && (
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <LogIn className="h-4 w-4" />
                      Войти
                    </Link>
                  )
                ))}
            </div>
          </div>
          <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`w-full max-w-6xl mx-auto flex-1 ${mainClassName}`}
        >
          {children}
        </motion.main>
      </div>

      {showNav && (
        <nav
          className="nav-md:hidden fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),0.875rem)] pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)]"
          aria-label="Основная навигация"
        >
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/85 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <ul className="grid grid-cols-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <MobileNavItem item={item} active={item.href === activeHref} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}