import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/tree/junior" className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
          Android Skill Tree
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/tree/junior" className="text-slate-400 hover:text-white transition-colors">
            Дерево навыков
          </Link>
          <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
            Войти
          </Link>
        </nav>
      </div>
    </header>
  );
}
