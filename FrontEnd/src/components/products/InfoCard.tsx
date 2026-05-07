import { formatPriceFa } from "@/lib/utils";

export default function InfoCard({ title , count, icon }: {title:string; count:number; icon: () =>  React.ReactNode;
}) {
  return (
    <div className="group rounded-xl border p-2 sm:p-3 flex items-center justify-between gap-3
                    transition-all duration-200
                    hover:shadow-md hover:border-[#00bfa6]/40">

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-[#00bfa6]/10
                        transition-all duration-200
                        group-hover:bg-[#00bfa6]/20 group-hover:scale-110">
          {icon()}
        </div>

        {/* label hidden on very small screens */}
        <span className="hidden xs:block text-xs opacity-60">
         {title}
        </span>
      </div>

      {/* price */}
      <div className="text-sm sm:text-base font-semibold whitespace-nowrap">
        {formatPriceFa(count)} {title=="قیمت" && "تومان" }
      </div>
    </div>
  )
}
