"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserIcon2 from "lucide-react/dist/esm/icons/user";
import MailIcon from "lucide-react/dist/esm/icons/mail";
import PhoneIcon from "lucide-react/dist/esm/icons/phone";
import CalendarIcon from "lucide-react/dist/esm/icons/calendar";
import PackageIcon from "lucide-react/dist/esm/icons/package";
import LogOutIcon from "lucide-react/dist/esm/icons/log-out";
import PencilIcon from "lucide-react/dist/esm/icons/pencil";
import { useAuthStore } from "@/hooks/store/auth-store";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, hasFetched, fetchUser, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (hasFetched && !isLoading && !user) {
      router.push("/login");
    }
  }, [hasFetched, isLoading, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!data.success) {
        setSaveError(data.message || "Failed to update profile.");
        setSaving(false);
        return;
      }

      useAuthStore.getState().setUser(data.user);
      setSaveSuccess(true);
      setIsEditing(false);
      setSaving(false);
    } catch (err) {
      setSaveError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (isLoading || !hasFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6EF]">
        <p className="text-[0.9rem] text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-4 pb-16 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-[1.9rem] tracking-tight text-neutral-900">My Account</h1>
        <p className="mt-1 text-[0.9rem] text-neutral-500">
          View and manage your account details.
        </p>

        <div className="mt-8 overflow-hidden rounded-[24px] bg-white shadow-[0_20px_50px_-25px_rgba(0,30,28,0.25)]">
          {/* Profile header */}
          <div className="flex items-center justify-between gap-4 border-b border-neutral-100 bg-[#004b47] p-7 sm:p-9">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white">
                <UserIcon2 size={28} strokeWidth={1.6} />
              </div>
              <div>
                <h2 className="font-serif text-[1.4rem] text-white">{user.name}</h2>
                <p className="text-[0.85rem] text-white/70">{user.email}</p>
              </div>
            </div>
            {(user.role === "ADMIN" || user.role === "STAFF") && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-wide text-white">
                {user.role === "ADMIN" ? "Admin" : "Staff"}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-7 sm:p-9">
            {saveSuccess && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[0.84rem] text-green-700">
                Profile updated successfully.
              </div>
            )}
            {saveError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.84rem] text-red-700">
                {saveError}
              </div>
            )}

            {!isEditing ? (
              <>
                <div className="flex flex-col gap-5">
                  <DetailRow icon={UserIcon2} label="Full name" value={user.name} />
                  <DetailRow icon={MailIcon} label="Email" value={user.email} />
                  <DetailRow icon={PhoneIcon} label="Phone" value={user.phone || "Not provided"} />
                  <DetailRow icon={CalendarIcon} label="Member since" value={joinedDate} />
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-7 flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-2.5 text-[0.85rem] font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-[#EFE8DA]"
                >
                  <PencilIcon size={14} strokeWidth={2} />
                  Edit profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-[7px]">
                  <label
                    htmlFor="account-name"
                    className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                  >
                    Full name
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[0.92rem] text-neutral-900 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                  />
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label
                    htmlFor="account-phone"
                    className="text-[0.76rem] font-medium uppercase tracking-wide text-neutral-900"
                  >
                    Phone
                  </label>
                  <input
                    id="account-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Not provided"
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[0.92rem] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow duration-200 focus:border-[#004b47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.12)]"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#C76F4D] px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-colors hover:bg-[#A8552F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                      setPhone(user.phone || "");
                      setSaveError("");
                    }}
                    className="rounded-xl border border-neutral-200 px-5 py-2.5 text-[0.85rem] font-medium text-neutral-700 transition-colors hover:bg-[#EFE8DA]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_12px_30px_-20px_rgba(0,30,28,0.25)] transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(0,30,28,0.35)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#004b47]/10 text-[#004b47]">
              <PackageIcon size={20} strokeWidth={1.6} />
            </div>
            <div>
              <p className="text-[0.9rem] font-semibold text-neutral-900">My Orders</p>
              <p className="text-[0.78rem] text-neutral-500">Track and view your past orders</p>
            </div>
          </Link>

          {(user.role === "ADMIN" || user.role === "STAFF") && (
            <Link
              href="/dashboard"
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_12px_30px_-20px_rgba(0,30,28,0.25)] transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(0,30,28,0.35)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#004b47]/10 text-[#004b47]">
                <UserIcon2 size={20} strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-[0.9rem] font-semibold text-neutral-900">
                  {user.role === "ADMIN" ? "Admin" : "Staff"} Dashboard
                </p>
                <p className="text-[0.78rem] text-neutral-500">Manage products, orders, and more</p>
              </div>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 text-[0.85rem] font-medium text-red-600 transition-colors hover:text-red-700"
        >
          <LogOutIcon size={15} strokeWidth={2} />
          Log out
        </button>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserIcon2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFE8DA] text-[#004b47]">
        <Icon size={17} strokeWidth={1.6} />
      </div>
      <div>
        <p className="text-[0.74rem] uppercase tracking-wide text-neutral-400">{label}</p>
        <p className="text-[0.92rem] font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  );
}