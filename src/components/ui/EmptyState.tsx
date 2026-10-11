import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`luxury-card p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto bg-white border border-stone-200 shadow-sm ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#064e3b] mb-4 shadow-2xs">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-[#064e3b] mb-2">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer transition-all duration-200 px-6 py-2.5 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-bold text-sm shadow-md shadow-[#c59b27]/20 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
