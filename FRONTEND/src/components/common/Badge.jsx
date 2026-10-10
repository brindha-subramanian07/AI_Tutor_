import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  }[size] || 'text-xs px-2.5 py-1 font-medium';

  const variantClasses = {
    default: 'bg-[#F1F3FB] text-[#676282] border border-[#E6E8F6]',
    primary: 'bg-[#F1EDFE] text-[#7C5CFC] border border-[#DCD3FC]',
    secondary: 'bg-[#F5F2FF] text-[#9678FA] border border-[#E5DEFC]',
    accent: 'bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]',
    sage: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    mint: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    rust: 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]',
    rose: 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]',
    amber: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    terracottaFilled: 'bg-[#7C5CFC] text-white shadow-snow-sm',
    lavenderFilled: 'bg-[#7C5CFC] text-white shadow-snow-sm',
    amberFilled: 'bg-[#F59E0B] text-white font-semibold'
  }[variant] || 'bg-[#F1F3FB] text-[#676282] border border-[#E6E8F6]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};
