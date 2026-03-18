import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    geminiApiKey: string;
    setGeminiApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            geminiApiKey: '',
            setGeminiApiKey: (key) => set({ geminiApiKey: key }),
        }),
        {
            name: 'goc-hoc-vui-settings', // name of the item in the storage (must be unique)
        }
    )
);
