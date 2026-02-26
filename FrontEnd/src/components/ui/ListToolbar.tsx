"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import clsx from "clsx";

export type SelectOption<T extends string | number> = {
  label: string;
  value: T;
};

export type ToolbarFilter<T extends string | number> = {
  key: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
};

export type ToolbarInput = {
  key: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
};

type ListToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  filters?: ToolbarFilter<any>[];
  inputs?: ToolbarInput[]; // ✅ جدید

  sortOptions?: SelectOption<any>[];
  sortValue?: any;
  onSortChange?: (value: any) => void;

  actions?: React.ReactNode;
  className?: string;
};

const ListToolbar: React.FC<ListToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "جستجو...",
  filters = [],
  inputs = [], // ✅ جدید
  sortOptions = [],
  sortValue,
  onSortChange,
  actions,
  className,
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-primary/50 bg-card/95 backdrop-blur shadow-sm",
        "p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            {/* Search */}
            {onSearchChange && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pr-9 text-sm bg-background focus-visible:ring-0"
                />
              </div>
            )}

            {/* Filters (Select) */}
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={String(filter.value)}
                onValueChange={(v) => filter.onChange(v as any)}
              >
                <SelectTrigger className="w-full sm:w-44 text-sm bg-background focus:ring-0">
                  <SelectValue placeholder={filter.placeholder ?? "انتخاب"} />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-lg">
                  {filter.options.map((opt) => (
                    <SelectItem
                      className="justify-end"
                      key={String(opt.value)}
                      value={String(opt.value)}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {/* Inputs (min/max/...) ✅ */}
            {inputs.map((inp) => (
              <Input
                key={inp.key}
                value={inp.value}
                onChange={(e) => inp.onChange(e.target.value)}
                placeholder={inp.placeholder}
                type={inp.type ?? "text"}
                inputMode={inp.inputMode}
                className={clsx(
                  "w-full sm:w-44 text-sm bg-background focus-visible:ring-0",
                  inp.className,
                )}
              />
            ))}

            {/* Sort */}
            {sortOptions.length > 0 && onSortChange && (
              <Select
                value={String(sortValue)}
                onValueChange={(v) => onSortChange(v as any)}
              >
                <SelectTrigger className="w-full sm:w-44 text-sm bg-background focus:ring-0">
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-lg">
                  {sortOptions.map((opt) => (
                    <SelectItem
                      className="justify-end"
                      key={String(opt.value)}
                      value={String(opt.value)}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {actions}
            </div>
          )}
        </div>

        <Separator className="lg:hidden" />
      </div>
    </div>
  );
};

export default ListToolbar;