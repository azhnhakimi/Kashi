import * as Notifications from "expo-notifications";
import { Linking } from "react-native";

export const CHANNEL_ID = "captures";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureChannel() {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Captured transactions",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function canPostNotifications() {
  const perm = await Notifications.getPermissionsAsync();
  return perm.granted;
}

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) {
    Linking.openSettings();
    return false;
  }
  await ensureChannel();
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function postNotification(title, body, url) {
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: url ? { url } : {} },
    trigger: { channelId: CHANNEL_ID },
  });
}

export async function notifyCapture(saved) {
  try {
    if (saved.status === "matched") {
      const amount = (saved.amountSen / 100).toFixed(2);
      await postNotification(
        `Captured RM${amount}`,
        saved.merchant || "Bank transaction",
        "/(tabs)/transactions",
      );
    } else if (saved.status === "unmatched") {
      await postNotification(
        "Bank Notification Needs Pattern",
        "Open Kashi to review it in Unmatched",
        "/(dev)/unmatched",
      );
    }
  } catch (e) {
    console.warn("notify failed", e);
  }
}
