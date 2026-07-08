"use client";

import { useEffect, useState } from "react";
import ShieldIcon from "lucide-react/dist/esm/icons/shield";
import ShieldBanIcon from "lucide-react/dist/esm/icons/shield-ban";
import UserCogIcon from "lucide-react/dist/esm/icons/user-cog";
import RefreshCwIcon from "lucide-react/dist/esm/icons/refresh-cw";
import StarIcon from "lucide-react/dist/esm/icons/star";

const roleColors = {
  ADMIN: "bg-[#004b47]/8 text-[#004b47] border-[#004b47]/20",
  STAFF: "bg-blue-50 text-blue-700 border-blue-200",
  CUSTOMER: "bg-neutral-50 text-neutral-600 border-neutral-200",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const [meRes, usersRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/users"),
        ]);
        const me = await meRes.json();
        const data = await usersRes.json();
        if (me.success) setCurrentUserRole(me.user.role);
        if (data.success) setUsers(data.users);
        else setError(data.message || "Failed to load users.");
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function updateRole(userId, newRole, userName) {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { success: false, message: text }; }
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: data.user.role } : u))
        );
      } else {
        alert("Error: " + (data.message || "Failed to update role.") + " (Status: " + res.status + ")");
      }
    } catch (err) {
      alert("Request failed: " + (err?.message || err));
    } finally {
      setUpdatingId(null);
    }
  }

  const isAdmin = currentUserRole === "ADMIN";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-md bg-[#004b47]/10" />
          <div className="h-4 w-44 animate-pulse rounded-md bg-[#004b47]/5" />
        </div>
        <div className="overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse border-b border-[#004b47]/5 bg-white last:border-0"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
        <div
          role="alert"
          className="rounded-[12px] border border-[#C76F4D]/30 bg-[#C76F4D]/5 px-5 py-4 font-sans text-sm text-[#8f4a30]"
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C76F4D]">
              Aristocraft
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] lg:text-4xl">
              Users
            </h1>
            <p className="mt-2 font-sans text-sm text-neutral-500">
              {users.length} registered user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 rounded-full border border-[#004b47]/20 bg-[#004b47]/5 px-4 py-2">
              <UserCogIcon size={14} className="text-[#004b47]" strokeWidth={1.5} />
              <span className="font-sans text-xs font-semibold text-[#004b47]">
                Admin — Full Access
              </span>
            </div>
          )}
        </div>

        {users.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[14px] border border-[#004b47]/10 bg-white py-20 text-center shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
            <p className="font-sans text-sm text-neutral-500">No registered users yet.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#004b47]/10 bg-[#FAF6EF]/60">
                  <tr>
                    <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Name
                    </th>
                    <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Email
                    </th>
                    <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Phone
                    </th>
                    <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Role
                    </th>
                    <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Joined
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isUpdating = updatingId === user.id;
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-[#004b47]/5 transition-colors last:border-0 hover:bg-[#FAF6EF]/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004b47]/8 text-[11px] font-semibold text-[#004b47]">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-sans text-sm font-semibold text-[#1a1a1a]">
                              {user.name}
                              {user.role === "ADMIN" && (
                                <StarIcon
                                  size={12}
                                  className="ml-1.5 inline -mt-0.5 text-amber-500"
                                  fill="currentColor"
                                  strokeWidth={1.5}
                                />
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-sans text-sm text-neutral-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 font-sans text-sm text-neutral-500">
                          {user.phone || "\u2014"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide ${
                              roleColors[user.role] ||
                              "bg-neutral-50 text-neutral-600 border-neutral-200"
                            }`}
                          >
                            {user.role === "ADMIN" && <ShieldIcon size={11} strokeWidth={2.5} />}
                            {user.role === "STAFF" && <ShieldIcon size={11} strokeWidth={2.5} />}
                            {user.role === "CUSTOMER" && null}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans text-sm text-neutral-500">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4">
                            {user.role === "ADMIN" ? (
                              <span className="font-sans text-xs text-neutral-400 italic">
                                Owner
                              </span>
                            ) : (
                              <div className="flex gap-1.5">
                                {user.role === "CUSTOMER" && (
                                  <button
                                    onClick={() =>
                                      updateRole(user.id, "STAFF", user.name)
                                    }
                                    disabled={isUpdating}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                                  >
                                    {isUpdating ? (
                                      <RefreshCwIcon size={10} className="animate-spin" />
                                    ) : (
                                      <ShieldIcon size={10} strokeWidth={2.5} />
                                    )}
                                    Promote to Staff
                                  </button>
                                )}
                                {user.role === "STAFF" && (
                                  <button
                                    onClick={() =>
                                      updateRole(user.id, "CUSTOMER", user.name)
                                    }
                                    disabled={isUpdating}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
                                  >
                                    {isUpdating ? (
                                      <RefreshCwIcon size={10} className="animate-spin" />
                                    ) : (
                                      <ShieldBanIcon size={10} strokeWidth={2.5} />
                                    )}
                                    Demote
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
