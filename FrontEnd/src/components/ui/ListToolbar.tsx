"use client";

import React from "react";

export type SelectOption<T extends string | number> = {
  label: string;
  value: T;
};

export type ToolbarFilter<T extends string | number> = {
  key: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

type ListToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  filters?: ToolbarFilter<any>[];

  sortOptions?: SelectOption<any>[];
  sortValue?: any;
  onSortChange?: (value: any) => void;

  actions?: React.ReactNode;
};

const ListToolbar: React.FC<ListToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "جستجو...",
  filters = [],
  sortOptions = [],
  sortValue,
  onSortChange,
  actions,
}) => {
  return (
    <div className="border rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-2 md:gap-3 md:items-center md:justify-between">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {onSearchChange && (
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs md:text-sm"
          />
        )}

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) =>
              filter.onChange(e.target.value as any)
            }
            className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs md:text-sm"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {sortOptions.length > 0 && onSortChange && (
          <select
            value={sortValue}
            onChange={(e) =>
              onSortChange(e.target.value as any)
            }
            className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs md:text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default ListToolbar;
