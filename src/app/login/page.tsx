"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { Mail, Lock, Eye, EyeOff, Loader2, GitBranch } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      await login(userCredential.user.uid);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? getFirebaseErrorMessage((err as { code?: string }).code || "unknown")
          : "Произошла ошибка";
      setError(errorMessage);
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] animate-orb rounded-full bg-blue-600/25 blur-[130px]" />
        <div
          className="absolute -right-24 top-1/3 h-[360px] w-[360px] animate-orb rounded-full bg-fuchsia-600/20 blur-[130px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute bottom-[-140px] left-1/3 h-[380px] w-[380px] animate-orb rounded-full bg-emerald-500/15 blur-[130px]"
          style={{ animationDelay: "-12s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_10%,transparent_70%)]" />
      </div>

      <motion.div
        key={shakeKey}
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <motion.div
          variants={item}
          className="card-surface relative overflow-hidden rounded-3xl shadow-2xl shadow-black/50"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <div className="p-8 sm:p-10">
            <motion.div variants={item} className="mb-8 flex flex-col items-center text-center">
              <motion.span
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-blue-500/40"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                <GitBranch className="h-7 w-7" strokeWidth={2.4} />
              </motion.span>
              <motion.h1
                variants={item}
                className="text-3xl font-bold tracking-tight text-white"
              >
                Android{" "}
                <span className="text-gradient">Skill Tree</span>
              </motion.h1>
              <motion.p variants={item} className="mt-2 text-sm text-slate-400">
                {isSignUp
                  ? "Создайте аккаунт для отслеживания прогресса"
                  : "Войдите для продолжения"}
              </motion.p>
            </motion.div>

            {error && (
              <motion.div
                key={shakeKey}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 ${
                  shakeKey ? "animate-shaking" : ""
                }`}
                role="alert"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={item}>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-white placeholder-slate-600 outline-none transition-all duration-300 focus:border-blue-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Пароль
                </label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-12 text-white placeholder-slate-600 outline-none transition-all duration-300 focus:border-blue-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-slate-200"
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.button
                variants={item}
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="shine relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 py-3 font-semibold text-white shadow-lg shadow-indigo-900/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-900/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading
                    ? "Загрузка..."
                    : isSignUp
                      ? "Зарегистрироваться"
                      : "Войти"}
                </span>
              </motion.button>
            </form>

            <motion.p variants={item} className="mt-7 text-center text-sm text-slate-400">
              {isSignUp ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="font-medium text-blue-400 underline-offset-4 transition-colors hover:text-blue-300 hover:underline"
              >
                {isSignUp ? "Войти" : "Зарегистрироваться"}
              </button>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
      return "Пользователь не найден";
    case "auth/wrong-password":
      return "Неверный пароль";
    case "auth/email-already-in-use":
      return "Email уже используется";
    case "auth/weak-password":
      return "Пароль должен содержать минимум 6 символов";
    case "auth/invalid-email":
      return "Некорректный email";
    case "auth/too-many-requests":
      return "Слишком много попыток. Попробуйте позже";
    default:
      return "Произошла ошибка. Попробуйте снова";
  }
}