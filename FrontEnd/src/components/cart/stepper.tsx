"use client";

import React from "react";

type StepperProps = {
  steps?: string[];
  current?: number;
};

export function Stepper({
  steps = ["سبد خرید", "آدرس", "پرداخت"],
  current = 0,
}: StepperProps) {
  const getStepClass = (done: boolean, active: boolean) => {
    if (done || active) {
      return "bg-primary text-primary-foreground border-none shadow-btn";
    } else {
      return "bg-card text-foreground border border-border shadow-btn";
    }
  };

  return (
    <nav aria-label="progress" className="mb-6">
      <ol className="flex items-center gap-6 w-full justify-center" dir="rtl">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;

          return (
            <li key={i} className="flex items-center gap-4 w-full">
              <div
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm " +
                  getStepClass(done, active)
                }
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm ${
                  active
                    ? "font-semibold text-primary"
                    : "text-foreground dark:text-foreground"
                }`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-[var(--border)] dark:bg-[var(--border)]"></div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
