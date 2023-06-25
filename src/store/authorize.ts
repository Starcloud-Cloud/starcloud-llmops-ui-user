import { create } from 'zustand';
type AuthorizedStore = {
    isUnauthorized: boolean;
    setUnauthorized: () => void;
    resetUnauthorized: () => void;
};

const useAuthorizedStore = create<AuthorizedStore>((set) => ({
    isUnauthorized: false,
    setUnauthorized: () => {
        set({ isUnauthorized: true });
    },
    resetUnauthorized: () => set({ isUnauthorized: false })
}));

export default useAuthorizedStore;
