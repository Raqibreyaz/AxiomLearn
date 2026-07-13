/* Spec §4 — Search Bar
   Paper bg, 1px line border, radius-md, height 48px, max-w 640px centered.
   Focus: border → axiom. Placeholder must reference varied subjects. */

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  initialValue?: string;
  className?: string;
}

const SearchBar = ({ onSearch, initialValue = "", className = "" }: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch?.(value);
  };

  return (
    <div
      className={`
        flex items-center gap-[10px] bg-paper border border-line rounded-md
        h-12 px-4 max-w-[640px] mx-auto
        focus-within:border-axiom transition-colors duration-[120ms]
        ${className}
      `}
      id="search-bar"
    >
      <Search size={16} className="text-t3 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search 'color theory', 'SQL joins', 'Spanish verbs'…"
        className="flex-1 bg-transparent font-body text-[14.5px] text-ink placeholder:text-t3 focus:outline-none h-full"
        id="search-input"
        aria-label="Search courses"
      />
      {/* ⌘K hint — desktop only */}
      <span className="hidden md:inline font-mono text-[11px] text-t3 border border-line px-[7px] py-[3px] rounded-sm select-none">
        ⌘K
      </span>
    </div>
  );
};

export default SearchBar;
