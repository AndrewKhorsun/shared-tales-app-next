"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  disabled?: boolean;
}

export function DropdownMenu({ trigger, items, disabled }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="border border-border-soft text-parchment font-mono text-[11px] px-4 py-2 rounded hover:bg-surface/30 transition-colors disabled:opacity-50 flex items-center gap-1"
      >
        {trigger}
        <span className="ml-1 text-[9px]">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 min-w-[140px] bg-elevated border border-border-soft rounded-lg shadow-lg z-50 overflow-hidden">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setOpen(false);
                }
              }}
              disabled={item.disabled}
              className="w-full text-left px-4 py-2 font-mono text-[11px] text-parchment hover:bg-surface/60 transition-colors disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
