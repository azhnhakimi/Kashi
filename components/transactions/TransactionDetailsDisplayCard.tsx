import { CATEGORY_META, type Category } from "@/constants/category";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { Text, View } from "react-native";

type Props = {
  category: Category;
  title: string;
  amount: string;
};

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const TransactionDetailsDisplayCard = ({ category, title, amount }: Props) => {
  const meta = CATEGORY_META[category];

  return (
    <View className="bg-kashi-card px-4 py-6 rounded-2xl items-center gap-2">
      <View
        className="p-3 rounded-lg flex justify-center items-center aspect-square self-center"
        style={{ backgroundColor: hexToRgba(meta.color, 0.1) }}
      >
        <Ionicons name={meta.icon} size={40} color={meta.color} />
      </View>
      <View className="bg-kashi-text-muted/20 py-[0.5] pr-5 pl-2 rounded-3xl flex flex-row items-center justify-center mb-4">
        <Entypo name="dot-single" size={30} color={meta.color} />
        <Text className="text-kashi-text-secondary">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </View>
      <Text className="text-kashi-text-primary text-xl font-grotesk-semibold text-center">
        {title}
      </Text>
      <Text className="text-kashi-text-primary text-3xl font-grotesk-bold">
        RM {amount}
      </Text>
    </View>
  );
};

export default TransactionDetailsDisplayCard;
