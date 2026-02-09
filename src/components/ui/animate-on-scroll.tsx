import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

type AnimationType = 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'slide-left' | 'slide-right' | 'zoom-in' | 'none';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animation === 'none') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else {
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, once, animation]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-in': return 'animate-fade-in';
      case 'slide-up': return 'animate-slide-up';
      case 'slide-down': return 'animate-slide-down';
      case 'slide-left': return 'animate-slide-left';
      case 'slide-right': return 'animate-slide-right';
      case 'scale-in': return 'animate-scale-in';
      case 'zoom-in': return 'animate-zoom-in';
      case 'none': return '';
      default: return 'animate-fade-in';
    }
  };

  if (animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0", // Start invisible
        isVisible && getAnimationClass(),
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  );
};
