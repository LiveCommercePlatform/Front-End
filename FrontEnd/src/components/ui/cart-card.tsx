"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { toPersianDigits } from "@/lib/utils"

type CartCardProps = {
  name: string
  price: number
  qty: number
  image: string
}

export function CartCard({ name, price, qty, image }: CartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackgroundGradient className="rounded-[22px] p-4 sm:p-6 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          {/* تصویر محصول */}
          <div className="w-24 h-24 relative flex-shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="flex-1">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              {toPersianDigits(qty)} × {toPersianDigits(price.toLocaleString())}{" "}
              تومان
            </p>
          </div>

          {/* قیمت کل */}
          <p className="font-bold">
            {toPersianDigits((price * qty).toLocaleString())} تومان
          </p>
        </div>
      </BackgroundGradient>
    </motion.div>
  )
}
