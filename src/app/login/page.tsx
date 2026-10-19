"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/actions/login";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
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

      await login(userCredential.user.uid, userCredential.user.email);
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
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <motion.div
        key={shakeKey}
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <motion.div
          variants={item}
          className="term-panel overflow-hidden rounded-lg shadow-[0_20px_60px_rgba(26,25,21,0.12)]"
        >
          <div className="flex h-8 items-center gap-1.5 border-b border-slate-700 bg-slate-900/60 px-3.5">
            <span className="font-mono text-[11px] text-slate-500">
              auth
            </span>
          </div>

          <div className="p-8 font-mono sm:p-10">
            <motion.div variants={item} className="mb-7">
              <p className="text-sm text-slate-500">
                <span className="text-blue-600">$</span> login
                <span className="text-slate-600"> --android-skill-tree</span>
              </p>
              <h1 className="mt-3 text-xl font-bold tracking-tight text-white">
                <span className="text-blue-600">{">_"}</span>{" "}
                <span className="text-gradient">android</span>
                <span className="text-slate-600">/</span>skill-tree
              </h1>
              <p className="mt-1.5 text-xs text-slate-500">
                {isSignUp
                  ? "// создайте аккаунт для отслеживания прогресса"
                  : "// войдите для продолжения"}
              </p>
            </motion.div>

            {error && (
              <motion.div
                key={shakeKey}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-5 rounded-md border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-500 ${
                  shakeKey ? "animate-shaking" : ""
                }`}
                role="alert"
              >
                <span className="text-red-400">! </span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={item}>
                <label className="mb-1.5 block text-xs text-slate-500">
                  email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-slate-700 bg-white/[0.03] px-3 py-2.5 font-mono text-sm text-white placeholder-slate-600 outline-none transition-colors duration-200 focus:border-blue-500/60"
                  required
                />
              </motion.div>

              <motion.div variants={item}>
                <label className="mb-1.5 block text-xs text-slate-500">
                  password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-slate-700 bg-white/[0.03] px-3 py-2.5 pr-11 font-mono text-sm text-white placeholder-slate-600 outline-none transition-colors duration-200 focus:border-blue-500/60"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-slate-300"
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.button
                variants={item}
                type="submit"
                disabled={loading}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-3 font-semibold text-[#faf9f5] transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading
                  ? "loading..."
                  : isSignUp
                    ? "зарегистрироваться"
                    : "войти"}
              </motion.button>
            </form>

            <motion.p variants={item} className="mt-7 text-center text-xs text-slate-500">
              {isSignUp ? "// уже есть аккаунт?" : "// нет аккаунта?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="font-medium text-blue-600 underline-offset-4 transition-colors hover:text-blue-500 hover:underline"
              >
                {isSignUp ? "войти" : "зарегистрироваться"}
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
