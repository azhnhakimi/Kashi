import { CATEGORY_META } from "@/constants/category";
import type { Mapping } from "@/types/mapping";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, Text, View } from "react-native";

type MappingItemProps = {
  item: Mapping;
};

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const MappingItem = ({ item }: MappingItemProps) => {
  const meta = CATEGORY_META[item.category];

  return (
    <View className="bg-kashi-card p-4 rounded-lg flex flex-row">
      <View className="gap-4 flex-1">
        <View>
          <Text className="text-kashi-text-muted font-grotesk-semibold uppercase text-xs">
            merchant name
          </Text>
          <Text className="text-kashi-text-primary font-grotesk-medium text-lg">
            {item.merchant}
          </Text>
        </View>
        <View>
          <Text className="text-kashi-text-muted text-xs font-grotesk">
            Maps To
          </Text>
        </View>
        <View className="gap-1">
          <Text className="text-kashi-text-muted font-grotesk-semibold uppercase text-xs">
            category
          </Text>
          <View className="flex flex-row justify-start items-center gap-2">
            <View
              className="p-2 rounded-lg flex justify-center items-center aspect-square self-center"
              style={{ backgroundColor: hexToRgba(meta.color, 0.1) }}
            >
              <Ionicons name={meta.icon} size={14} color={meta.color} />
            </View>
            <Text
              className="capitalize font-grotesk-medium"
              style={{ color: meta.color }}
            >
              {item.category}
            </Text>
          </View>
        </View>
      </View>
      <View className="justify-around">
        <Pressable
          className="p-3 rounded-lg"
          style={{ backgroundColor: hexToRgba("#2563EB", 0.1) }}
          onPress={() => {}}
        >
          <AntDesign name="edit" size={22} color="#2563EB" />
        </Pressable>

        <Pressable
          className="p-3 rounded-lg"
          style={{ backgroundColor: hexToRgba("#DC2127", 0.1) }}
          onPress={() => {}}
        >
          <AntDesign name="delete" size={22} color="#DC2127" />
        </Pressable>
      </View>
    </View>
  );
};

export default MappingItem;
