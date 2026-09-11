"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function Header({
  children,
  mainClassName = "px-4 pt-8 pb-24 nav-md:pb-8",
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
    <div className="min-h-dvh">
      {showNav && (
        <nav
          className="hidden nav-lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-sm"
          aria-label="Основная навигация"
        >
          <div className="flex h-14 shrink-0 items-center border-b border-slate-800 px-5">
            <Link
              href="/tree/junior"
              className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
            >
              Android Skill Tree
            </Link>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {showNav && (
        <nav
          className="hidden nav-md:flex nav-lg:hidden fixed inset-y-0 left-0 z-40 w-20 flex-col items-center gap-1 border-r border-slate-800 bg-slate-950/95 py-3 backdrop-blur-sm"
          aria-label="Основная навигация"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2 text-center text-[10px] leading-tight font-medium transition-colors ${
                  active
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.shortLabel ?? item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      <div
        className={`flex min-h-dvh flex-col ${
          showNav ? "nav-md:pl-20 nav-lg:pl-64" : ""
        }`}
      >
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-sm">
          <Link
            href="/tree/junior"
            className="nav-lg:hidden truncate text-lg font-bold text-white hover:text-blue-400 transition-colors"
          >
            Android Skill Tree
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {!loading && user && <StreakBadge />}
            {!loading &&
              (user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              ) : (
                pathname !== "/login" && (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Войти
                  </Link>
                )
              ))}
          </div>
        </header>

        <main className={`w-full max-w-6xl mx-auto flex-1 ${mainClassName}`}>
          {children}
        </main>
      </div>

      {showNav && (
        <nav
          className="nav-md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm"
          aria-label="Основная навигация"
        >
          <ul className="grid grid-cols-5">
            {NAV_ITEMS.map((item) => {
              const active = item.href === activeHref;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                      active ? "text-blue-400" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.shortLabel ?? item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}