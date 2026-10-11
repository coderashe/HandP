import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  darkMode?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  darkMode = false,
  className = '',
}) => {
  const circleDimensions = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size];

  const titleSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const sloganSize = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Monogram circle: Deep Emerald Green with Matte Gold Ring */}
      <div
        className={`${circleDimensions} rounded-full bg-[#064e3b] border-2 border-[#c59b27] flex items-center justify-center font-black tracking-wider shadow-md shadow-[#064e3b]/20 text-white shrink-0`}
      >
        <span className="bg-gradient-to-b from-white via-amber-100 to-[#c59b27] bg-clip-text text-transparent">
          H&P
        </span>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-2">
            <span
              className={`font-black tracking-wider ${titleSize} ${
                darkMode ? 'text-white' : 'text-[#064e3b]'
              }`}
            >
              H & P
            </span>
            <span className="h-4 w-px bg-[#c59b27]" />
            <span
              className={`font-black tracking-wider ${titleSize} ${
                darkMode ? 'text-[#c59b27]' : 'text-[#064e3b]'
              }`}
            >
              SHOES
            </span>
          </div>
          <span
            className={`font-medium tracking-widest uppercase italic mt-1 text-[#b8860b] ${sloganSize}`}
          >
            Harare's Premium Fashion
          </span>
        </div>
      )}
    </div>
  );
};
