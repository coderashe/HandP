import React from 'react';
import { formatUSD, formatZIG } from '../../utils/currency.ts';

interface PriceDisplayProps {
  priceUSD: number;
  originalPriceUSD?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showZIG?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceUSD,
  originalPriceUSD,
  size = 'md',
  className = '',
  showZIG = true,
}) => {
  const usdClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-3xl font-black tracking-tight',
  }[size];

  const origClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  const zigClasses = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm font-medium',
  }[size];

  return (
    <div className={`flex flex-col leading-tight ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`text-[#064e3b] ${usdClasses}`}>{formatUSD(priceUSD)}</span>
        {originalPriceUSD && originalPriceUSD > priceUSD && (
          <span className={`line-through text-stone-400 font-normal ${origClasses}`}>
            {formatUSD(originalPriceUSD)}
          </span>
        )}
      </div>
      {showZIG && (
        <span className={`text-[#b8860b] font-medium tracking-wide mt-0.5 ${zigClasses}`}>
          ≈ {formatZIG(priceUSD)}
        </span>
      )}
    </div>
  );
};
