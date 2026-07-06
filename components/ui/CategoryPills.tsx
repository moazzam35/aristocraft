// components/ui/CategoryPills.tsx
"use client";

import { memo, useMemo } from "react";

export const CATEGORY_LABELS: Record<string, string> = {
  sofa: "Sofas",
  chair: "Chairs",
  bed: "Beds",
  dining: "Dining Tables",
  kitchen: "Kitchen",
  lighting: "Lighting",
};

type CategoryPillsProps = {
  active: string;
  onChange: (cat: string) => void;
};

const ALL_CATEGORIES = [
  { id: "", label: "All" },
  ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
];

function CategoryPills({ active, onChange }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat.id
              ? "bg-[#004B47] text-white"
              : "bg-[#F4F0E8] text-[#1C1C1C99]"
          }`}
          style={{ letterSpacing: "0.01em" }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default memo(CategoryPills);
