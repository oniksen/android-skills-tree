"use client";

import Link, { useLinkStatus } from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { normalizeReleaseVersion } from "@/lib/version";
import { usePathname } from "next/navigation";
import StreakBadge from "@/shared/ui/StreakBadge";
import CurrencyBadge from "@/shared/ui/CurrencyBadge";
import BrandMark from "@/shared/ui/BrandMark";
import {
  DashboardSkeleton,
  TreeSkeleton,
  ProjectsSkeleton,
  RoadmapSkeleton,
  AchievementsSkeleton,
  ShopSkeleton,
  ProfileSkeleton,
} from "@/shared/ui/skeletons";
import {
  LayoutDashboard,
  GitBranch,
  FolderGit2,
  Map,
  Trophy,
  CircleUser,
  LogIn,
  Terminal,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "dashboard", icon: LayoutDashboard },
  { href: "/tree/junior", label: "tree", shortLabel: "tree", icon: GitBranch },
  { href: "/projects", label: "projects", icon: FolderGit2 },
  { href: "/roadmap", label: "roadmap", icon: Map },
  { href: "/achievements", label: "achievements", icon: Trophy },
  { href: "/quiz", label: "quiz", icon: Terminal },
  { href: "/profile", label: "профиль", icon: CircleUser },
];

const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.href !== "/quiz");

const ROUTE_SKELETONS: Record<string, React.ComponentType> = {
  "/dashboard": DashboardSkeleton,
  "/tree/junior": TreeSkeleton,
  "/projects": ProjectsSkeleton,
  "/roadmap": RoadmapSkeleton,
  "/achievements": AchievementsSkeleton,
  "/shop": ShopSkeleton,
  "/profile": ProfileSkeleton,
};

function RoutePlaceholder({ href }: { href: string }) {
  const Placeholder = ROUTE_SKELETONS[href] ?? TreeSkeleton;
  return <Placeholder />;
}

type PendingNav = { href: string; startedPath: string };

interface HeaderProps {
  children?: React.ReactNode;
  mainClassName?: string;
  branch?: string | null;
  version?: string | null;
}

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark className="h-8 w-8 shrink-0" />
      <span className="hidden nav-md:block text-sm font-bold tracking-tight">
        <span className="text-gradient">android</span>
        <span className="text-slate-500">/</span>
        <span className="text-white">skill-tree</span>
      </span>
    </span>
  );
}

function Prompt({ path }: { path: string }) {
  const clean = path && path !== "/" ? path : "/tree/junior";
  return (
    <span className="min-w-0 flex items-center gap-1 font-mono text-xs">
      <span className="hidden shrink-0 text-blue-600 nav-md:inline">user@skill-tree</span>
      <span className="hidden shrink-0 text-slate-600 nav-md:inline">:</span>
      <span className="truncate text-slate-400">~{clean}</span>
      <span className="shrink-0 text-blue-600"> $</span>
      <span className="ml-0.5 inline-block h-3.5 w-1.5 shrink-0 animate-caret-blink bg-blue-600 align-middle" />
    </span>
  );
}

