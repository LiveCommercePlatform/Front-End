"use client";

import React from "react";
import clsx from "clsx";

type StepperProps = {
  steps: string[];
  current: number;
  onChange?: (step: number) => void;
};

export function Stepper({ steps, current, onChange }: StepperProps) {
  return (
    <nav aria-label="progress" className="mb-8">
      <ol
        className="flex items-center justify-center w-full gap-6"
        dir="rtl"
      >
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = onChange && i <= current + 1;

          return (
            <li
              key={label}
              className="flex items-center gap-4 w-full cursor-pointer select-none"
              onClick={() => clickable && onChange?.(i)}
            >
              {/* Circle */}
              <div
                className={clsx(
                  "relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  done || active
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-card border border-border text-foreground",
                  clickable && "hover:scale-110"
                )}
              >
                {/* ripple animation */}
                {active && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                )}

                <span className="relative z-10">
                  {done ? "✓" : i + 1}
                </span>
              </div>

              {/* Label */}
              <span
                className={clsx(
                  "text-sm transition-colors duration-300",
                  active
                    ? "font-semibold text-primary"
                    : done
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>

              {/* Line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-[3px] bg-border rounded overflow-hidden">
                  <div
                    className={clsx(
                      "h-full bg-primary transition-all duration-500",
                      done ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
