import { create } from 'zustand';

export type LocalImage = {
  uri: string;
  fileName: string;
  contentType: string;
};

type TryOnDraftState = {
  person: LocalImage | null;
  garment: LocalImage | null;
  setPerson: (img: LocalImage | null) => void;
  setGarment: (img: LocalImage | null) => void;
  reset: () => void;
};

export const useTryOnDraftStore = create<TryOnDraftState>((set) => ({
  person: null,
  garment: null,
  setPerson: (person) => set({ person }),
  setGarment: (garment) => set({ garment }),
  reset: () => set({ person: null, garment: null }),
}));
