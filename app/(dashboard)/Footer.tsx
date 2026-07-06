import { memo } from "react";

function Footer() {
  return (
    <footer className="border-t border-[#004b47]/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-8 sm:px-6 lg:px-8">
        <span className="font-serif text-base font-semibold tracking-tight text-[#004b47]">
          Aristocraft
        </span>
        <p className="font-sans text-xs text-[#004b47]/40">
          &copy; {new Date().getFullYear()} Aristocraft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default memo(Footer);
