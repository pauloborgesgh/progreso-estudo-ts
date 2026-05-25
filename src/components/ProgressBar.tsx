import { memo } from 'react';

interface ProgressBarProps {
  value: number;
  color: string;
}

const ProgressBar = memo(function ProgressBar({ value, color }: ProgressBarProps) {
  return (
    <div className="h-3 rounded-full overflow-hidden backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-700 rounded-full relative`}
        style={{ width: `${value}%` }}
      >
        {value > 0 && (
          <div className="absolute right-0 top-0 w-2 h-full bg-white/50 rounded-r-full" />
        )}
      </div>
    </div>
  );
});

export default ProgressBar;