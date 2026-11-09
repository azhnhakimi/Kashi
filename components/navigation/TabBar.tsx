import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigateToTab: (routeKey: string) => void;
};

const TABS: {
  name: string;
  label: string;
  icon: IoniconsName;
  iconActive: IoniconsName;
}[] = [
  {
    name: "index",
    label: "DASHBOARD",
    icon: "grid-outline",
    iconActive: "grid",
  },
  {
    name: "transactions",
    label: "TRANSACTIONS",
    icon: "receipt-outline",
    iconActive: "receipt",
  },
];

export function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t-[0.5px] border-kashi-accent/40 bg-kashi-bg pt-2"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row h-16 flex-1">
        {TABS.map((tab, index) => {
          const isActive = state.index === index;

          return (
            <Pressable
              key={tab.name}
              onPress={() => {
                const route = state.routes.find(
                  (route) => route.name === tab.name,
                );
                if (route) navigateToTab(route.key);
              }}
              className={`flex-1 items-center justify-center gap-1`}
              style={
                isActive
                  ? {
                      shadowColor: "#111111",
                      shadowOffset: { width: 3, height: 3 },
                      shadowOpacity: 1,
                      shadowRadius: 0,
                      elevation: 4,
                    }
                  : undefined
              }
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={"#fff"}
              />
              <Text
                className="text-[8px] font-grotesk-semibold text-white"
                allowFontScaling={false}
              >
                {tab.label}
              </Text>
              <View
                className={`h-1 w-7 rounded-2xl ${isActive ? "bg-kashi-accent" : "bg-kashi-bg"}`}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
