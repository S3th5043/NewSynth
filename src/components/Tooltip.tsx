"use client";
import { useId, useState } from 'react';

export default function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={id}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={id}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-soft"
        >
          {label}
        </span>
      )}
    </span>
  );
}
