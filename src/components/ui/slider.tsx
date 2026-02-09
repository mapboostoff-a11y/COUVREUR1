import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {(label || valueDisplay) && (
          <div className="flex justify-between text-xs text-muted-foreground">
            {label && <span>{label}</span>}
            {valueDisplay && <span>{props.value}</span>}
          </div>
        )}
        <input
          type="range"
          className={cn(
            "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";