function PendingIndicator({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-1.5 w-1.5 rounded-sm bg-blue-500 transition-opacity duration-200 delay-100 ${
        pending ? "opacity-100 animate-pulse" : "opacity-0"
      } ${className}`}
    />
  );
}

function DesktopNavItem({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate: (href: string) => void;
}) {
  const isProfile = item.href === "/profile";
  const className = `group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 font-mono text-sm transition-colors duration-150 ${
    active ? "text-white" : "text-slate-400 hover:text-white"
  }`;

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="nav-active-desktop"
          className="absolute inset-0 rounded-md border border-blue-500/30 bg-blue-500/10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          initial={false}
        />
      )}
      <span
        className={`relative shrink-0 font-bold ${
          active ? "text-blue-600" : "text-slate-600 group-hover:text-blue-500"
        }`}
      >
        {active ? "▸" : ">"}
      </span>
      <item.icon
        className={`relative h-4 w-4 shrink-0 ${
          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
        }`}
      />
      <span className="relative">{item.label}</span>
      {!isProfile && (
        <PendingIndicator className="right-2.5 top-1/2 -translate-y-1/2" />
      )}
    </>
  );

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate(item.href)}
      className={className}
    >
      {inner}
    </Link>
  );
}

function TabletNavItem({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate: (href: string) => void;
}) {
  const isProfile = item.href === "/profile";
  const className = `relative flex flex-col items-center gap-1 rounded-md px-1.5 py-2 text-center font-mono text-[10px] leading-tight transition-colors duration-150 ${
    active ? "text-blue-600" : "text-slate-400 hover:text-white"
  }`;

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="nav-active-tablet"
          className="absolute inset-0 rounded-md border border-blue-500/30 bg-blue-500/10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          initial={false}
        />
      )}
      <item.icon className="relative h-5 w-5" />
      <span className="relative whitespace-nowrap">
        {item.shortLabel ?? item.label}
      </span>
      {!isProfile && <PendingIndicator className="right-1.5 top-1.5" />}
    </>
  );

  return (
    <Link
      href={item.href}
      title={item.label}
      onClick={() => onNavigate(item.href)}
      className={className}
    >
      {inner}
    </Link>
  );
}

function MobileNavItem({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={() => onNavigate(item.href)}
      aria-label={item.label}
      title={item.label}
      className={`relative flex min-h-[52px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 transition-colors duration-150 ${
        active
          ? "bg-blue-500/10 text-blue-600"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <item.icon className="relative h-7 w-7" />
      <PendingIndicator className="right-1.5 top-1.5" />
    </Link>
  );
}

export default function Header({
  children,
  mainClassName = "px-4 pt-8 pb-32 nav-md:pb-8",
  branch,
  version,
}: HeaderProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingNav | null>(null);
  const [readyPending, setReadyPending] = useState<PendingNav | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid } : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isNavigating = pending !== null && pending.startedPath === pathname;

  useEffect(() => {
    if (!isNavigating || !pending) return;
    const timer = setTimeout(() => setReadyPending(pending), 120);
    return () => clearTimeout(timer);
  }, [isNavigating, pending]);

  const handleNavigate = (href: string) => {
    if (pathname !== href) setPending({ href, startedPath: pathname });
  };

  const segment = (pathname ?? "").split("/")[1] || "";
  const activeHref = segment === "tree" ? "/tree/junior" : `/${segment}`;
  const isQuiz = (pathname ?? "").startsWith("/quiz");
  const isActive = (href: string) =>
    href === "/profile" ? activeHref === "/profile" : href === activeHref;
  const showNav = !loading && user;

  return (
    <div className="flex min-h-dvh">
      {showNav && (
        <nav
          className="hidden nav-lg:flex sticky top-0 self-start h-dvh z-40 w-64 flex-col border-r border-slate-700/70 bg-slate-950/90 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
          aria-label="Основная навигация"
        >
          <div className="flex h-14 shrink-0 items-center border-b border-slate-700/70 px-4">
            <Link href="/tree/junior" className="transition-opacity hover:opacity-80">
              <Brand />
            </Link>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="group">
                <DesktopNavItem
                  item={item}
                  active={isActive(item.href)}
                  onNavigate={handleNavigate}
                />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700/70 px-4 py-3 font-mono text-[10px] text-slate-600">
            {`status: ${branch ?? "local"} · ${normalizeReleaseVersion(version)}`}
          </div>
        </nav>
      )}

      {showNav && (
        <nav
          className="hidden nav-md:flex nav-lg:hidden sticky top-0 self-start h-dvh z-40 w-max flex-col items-stretch gap-1 border-r border-slate-700/70 bg-slate-950/90 px-3 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur-xl"
          aria-label="Основная навигация"
        >
          {NAV_ITEMS.map((item) => (
            <TabletNavItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
      )}

      <div className="flex min-h-dvh flex-1 min-w-0 flex-col">
        <header className="sticky top-0 z-50 border-b border-slate-700/70 bg-slate-950/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl header-blur">
          <div className="h-14 flex items-center justify-between gap-4 pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)]">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/tree/junior"
                className="nav-lg:hidden shrink-0 transition-opacity hover:opacity-80"
              >
                <BrandMark className="h-7 w-7" />
              </Link>
              <Prompt path={pathname ?? ""} />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {!loading && user && <StreakBadge />}
              {!loading && user && <CurrencyBadge />}
              {!loading && user && (
                <Link
                  href="/quiz"
                  className="nav-md:hidden flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
                  aria-label="quiz"
                >
                  <Terminal className="h-4 w-4" />
                </Link>
              )}
              {!loading &&
                !user &&
                pathname !== "/login" && (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden nav-md:inline">login</span>
                  </Link>
                )}
            </div>
          </div>
          <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        </header>

        <main
          className={
            isQuiz
              ? "flex w-full flex-1 flex-col"
              : `w-full max-w-6xl mx-auto flex-1 ${mainClassName}`
          }
        >
          {isNavigating && pending && readyPending === pending ? (
            <RoutePlaceholder href={pending.href} />
          ) : (
            children
          )}
        </main>
      </div>

      {showNav && (
        <motion.nav
          initial={false}
          animate={{ y: isQuiz ? 120 : 0, opacity: isQuiz ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ pointerEvents: isQuiz ? "none" : "auto" }}
          className="nav-md:hidden fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),0.875rem)] pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)]"
          aria-label="Основная навигация"
        >
          <div className="mx-auto max-w-sm rounded-2xl border border-slate-700/70 bg-slate-950/95 px-2 py-2 shadow-[0_18px_40px_rgba(26,25,21,0.28)] backdrop-blur-xl">
            <ul className="grid grid-cols-6 gap-1">
              {MOBILE_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <MobileNavItem
                    item={item}
                    active={isActive(item.href)}
                    onNavigate={handleNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>
      )}
    </div>

  );
}
