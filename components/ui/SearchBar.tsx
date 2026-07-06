"use client";

import { useState, useRef, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
  loading: boolean;
};

function SearchBar({ value, onChange, resultCount, loading }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.length > 0;
  const showBadge = hasValue && !loading;

  return (
    <div className="relative w-full pb-7">
      <div
        className="relative flex items-center gap-3 px-5 transition-all duration-200"
        style={{
          height: "56px",
          borderRadius: "16px",
          background: focused || hasValue ? "#ffffff" : "#F5F2EE",
          border: `1.5px solid ${focused ? "rgba(0,75,71,0.30)" : "#E2DDD6"}`,
          boxShadow: focused ? `0 0 0 4px rgba(0,75,71,0.08)` : "none",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" style={{ color: focused ? "#004B47" : "#B0A89E" }}>
          <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M17 17l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products…"
          aria-label="Search products"
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-[15px] font-light text-[#1C1C1C]"
        />
        <AnimatePresence>
          {showBadge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              className="flex-shrink-0 flex items-center font-medium whitespace-nowrap text-xs px-2.5 h-6.5 rounded-full"
              style={{
                background: resultCount > 0 ? "rgba(0,75,71,0.09)" : "#1C1C1C08",
                color: resultCount > 0 ? "#004B47" : "#9B9088",
              }}
            >
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hasValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex-shrink-0 flex items-center justify-center w-6.5 h-6.5 rounded-full bg-[#EDE9E3] text-[#7A7268] cursor-pointer"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(SearchBar);
