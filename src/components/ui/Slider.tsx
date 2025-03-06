import React, { useCallback } from 'react';
import { cn, clamp } from '../../lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (values: number[]) => void;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  max = 10,
  step = 1,
  className
}: SliderProps) {
  const [currentValue] = value;
  const percentage = (currentValue / max) * 100;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onValueChange([clamp(newValue, 0, max)]);
  }, [max, onValueChange]);

  const getPainDescription = (value: number): string => {
    if (value === 0) return 'No pain';
    if (value <= 3) return 'Mild pain';
    if (value <= 6) return 'Moderate pain';
    if (value <= 8) return 'Severe pain';
    return 'Worst possible pain';
  };

  const valueText = `${getPainDescription(currentValue)} - Level ${currentValue} out of ${max}`;

  return (
    <div 
      className={cn('relative w-full', className)}
      role="group"
      aria-label="Pain intensity slider"
    >
      <label id="pain-slider-label" className="sr-only">
        Pain intensity level
      </label>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-indigo-600 rounded-full"
          style={{ width: `${percentage}%` }}
          role="presentation"
        />
      </div>
      <input
        type="range"
        value={currentValue}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        min="0"
        max={String(max)}
        step={String(step)}
        aria-labelledby="pain-slider-label"
        aria-valuetext={valueText}
      />
      <div className="flex justify-between mt-2">
        <div className="text-xs text-gray-500">No pain (0)</div>
        <div className="text-sm font-medium text-indigo-600">
          {getPainDescription(currentValue)}
        </div>
        <div className="text-xs text-gray-500">Worst pain ({max})</div>
      </div>
    </div>
  );
}