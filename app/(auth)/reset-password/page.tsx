"use client";

import { memo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right";
import CheckCircleIcon from "lucide-react/dist/esm/icons/check-circle";

const ResetPasswordPage = memo(function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid. Please request a new one.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] p-4">
        <div className="w-full max-w-md rounded-[28px] bg-white p-10 text-center shadow-[0_40px_90px_-30px_rgba(0,30,28,0.35)]">
          <h2 className="font-serif text-[1.5rem] text-neutral-900">Invalid reset link</h2>
          <p className="mt-2 text-[0.87rem] text-neutral-500">
            This password reset link is missing or invalid.
          </p>
          <Link
            href="/forgot_password"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-[#004b47] hover:underline"
          >
            <ArrowLeftIcon size={14} />
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF] p-4 sm:p-8">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_40px_90px_-30px_rgba(0,30,28,0.35)] sm:p-10">
        {success ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#004b47]/10">
              <CheckCircleIcon size={30} className="text-[#004b47]" strokeWidth={1.6} />
            </div>
            <h2 className="font-serif text-[1.6rem] text-neutral-900">Password reset</h2>
            <p className="mt-2 text-[0.87rem] text-neutral-500">
              Redirecting you to log in...
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-[1.6rem] tracking-tight text-neutral-900">
              Set a new password
            </h2>
            <p className="mb-7 mt-2 text-[0.87rem] text-neutral-500">
              Choose a new password for your account.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.84rem] text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="new-password"
                  className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="confirm-password"
                  className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                >
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-[#C76F4D] py-3.5 text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-[#A8552F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset password"}
                {!loading && <ArrowRightIcon size={15} strokeWidth={2} />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
});

export default ResetPasswordPage;