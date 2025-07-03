import React from 'react';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-16 w-16',
};

const BORDERS = {
  sm: 'border-2',
  md: 'border-4',
  lg: 'border-4',
}

interface SpinnerProps {
  size?: keyof typeof SIZES;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full ${SIZES[size]} ${BORDERS[size]} border-blue-500 border-t-transparent ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
