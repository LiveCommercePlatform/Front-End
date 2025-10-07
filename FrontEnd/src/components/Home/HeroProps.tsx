"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaUser, FaStore, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";

type HeroProps = {
  liveThumbnail: string;
  viewersCount: number;
  sellersCount: number;
  ctaUrl: string;
};

export default function HeroSection({
  liveThumbnail,
  viewersCount,
  sellersCount,
  ctaUrl,
}: HeroProps) {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => setScrollY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] bg-gray-100 flex items-center justify-center overflow-hidden">
      <motion.img
        src={liveThumbnail}
        alt="Live stream thumbnail"
        className="absolute w-full h-full object-cover brightness-75"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />

      <motion.div
        className="absolute top-4 left-4 bg-black/60 text-white flex items-center gap-2 px-3 py-1 rounded-lg shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaEye />
        <span className="font-semibold">{viewersCount}</span>
      </motion.div>

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          مشاهده و خرید محصولات به صورت زنده و آنی
        </motion.h1>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white mb-6"
            onClick={() => (window.location.href = ctaUrl)}
          >
            مشاهده پخش زنده
          </Button>
        </motion.div>

        <motion.div
          className="flex justify-center gap-6 text-white mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <FaStore />
            <span>{sellersCount} فروش آنلاین تا به اکنون</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
