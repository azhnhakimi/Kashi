import { AppRegistry } from "react-native";
import { RNAndroidNotificationListenerHeadlessJsName } from "react-native-android-notification-listener";
import { ingestNotification } from "./ingest";

const handler = async ({ notification }) => {
  if (!notification) return;
  try {
    const n = JSON.parse(notification);
    const body = n.bigText || n.text || "";
    if (!body) return;
    const time = Number(n.time);
    await ingestNotification({
      app: n.app,
      title: n.title,
      body,
      postedAt: Number.isFinite(time) ? time : Date.now(),
    });
  } catch (e) {
    console.warn("notification ingest failed", e);
  }
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => handler,
);
