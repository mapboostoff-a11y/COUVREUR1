import React from 'react';
import { SectionSettingsSchema } from '../../types/schema';
import { z } from 'zod';
import { cn } from '../../lib/utils';
import { AnimateOnScroll } from '../ui/animate-on-scroll';

type Settings = z.infer<typeof SectionSettingsSchema>;

interface SectionWrapperProps {
  settings: Settings;
  children: React.ReactNode;
  id?: string;
  toolbar?: React.ReactNode;
}

const paddingTopMap: Record<string, string> = {
  none: 'pt-0',
  sm: 'pt-8 md:pt-12',
  md: 'pt-12 md:pt-20',
  lg: 'pt-16 md:pt-32',
  xl: 'pt-20 md:pt-40',
};

const paddingBottomMap: Record<string, string> = {
  none: 'pb-0',
  sm: 'pb-8 md:pb-12',
  md: 'pb-12 md:pb-20',
  lg: 'pb-16 md:pb-32',
  xl: 'pb-20 md:pb-40',
};

const bgMap = {
  white: 'bg-background text-foreground',
  gray: 'bg-muted/30 text-foreground',
  primary: 'bg-primary text-primary-foreground',
  dark: 'bg-secondary text-secondary-foreground',
};

const shadowMap = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-xl z-10',
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ settings, children, id, toolbar }) => {
  if (!settings.visible && !toolbar) return null; // Keep visible if editing (has toolbar)

  const isPreset = (val: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(val);
  const isColorPreset = (val: string) => ['white', 'gray', 'primary', 'dark'].includes(val);

  const style = {
    ...(!isPreset(settings.paddingTop) ? { paddingTop: settings.paddingTop } : {}),
    ...(!isPreset(settings.paddingBottom) ? { paddingBottom: settings.paddingBottom } : {}),
    ...(!isColorPreset(settings.backgroundColor) ? { backgroundColor: settings.backgroundColor } : {}),
  };

  return (
    <section 
      id={id}
      className={cn(
        isPreset(settings.paddingTop) ? paddingTopMap[settings.paddingTop] : '',
        isPreset(settings.paddingBottom) ? paddingBottomMap[settings.paddingBottom] : '',
        isColorPreset(settings.backgroundColor) ? bgMap[settings.backgroundColor as keyof typeof bgMap] : '',
        settings.border ? "border-y border-border" : "",
        settings.shadow ? shadowMap[settings.shadow as keyof typeof shadowMap] : "",
        "relative",
        !toolbar && "overflow-hidden" // Only hide overflow when not editing (to allow toolbar popups)
      )}
      style={style}
    >
      {toolbar}
      <AnimateOnScroll animation={settings.animation || 'none'} className="w-full h-full">
        {settings.container ? (
          <div className="container mx-auto px-4 md:px-6">
            {children}
          </div>
        ) : (
          children
        )}
      </AnimateOnScroll>
    </section>
  );
};
