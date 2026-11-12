import { useCallback, useEffect, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import RNAndroidNotificationListener from "react-native-android-notification-listener";
import {
  canPostNotifications,
  ensureNotificationPermission,
} from "../../notifications";

export default function NotificationAccessBanner() {
  const [status, setStatus] = useState("unknown");
  const [canPost, setCanPost] = useState(true);

  const check = useCallback(async () => {
    setStatus(await RNAndroidNotificationListener.getPermissionStatus());
    setCanPost(await canPostNotifications());
  }, []);

  useEffect(() => {
    check();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });
    return () => sub.remove();
  }, [check]);

  if (status === "authorized" && canPost) return null;

  return (
    <View style={styles.banner} className="bg-kashi-card">
      {status !== "authorized" && (
        <>
          <Text
            style={styles.text}
            className="text-kashi-text-primary font-grotesk"
          >
            Notification access is off, so bank transactions won't be captured.
          </Text>
          <Pressable
            onPress={() => RNAndroidNotificationListener.requestPermission()}
            className="bg-kashi-accent p-4 rounded-xl mt-4 justify-center items-center"
          >
            <Text className="uppercase text-kashi-text-primary font=grotesk-semibold">
              open settings
            </Text>
          </Pressable>
        </>
      )}
      {!canPost && (
        <>
          <Text
            style={styles.text}
            className="text-kashi-text-primary font-grotesk mt-6"
          >
            Kashi can't show "transaction captured" notifications.
          </Text>
          <Pressable
            className="bg-kashi-accent p-4 rounded-xl mt-4 justify-center items-center"
            onPress={async () => {
              await ensureNotificationPermission();
              await check();
            }}
          >
            <Text className="uppercase text-kashi-text-primary font=grotesk-semibold">
              Allow notifications
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: { marginBottom: 4 },
});
