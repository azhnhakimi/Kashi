import { DevTabBar } from "@/components/navigation/DevTabBar";
import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";

export default function TabLayout() {
  const { width } = useWindowDimensions();

  return (
    <Tabs
      tabBar={(props) => <DevTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#01010D" },
        transitionSpec: {
          animation: "spring",
          config: { duration: 70 },
        },
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-width, 0, width],
                }),
              },
            ],
          },
        }),
        tabBarStyle: {
          backgroundColor: "#10101D",
          borderTopColor: "#292839",
        },
      }}
    >
      <Tabs.Screen name="unmatched" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="patterns" />
      <Tabs.Screen name="mapping" />
      <Tabs.Screen name="myaccount" />
    </Tabs>
  );
}
