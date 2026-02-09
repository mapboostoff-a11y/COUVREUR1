import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AiState {
  // Wizard State
  step: 'input' | 'processing' | 'chat';
  mode: 'visual' | 'json'; // Added mode
  formData: {
    industry: string;
    name: string;
    description: string;
    logo: string;
    differentiation: string;
    phone: string;
    email: string;
  };

  // Chat State
  messages: Message[];
  isTyping: boolean;

  // Actions
  setStep: (step: 'input' | 'processing' | 'chat') => void;
  setMode: (mode: 'visual' | 'json') => void; // Added action
  updateFormData: (data: Partial<AiState['formData']>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
  reset: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  step: 'input',
  mode: 'visual', // Default mode
  formData: {
    industry: '',
    name: '',
    description: '',
    logo: '',
    differentiation: '',
    phone: '',
    email: '',
  },
  messages: [],
  isTyping: false,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      },
    ],
  })),
  setTyping: (isTyping) => set({ isTyping }),
  reset: () => set({
    step: 'input',
    formData: {
      industry: '',
      name: '',
      description: '',
      logo: '',
      differentiation: '',
      phone: '',
      email: '',
    },
    messages: [],
    isTyping: false,
  }),
}));
