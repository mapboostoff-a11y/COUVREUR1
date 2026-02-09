import { useEffect } from 'react';
import { useConfigStore } from '../../store/use-config-store';

interface ThemeInjectorProps {
  target?: HTMLElement | null;
}

export const ThemeInjector: React.FC<ThemeInjectorProps> = ({ target }) => {
  const theme = useConfigStore((state) => state.config.theme);

  useEffect(() => {
    const root = target || document.documentElement;
    if (!root) return;
    
    // Apply Colors
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-text', theme.colors.text);

    // Apply Fonts
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);

    // Load Fonts from Google Fonts
    const fontsToLoad = new Set([theme.fonts.heading, theme.fonts.body]);
    const fontFamilies = Array.from(fontsToLoad)
      .map(font => font.replace(/\s+/g, '+'))
      .join('&family=');

    if (fontFamilies) {
      const linkId = 'dynamic-fonts';
      const doc = root.ownerDocument || document;
      let link = doc.getElementById(linkId) as HTMLLinkElement;
      
      if (!link) {
        link = doc.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        doc.head.appendChild(link);
      }

      link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;500;600;700&display=swap`;
    }

  }, [theme]);

  return null;
};
