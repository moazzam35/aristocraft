export default function Loading() {
  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* HERO skeleton */}
      <div className="relative w-full min-h-screen md:h-screen overflow-hidden flex flex-col md:flex-row md:items-center bg-[#F4F0E8]">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-16 pt-28 sm:pt-32 pb-10 md:py-0 flex flex-col md:flex-row md:items-center h-full gap-8">
          <div className="flex flex-col items-center md:items-start w-full md:max-w-sm flex-shrink-0">
            <div className="h-4 w-28 rounded-full mb-5 animate-pulse bg-[#E3DDD0]" />
            <div className="h-9 sm:h-11 w-64 sm:w-72 rounded-full mb-3 animate-pulse bg-[#E3DDD0]" />
            <div className="h-9 sm:h-11 w-48 sm:w-56 rounded-full mb-5 animate-pulse bg-[#E3DDD0]" />
            <div className="h-3 w-60 rounded-full mb-2 animate-pulse bg-[#E3DDD0]" />
            <div className="h-3 w-44 rounded-full mb-7 animate-pulse bg-[#E3DDD0]" />
            <div className="flex gap-3">
              <div className="h-11 w-36 rounded-full animate-pulse bg-[#E3DDD0]" />
              <div className="h-11 w-36 rounded-full animate-pulse bg-[#E3DDD0]" />
            </div>
          </div>
          <div className="relative w-full h-[34vh] min-h-[220px] md:h-full md:flex-1 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 animate-pulse bg-[#E3DDD0]" />
          </div>
        </div>
      </div>

      {/* CATEGORIES skeleton */}
      <div className="w-full py-20 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
          <SectionHeaderSkeleton />
          <div className="flex flex-col gap-5 md:gap-6">
            <div className="w-full h-[260px] sm:h-[320px] md:h-[400px] rounded-2xl animate-pulse bg-[#F4F0E8]" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[170px] sm:h-[200px] md:h-[230px] rounded-2xl animate-pulse bg-[#F4F0E8]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED / GRID skeleton */}
      <div className="w-full py-20 sm:py-24 md:py-32 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-2xl animate-pulse bg-[#EFEAE0]" />
                <div className="h-3 w-16 rounded-full mt-4 animate-pulse bg-[#EFEAE0]" />
                <div className="h-4 w-3/4 rounded-full mt-2 animate-pulse bg-[#EFEAE0]" />
                <div className="h-4 w-1/2 rounded-full mt-2 animate-pulse bg-[#EFEAE0]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1C1C1C]">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#fa843e]" />
        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#fa843e]" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#fa843e]" style={{ animationDelay: '300ms' }} />
        <span className="text-xs font-medium text-white ml-1">Loading</span>
      </div>
    </div>
  )
}

function SectionHeaderSkeleton() {
  return (
    <div className="mb-12 md:mb-16 max-w-xl">
      <div className="h-3 w-24 rounded-full mb-4 animate-pulse bg-[#EFEAE0]" />
      <div className="h-9 w-72 rounded-full mb-2 animate-pulse bg-[#EFEAE0]" />
      <div className="h-9 w-56 rounded-full animate-pulse bg-[#EFEAE0]" />
    </div>
  )
}
