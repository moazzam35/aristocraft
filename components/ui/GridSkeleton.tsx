// components/ui/GridSkeleton.tsx
import { memo } from "react";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-2xl animate-pulse bg-[#F4F0E8]" />
          <div className="h-3 w-16 rounded-full mt-4 animate-pulse bg-[#F0EDE5]" />
          <div className="h-4 w-3/4 rounded-full mt-2 animate-pulse bg-[#F0EDE5]" />
          <div className="h-4 w-1/2 rounded-full mt-2 animate-pulse bg-[#F0EDE5]" />
        </div>
      ))}
    </div>
  );
}

export default memo(GridSkeleton);
