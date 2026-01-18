import { create } from 'zustand';

export type SettingsTab = 'user' | 'data-ingestion';

interface SettingsDialogState {
  isOpen: boolean;
  activeTab: SettingsTab;
  openDialog: (tab?: SettingsTab) => void;
  closeDialog: () => void;
  setActiveTab: (tab: SettingsTab) => void;
}

export const useSettingsDialogStore = create<SettingsDialogState>((set) => ({
  isOpen: false,
  activeTab: 'user',
  openDialog: (tab = 'user') => set({ isOpen: true, activeTab: tab }),
  closeDialog: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
