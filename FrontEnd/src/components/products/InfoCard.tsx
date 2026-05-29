import { formatPriceFa } from "@/lib/utils";

export default function InfoCard({ 
  title, 
  count, 
  icon 
}: { 
  title: string; 
  count: number; 
  icon: () => React.ReactNode; 
}) {
  return (
    <div className="group rounded-xl border p-2 sm:p-3 flex items-center justify-between gap-2
                    transition-all duration-200 min-w-0
                    hover:shadow-md hover:border-[#00bfa6]/40">

      {/* بخش سمت راست (آیکون و عنوان) */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-[#00bfa6]/10
                        transition-all duration-200 shrink-0
                        group-hover:bg-[#00bfa6]/20 group-hover:scale-110">
          {icon()}
        </div>

        {title != "قیمت" &&  <span className="hidden xs:block text-xs opacity-60 truncate">
          {title}
        </span>}
      </div>

      {/* بخش قیمت / عدد - با سایز منعطف */}
      <div className="text-right min-w-0 flex flex-row-reverse items-center gap-1">
        {title === "قیمت" && (
          <span className="text-[10px] sm:text-xs opacity-70 shrink-0">تومان</span>
        )}
        
        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis
                        /* سایز فونت بین 12px تا 16px متغیر بر اساس عرض والد */
                        text-[clamp(12px,3vw,16px)]">
          {formatPriceFa(count)}
        </div>
      </div>
    </div>
  )
}
