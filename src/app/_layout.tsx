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
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import "../../global.css";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync("#01010D");

export default function RootLayout() {
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
        </Stack>
        <StatusBar style="light" />
        <NavigationBar style="light" />
      </PersistQueryClientProvider>
    </>
  );
}
