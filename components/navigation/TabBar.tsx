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
  { name: "index", label: "HOME", icon: "home-outline", iconActive: "home" },
  {
    name: "transactions",
    label: "TRANSACTIONS",
    icon: "receipt-outline",
    iconActive: "receipt",
  },
  {
    name: "archive",
    label: "ARCHIVE",
    icon: "archive-outline",
    iconActive: "archive",
  },
];

export function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t-[2.5px] border-[#111111] bg-kashi-accent"
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
              className={`flex-1 items-center justify-center gap-1 ${
                isActive
                  ? "bg-[#FF6B6B] border-x-[2.5px] border-b-[2.5px] border-[#111111]"
                  : ""
              }`}
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
                color="#111111"
              />
              <Text
                className="text-[8px] font-semibold text-[#111111]"
                allowFontScaling={false}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
