import { CACHE_MAX_AGE, persister, queryClient } from "@/lib/query-client";
import "@/root-lib/nativewind";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts,
} from "@expo-google-fonts/space-grotesk";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { NavigationBar } from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { router, Stack, type Href } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { StatusBar as RNStatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";
import "../../global.css";
import { useSyncCapturedTransactions } from "../../sync";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync("#01010D");

function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === "string") {
        router.push(url as Href);
        Notifications.clearLastNotificationResponse();
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) redirect(response.notification);

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );
    return () => subscription.remove();
  }, []);
}

export default function RootLayout() {
  useSyncCapturedTransactions();
  useNotificationObserver();

  const [loaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  const statusBarHeight = RNStatusBar.currentHeight ?? 0;

  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: CACHE_MAX_AGE }}
        onSuccess={() => queryClient.resumePausedMutations()}
      >
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "#01010D" },
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="transaction/create" />
          <Stack.Screen name="transaction/[id]" />
          <Stack.Screen name="transaction/[id]/edit" />
          <Stack.Screen name="(dev)" />
          <Stack.Screen name="settlements/template" />
        </Stack>
        <StatusBar style="light" />
        <NavigationBar style="light" />
        <FlashMessage
          position="top"
          statusBarHeight={statusBarHeight}
          textStyle={{
            fontFamily: "SpaceGrotesk_400Regular",
            letterSpacing: -0.6,
          }}
          titleStyle={{
            fontFamily: "SpaceGrotesk_700Bold",
            letterSpacing: -0.6,
          }}
        />
      </PersistQueryClientProvider>
    </>
  );
}
