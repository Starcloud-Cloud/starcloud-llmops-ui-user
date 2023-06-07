import { create } from "zustand";

const useNotificationStore = create((set) => ({
  open: false,
  message: "",
  type: "success",
  showNotification: (message: string, type: "success" | "error" | "info" | "warning" = "success") =>
    set(() => ({ open: true, message, type })),
  closeNotification: () => set(() => ({ open: false, message: "", type: "success" })),
}));

const useMessageBoxStore = create((set) => ({
  open: false,
  message: "",
  title: "",
  type: "warning",
  showMessageBox: (message: string, title: string, type: "warning" | "error" = "warning") =>
    set(() => ({ open: true, message, title, type })),
  closeMessageBox: () => set(() => ({ open: false, message: "", title: "", type: "warning" })),
}));

export { useNotificationStore, useMessageBoxStore };
