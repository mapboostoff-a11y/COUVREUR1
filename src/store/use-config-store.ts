import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LandingPageConfig, Section } from '../types/schema';
import { defaultConfig } from '../data/default-config';
import { arrayMove } from '@dnd-kit/sortable';

import { generateUUID } from '../lib/utils';

interface ConfigState {
  config: LandingPageConfig;
  setConfig: (config: LandingPageConfig) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  updateSectionContent: (id: string, content: any) => void;
  updateSectionSettings: (id: string, settings: any) => void;
  updateTheme: (theme: Partial<LandingPageConfig['theme']>) => void;
  updateMeta: (meta: Partial<LandingPageConfig['meta']>) => void;
  updateWhatsApp: (whatsapp: Partial<LandingPageConfig['whatsapp']>) => void;
  addSection: (section: Section) => void;
  duplicateSection: (id: string) => void;
  removeSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  resetToDefault: () => void;
  fetchRemoteConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      
      fetchRemoteConfig: async () => {
        // En développement, on utilise le fichier local
        if (import.meta.env.DEV) return;

        try {
          const response = await fetch('/api/storage');
          if (response.ok) {
            const remoteConfig = await response.json();
            if (remoteConfig) {
              set({ config: remoteConfig });
              console.log('Configuration loaded from remote storage');
            }
          }
        } catch (error) {
          console.warn('Failed to fetch remote config, using default/local', error);
        }
      },

      setConfig: (newConfig) => set({ config: newConfig }),
      updateSection: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, ...updates } as Section : s
            ),
          },
        })),
      updateSectionContent: (id, content) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, content: { ...s.content, ...content } } as Section : s
            ),
          },
        })),
      updateSectionSettings: (id, settings) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.map((s) =>
              s.id === id ? { ...s, settings: { ...s.settings, ...settings } } as Section : s
            ),
          },
        })),
      updateTheme: (themeUpdates) =>
        set((state) => ({
          config: {
            ...state.config,
            theme: {
              ...state.config.theme,
              ...themeUpdates,
              colors: { ...state.config.theme.colors, ...themeUpdates.colors },
              fonts: { ...state.config.theme.fonts, ...themeUpdates.fonts },
            },
          },
        })),
      updateMeta: (metaUpdates) =>
        set((state) => ({
          config: {
            ...state.config,
            meta: { ...state.config.meta, ...metaUpdates },
          },
        })),
      updateWhatsApp: (whatsappUpdates) =>
        set((state) => ({
          config: {
            ...state.config,
            whatsapp: {
              enabled: false,
              number: '',
              position: 'bottom-right',
              ...state.config.whatsapp,
              ...whatsappUpdates,
            },
          },
        })),
      addSection: (section) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: [...state.config.sections, section],
          },
        })),
      duplicateSection: (id) =>
        set((state) => {
          const sectionToDuplicate = state.config.sections.find((s) => s.id === id);
          if (!sectionToDuplicate) return state;
          const newSection = {
            ...sectionToDuplicate,
            id: generateUUID(),
          };
          const index = state.config.sections.findIndex((s) => s.id === id);
          const newSections = [...state.config.sections];
          newSections.splice(index + 1, 0, newSection);
          return {
            config: {
              ...state.config,
              sections: newSections,
            },
          };
        }),
      removeSection: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            sections: state.config.sections.filter((s) => s.id !== id),
          },
        })),
      reorderSections: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.config.sections.findIndex((s) => s.id === activeId);
          const newIndex = state.config.sections.findIndex((s) => s.id === overId);
          return {
            config: {
              ...state.config,
              sections: arrayMove(state.config.sections, oldIndex, newIndex),
            },
          };
        }),
      resetToDefault: () => set({ config: defaultConfig }),
    }),
    {
      name: 'landing-page-config-v4',
    }
  )
);
