import { create } from "zustand";

type OpenTestState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

const useOpenTest = create<OpenTestState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));

export default useOpenTest;
