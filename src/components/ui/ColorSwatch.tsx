import React from 'react';

interface ColorSwatchProps {
  colors: string[];
  colorHexMap: Record<string, string>;
  selected: string;
  onChange: (color: string) => void;
  size?: 'sm' | 'md';
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colors,
  colorHexMap,
  selected,
  onChange,
  size = 'md',
}) => {
  const dotDimensions = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {colors.map((colorName) => {
        const hex = colorHexMap[colorName] || '#333333';
        const isSelected = selected === colorName;

        return (
          <button
            key={colorName}
            type="button"
            title={colorName}
            onClick={() => onChange(colorName)}
            className={`group relative rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center p-0.5 ${
              isSelected
                ? 'ring-2 ring-[#c59b27] ring-offset-2 ring-offset-white scale-110'
                : 'hover:scale-105 opacity-80 hover:opacity-100 ring-1 ring-stone-300'
            }`}
          >
            <span
              className={`${dotDimensions} rounded-full block border border-black/10 shadow-inner`}
              style={{ backgroundColor: hex }}
            />
            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-stone-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 z-20 shadow-md">
              {colorName}
            </span>
          </button>
        );
      })}
    </div>
  );
};
