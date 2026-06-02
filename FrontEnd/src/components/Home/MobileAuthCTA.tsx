"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function MobileAuthCTA() {
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-3 left-3 right-3 z-50 sm:hidden"
    >
      <div className="rounded-xl border bg-card shadow-lg p-3 flex items-center justify-between">
        <div className="text-sm font-medium">برای ادامه وارد شوید</div>

        <Button asChild size="sm" className="gap-1">
          <Link href="/login">
            <Lock className="w-4 h-4" />
            ورود
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
