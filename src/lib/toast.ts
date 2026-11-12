import { showMessage } from "react-native-flash-message";

type ToastType = "success" | "error" | "info";

const toastConfig = {
  success: {
    backgroundColor: "#16A34A",
    icon: "success" as const,
  },
  error: {
    backgroundColor: "#DC2127",
    icon: "danger" as const,
  },
  info: {
    backgroundColor: "#2563EB",
    icon: "info" as const,
  },
};

const showToast = (
  message: string,
  type: ToastType = "success",
  description?: string,
) => {
  const config = toastConfig[type];

  showMessage({
    message,
    description,
    type: "default",
    backgroundColor: config.backgroundColor,
    color: "#FFFFFF",
    icon: config.icon,
  });
};

export const toast = {
  show: showToast,
  success: (message: string, description?: string) =>
    showToast(message, "success", description),
  error: (message: string, description?: string) =>
    showToast(message, "error", description),
  info: (message: string, description?: string) =>
    showToast(message, "info", description),
};
