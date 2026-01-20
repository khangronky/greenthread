import { create } from 'zustand';
import type { SensorType } from '@/types';

export type Severity = 'normal' | 'warning' | 'critical';

export interface AIHighlight {
  sensorId: SensorType | null;
  severity: Severity;
  actionRequired: boolean;
}

interface AIExplainState {
  // Streaming state
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;

  // Active sensor highlight
  highlight: AIHighlight;
  setHighlight: (highlight: Partial<AIHighlight>) => void;
  clearHighlight: () => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

const initialHighlight: AIHighlight = {
  sensorId: null,
  severity: 'normal',
  actionRequired: false,
};

export const useAIExplainStore = create<AIExplainState>((set) => ({
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  highlight: initialHighlight,
  setHighlight: (highlight) =>
    set((state) => ({
      highlight: { ...state.highlight, ...highlight },
    })),
  clearHighlight: () => set({ highlight: initialHighlight }),

  error: null,
  setError: (error) => set({ error }),
}));
