import { CATEGORY_META } from "@/constants/category";
import { type Transaction } from "@/mock_data/transactions";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { Text, View } from "react-native";

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type TransactionItemsListProps = {
  data: Transaction[];
};

type TransactionItemProps = {
  item: Transaction;
};

const TransactionItem = ({ item }: TransactionItemProps) => {
  const meta = CATEGORY_META[item.category];

  return (
    <View className="bg-kashi-card p-4 rounded-xl flex flex-row gap-4 items-center">
      <View
        className="p-3 rounded-lg flex justify-center items-center aspect-square self-center"
        style={{ backgroundColor: hexToRgba(meta.color, 0.1) }}
      >
        <Ionicons name={meta.icon} size={24} color={meta.color} />
      </View>
      <View className="flex-1">
        <Text
          className="text-kashi-text-primary font-grotesk-semibold"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View className="flex flex-row justify-start items-center">
          <Text className="text-kashi-text-secondary">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
          <Entypo
            name="dot-single"
            size={20}
            className="text-kashi-text-secondary"
          />
          <Text className="text-kashi-text-muted">{formatDate(item.date)}</Text>
        </View>
        <Text className="text-kashi-text-primary font-grotesk-bold">
          RM {item.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const TransactionItemsList = ({ data }: TransactionItemsListProps) => {
  return (
    <View className="gap-2">
      {data.map((item, idx) => (
        <TransactionItem item={item} key={item.id} />
      ))}
    </View>
  );
};

export default TransactionItemsList;
