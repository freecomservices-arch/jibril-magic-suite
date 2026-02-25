import React from 'react';

interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COLORS = [
  'bg-primary/20 text-primary',
  'bg-accent/20 text-accent',
  'bg-info/20 text-info',
  'bg-warning/20 text-warning',
  'bg-success/20 text-success',
  'bg-destructive/20 text-destructive',
];

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

const AvatarInitials: React.FC<AvatarInitialsProps> = ({ name, size = 'md', className = '' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;

  return (
    <div className={`flex items-center justify-center rounded-full font-heading font-semibold ${sizeClasses[size]} ${COLORS[colorIndex]} ${className}`}>
      {initials}
    </div>
  );
};

export default AvatarInitials;
