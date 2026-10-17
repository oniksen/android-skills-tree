"use client";

import Link from "next/link";
import {
  FolderGit2,
  GitBranch,
  LayoutDashboard,
  Map,
  ShoppingBag,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/tree/junior", label: "Дерево навыков", icon: GitBranch },
  { href: "/projects", label: "Проекты", icon: FolderGit2 },
  { href: "/roadmap", label: "Роадмап", icon: Map },
  { href: "/achievements", label: "Достижения", icon: Trophy },
  { href: "/shop", label: "Магазин", icon: ShoppingBag },
];

export default function ProfileLinks() {
  return (
    <section className="card-surface rounded-lg p-5">
      <h2 className="mb-4 font-mono text-sm font-semibold text-slate-300">
        <span className="text-slate-600">##</span> Разделы
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs text-slate-400 transition-colors hover:bg-blue-500/10 hover:text-blue-600"
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
