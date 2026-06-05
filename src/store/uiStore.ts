import { create } from 'zustand'

interface UiStore {
  pageLoading: boolean
  pageLoadingMsg: string
  showLoader: (msg?: string) => void
  hideLoader: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  pageLoading: false,
  pageLoadingMsg: 'Chargement…',
  showLoader: (msg = 'Chargement…') => set({ pageLoading: true, pageLoadingMsg: msg }),
  hideLoader: () => set({ pageLoading: false }),
}))
