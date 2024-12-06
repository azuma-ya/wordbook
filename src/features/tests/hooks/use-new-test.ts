import { create } from "zustand";

type NewTestState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useNewTest = create<NewTestState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNewTest;
