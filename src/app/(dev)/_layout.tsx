import { DevTabBar } from "@/components/navigation/DevTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <DevTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#10101D",
          borderTopColor: "#292839",
        },
      }}
    >
      <Tabs.Screen name="unmatched" />
      <Tabs.Screen name="patterns" />
    </Tabs>
  );
}
