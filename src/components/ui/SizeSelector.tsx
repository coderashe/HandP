import React from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onChange: (size: string) => void;
  compact?: boolean;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selected,
  onChange,
  compact = false,
}) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {sizes.map((size) => {
        const isSelected = selected === size;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`cursor-pointer transition-all duration-150 font-semibold rounded-md flex items-center justify-center ${
              compact
                ? 'px-2 py-0.5 text-xs min-w-7 h-7'
                : 'px-3 py-1.5 text-sm min-w-10 h-9'
            } ${
              isSelected
                ? 'bg-[#c59b27] text-white font-bold shadow-xs ring-1 ring-[#c59b27]'
                : 'bg-white text-stone-700 border border-stone-300 hover:border-[#064e3b] hover:text-[#064e3b]'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
};
