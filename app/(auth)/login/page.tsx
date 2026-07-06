"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";
import { useAuthStore } from "@/hooks/store/auth-store";

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type Tab = "login" | "signup";

/* ------------------------------------------------------------------ */
/*  RoomScene — flat 2D illustrated furniture scene (signature visual) */
/* ------------------------------------------------------------------ */

function RoomScene() {
  return (
    <svg
      viewBox="0 0 430 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[430px]"
    >
      {/* floor line */}
      <line x1="20" y1="300" x2="410" y2="300" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {/* rug */}
      <ellipse cx="215" cy="305" rx="160" ry="22" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="215" cy="305" rx="160" ry="22" stroke="rgba(255,255,255,0.16)" strokeWidth="1" fill="none" />

      {/* plant */}
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="40" y="240" width="46" height="50" rx="6" fill="#C76F4D" />
        <rect x="40" y="240" width="46" height="50" rx="6" stroke="rgba(0,0,0,0.08)" />
        <path d="M63 240c-10-18-34-22-40-40 18 2 34 16 40 40z" fill="#7FA88A" />
        <path d="M63 240c10-22 36-26 42-46-20 2-38 18-42 46z" fill="#6E9678" />
        <path d="M63 240c-2-26 14-40 10-58-14 8-22 32-10 58z" fill="#8FB897" />
      </motion.g>

      {/* armchair */}
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      >
        <rect x="150" y="160" width="130" height="100" rx="18" fill="#F4EDE0" />
        <rect x="140" y="230" width="150" height="44" rx="14" fill="#EADFCB" />
        <rect x="128" y="200" width="26" height="74" rx="13" fill="#E3D6BC" />
        <rect x="276" y="200" width="26" height="74" rx="13" fill="#E3D6BC" />
        <line x1="215" y1="232" x2="215" y2="270" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        <rect x="148" y="272" width="8" height="26" rx="2" fill="#3a2a1c" />
        <rect x="274" y="272" width="8" height="26" rx="2" fill="#3a2a1c" />
      </motion.g>

      {/* floor lamp */}
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}
      >
        <line x1="356" y1="298" x2="356" y2="150" stroke="#C76F4D" strokeWidth="3" strokeLinecap="round" />
        <path d="M330 150 L382 150 L372 110 L340 110 Z" fill="#F0C76B" />
        <ellipse cx="356" cy="298" rx="20" ry="5" fill="rgba(0,0,0,0.18)" />
      </motion.g>

      {/* side table + cup */}
      <g>
        <rect x="300" y="260" width="56" height="10" rx="3" fill="#A8552F" />
        <rect x="320" y="270" width="6" height="28" fill="#A8552F" />
        <rect x="305" y="298" width="46" height="6" rx="2" fill="#3a2a1c" />
        <ellipse cx="316" cy="252" rx="10" ry="6" fill="#FAF6EF" />
        <rect x="306" y="252" width="20" height="8" fill="#FAF6EF" />
      </g>

      {/* wall art */}
      <rect
        x="90"
        y="80"
        width="60"
        height="80"
        rx="4"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <circle cx="120" cy="112" r="14" fill="rgba(199,111,77,0.55)" />
      <line x1="100" y1="142" x2="140" y2="142" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  SocialButtons — Google / Apple continue buttons                    */
/* ------------------------------------------------------------------ */

function SocialButtons() {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-[0.84rem] font-medium text-neutral-800 transition-colors duration-200 hover:border-neutral-400 hover:bg-[#EFE8DA]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="#EA4335"
            d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.32 0-6.04-2.76-6.04-6.16S8.68 6.04 12 6.04c1.9 0 3.16.8 3.88 1.48l2.64-2.56C16.92 3.36 14.68 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c5.52 0 9.12-3.88 9.12-9.32 0-.6-.06-1.08-.16-1.56H12z"
          />
        </svg>
        Google
      </button>
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-[0.84rem] font-medium text-neutral-800 transition-colors duration-200 hover:border-neutral-400 hover:bg-[#EFE8DA]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="#1F1F1D"
            d="M16.36 1.5c.12 1.02-.3 2.02-.93 2.78-.66.78-1.74 1.38-2.76 1.3-.14-1 .36-2.04 1-2.74.7-.78 1.86-1.34 2.69-1.34zm3.86 16.42c-.5 1.1-.74 1.6-1.38 2.58-.9 1.36-2.16 3.06-3.72 3.08-1.4.02-1.76-.9-3.66-.9-1.9 0-2.3.88-3.7.92-1.56.06-2.74-1.46-3.66-2.82-2-2.96-3.52-8.36-1.46-12 1-1.8 2.8-2.94 4.76-2.96 1.46-.02 2.84.98 3.74.98.88 0 2.56-1.22 4.32-1.04.74.04 2.8.3 4.12 2.24-.1.06-2.46 1.44-2.44 4.3.04 3.44 3.02 4.58 3.06 4.6z"
          />
        </svg>
        Apple
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AuthPage — split-screen login / signup                             */
/* ------------------------------------------------------------------ */

const AuthPage = memo(function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [tab, setTab] = useState<Tab>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!data.success) {
        setLoginError(data.message || "Login failed.");
        setLoginLoading(false);
        return;
      }

      setUser(data.user);

      if (data.user.role === "ADMIN" || data.user.role === "STAFF") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
      setLoginLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });

      const data = await res.json();

      if (!data.success) {
        setSignupError(data.message || "Signup failed.");
        setSignupLoading(false);
        return;
      }

      setUser(data.user);
      router.push("/");
    } catch (err) {
      setSignupError("Something went wrong. Please try again.");
      setSignupLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-[#FAF6EF] shadow-[0_40px_90px_-30px_rgba(0,30,28,0.35)] md:min-h-[680px] md:grid-cols-[1.05fr_1fr]">
        {/* ---------------- LEFT: illustrated stage ---------------- */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#004b47] p-11 md:flex">
          {/* dotted texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          <Link href="/" className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] border-white/55">
              <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px]">
                <path
                  d="M4 10v8M20 10v8M4 14h16M6 10c0-2.5 1.5-5 6-5s6 2.5 6 5"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="font-serif text-[1.15rem] tracking-[0.06em] text-white">Aristocraft</span>
          </Link>

          <div className="relative z-10 my-2 flex flex-1 items-center justify-center">
            <RoomScene />
          </div>

          <div className="relative z-10 max-w-[380px]">
            <p className="mb-3.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/60">
              Welcome home
            </p>
            <h1 className="font-serif text-[1.9rem] leading-[1.25] tracking-tight text-white">
              Furniture chosen
              <br />
              like it matters.
            </h1>
            <p className="mt-3.5 text-[0.92rem] leading-relaxed text-white/70">
              Sign in to track orders, save favourites, and pick up your room plans where you left off.
            </p>
          </div>
        </div>

        {/* ---------------- RIGHT: form panel ---------------- */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 md:px-14">
          <div className="mx-auto w-full max-w-[380px]">
            {/* Tab switcher */}
            <div className="relative mb-9 flex gap-1 rounded-full bg-[#EFE8DA] p-1">
              <motion.div
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#004b47]"
                animate={{ x: tab === "signup" ? "100%" : "0%" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`relative z-10 flex-1 rounded-full py-2.5 text-[0.84rem] font-medium transition-colors duration-200 ${
                  tab === "login" ? "text-white" : "text-neutral-500"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`relative z-10 flex-1 rounded-full py-2.5 text-[0.84rem] font-medium transition-colors duration-200 ${
                  tab === "signup" ? "text-white" : "text-neutral-500"
                }`}
              >
                Sign up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-serif text-[1.7rem] tracking-tight text-neutral-900">Welcome back</h2>
                  <p className="mb-7 mt-2 text-[0.87rem] text-neutral-500">
                    Log in to continue to your account.
                  </p>

                  {loginError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.84rem] text-red-700">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[7px]">
                      <label
                        htmlFor="login-email"
                        className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                      >
                        Email
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                      />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                      <label
                        htmlFor="login-password"
                        className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                      >
                        Password
                      </label>
                      <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[0.82rem]">
                      <label className="flex items-center gap-2 text-neutral-500">
                        <input type="checkbox" className="h-3.5 w-3.5 accent-[#004b47]" />
                        Remember me
                      </label>
                      <Link href="/forgot_password" className="font-medium text-[#004b47] hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-[#C76F4D] py-3.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-[#A8552F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loginLoading ? "Logging in..." : "Log in"}
                      {!loginLoading && <ArrowRightIcon size={15} strokeWidth={2} />}
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-3 text-[0.78rem] text-neutral-500">
                    <span className="h-px flex-1 bg-neutral-200" />
                    or continue with
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <SocialButtons />

                  <p className="mt-7 text-center text-[0.85rem] text-neutral-500">
                    New to Aristocraft?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signup")}
                      className="font-semibold text-[#004b47] hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-serif text-[1.7rem] tracking-tight text-neutral-900">
                    Create your account
                  </h2>
                  <p className="mb-7 mt-2 text-[0.87rem] text-neutral-500">
                    Join to save pieces, track orders, and more.
                  </p>

                  {signupError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.84rem] text-red-700">
                      {signupError}
                    </div>
                  )}

                  <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[7px]">
                      <label
                        htmlFor="signup-name"
                        className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                      >
                        Full name
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Jordan Avery"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                      />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                      <label
                        htmlFor="signup-email"
                        className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                      >
                        Email
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                      />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                      <label
                        htmlFor="signup-password"
                        className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                      >
                        Password
                      </label>
                      <input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={signupLoading}
                      className="mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-[#C76F4D] py-3.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-[#A8552F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {signupLoading ? "Creating account..." : "Create account"}
                      {!signupLoading && <ArrowRightIcon size={15} strokeWidth={2} />}
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-3 text-[0.78rem] text-neutral-500">
                    <span className="h-px flex-1 bg-neutral-200" />
                    or continue with
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <SocialButtons />

                  <p className="mt-7 text-center text-[0.85rem] text-neutral-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="font-semibold text-[#004b47] hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AuthPage;