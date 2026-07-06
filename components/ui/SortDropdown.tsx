// components/ui/SortDropdown.tsx
"use client";

import { memo, useCallback } from "react";

export type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A to Z",
};

type SortDropdownProps = {
  sort: SortOption;
  setSort: (s: SortOption) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

function SortDropdown({ sort, setSort, open, setOpen }: SortDropdownProps) {
  const handleSelect = useCallback(
    (option: SortOption) => {
      setSort(option);
      setOpen(false);
    },
    [setSort, setOpen]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C]"
      >
        {SORT_LABELS[sort]}
        <svg
          width="11"
          height="11"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="#1C1C1C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-20 rounded-xl overflow-hidden min-w-[200px] origin-top-right animate-dropdown-in"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #1C1C1C14",
              boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            }}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-3 text-sm transition-colors duration-150 hover:bg-[#F8F5F0]"
                style={{
                  color: option === sort ? "#fa843e" : "#1C1C1C",
                  fontWeight: option === sort ? 500 : 400,
                  backgroundColor: option === sort ? "#F8F5F0" : "transparent",
                }}
              >
                {SORT_LABELS[option]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default memo(SortDropdown);
