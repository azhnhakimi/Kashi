import { Category, CATEGORY_META } from "@/constants/category";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, Text, View } from "react-native";

type MappingItemProps = {
  fragment: string;
  category: Category;
  onPress: () => void;
};

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const MappingItem = ({ fragment, category, onPress }: MappingItemProps) => {
  const meta = CATEGORY_META[category];

  return (
    <View className="bg-kashi-card px-4 py-6 rounded-lg flex flex-row">
      <View className="gap-4 flex-1">
        <View>
          <Text className="text-kashi-text-muted font-grotesk-semibold uppercase text-xs">
            merchant name
          </Text>
          <Text className="text-kashi-text-primary font-grotesk-medium text-lg">
            {fragment}
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
              {meta.label}
            </Text>
          </View>
        </View>
      </View>
      <View className="justify-center">
        <Pressable
          className="p-3 rounded-lg"
          style={{ backgroundColor: hexToRgba("#DC2127", 0.1) }}
          onPress={onPress}
        >
          <AntDesign name="delete" size={22} color="#DC2127" />
        </Pressable>
      </View>
    </View>
  );
};

export default MappingItem;
