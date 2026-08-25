"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default function Header() {
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

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/tree/junior"
          className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
        >
          Android Skill Tree
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Дашборд
              </Link>
              <Link
                href="/tree/junior"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Дерево навыков
              </Link>
              <Link
                href="/projects"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Проекты
              </Link>
              <Link
                href="/roadmap"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Roadmap
              </Link>
              <Link
                href="/achievements"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Достижения
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            !loading &&
            pathname !== "/login" && (
              <Link
                href="/login"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Войти
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
