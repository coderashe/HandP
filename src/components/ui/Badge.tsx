import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'gold' | 'red' | 'green' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'gold',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-amber-50/90 text-[#92400e] border-[#c59b27]/50 shadow-2xs',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80 shadow-2xs',
    green: 'bg-emerald-50 text-[#065f46] border-emerald-300/80 shadow-2xs',
    gray: 'bg-stone-100 text-stone-700 border-stone-200 shadow-2xs',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-xs ${variantStyles} ${className}`}
    >
      {text}
    </span>
  );
};
