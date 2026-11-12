import { AppRegistry } from "react-native";
import { RNAndroidNotificationListenerHeadlessJsName } from "react-native-android-notification-listener";
import { ingestNotification } from "./ingest";
import { notifyCapture } from "./notifications";

const handler = async ({ notification }) => {
  console.log("[KASHI] raw:", notification);
  console.log("[KASHI] headless fired", !!notification);
  if (!notification) return;
  try {
    const n = JSON.parse(notification);
    const body = n.bigText || n.text || "";
    console.log("[KASHI] app:", n.app, "bodyLen:", body.length);
    if (!body) return;
    const time = Number(n.time);
    const saved = await ingestNotification({
      app: n.app,
      title: n.title,
      body,
      postedAt: Number.isFinite(time) ? time : Date.now(),
    });
    if (saved) await notifyCapture(saved);
    console.log("[KASHI] ingest done");
  } catch (e) {
    console.warn("[KASHI] ingest failed", e);
  }
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => handler,
);
