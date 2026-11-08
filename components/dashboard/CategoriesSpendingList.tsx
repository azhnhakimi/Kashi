import { CATEGORY_META, type CategorySpending } from "@/constants/category";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

type CategoriesSpendingListProps = {
  data: CategorySpending[];
};

type CategoryCardProps = {
  item: CategorySpending;
};

const CategoryCard = ({ item }: CategoryCardProps) => {
  const meta = CATEGORY_META[item.category];

  return (
    <View className="bg-kashi-surface flex flex-row items-center p-4 rounded-lg gap-3">
      <View
        className="p-3 rounded-lg flex justify-center items-center"
        style={{ backgroundColor: hexToRgba(meta.color, 0.1) }}
      >
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>

      <Text className="flex-1 text-kashi-text-primary font-grotesk">{meta.label}</Text>
      <Text className="text-kashi-text-muted font-grotesk-bold">
        RM {item.amount.toFixed(2)}
      </Text>
    </View>
  );
};

const CategoriesSpendingList = ({ data }: CategoriesSpendingListProps) => {
  const [showAll, setShowAll] = useState(false);

  const sortedData = [...data].sort((a, b) => b.amount - a.amount);
  const displayedData = showAll ? sortedData : sortedData.slice(0, 3);

  return (
    <View>
      <View className="flex flex-row justify-between items-center w-full mb-4">
        <Text className="text-kashi-text-primary font-grotesk-semibold text-lg">
          Categories
        </Text>

        {data.length > 3 && (
          <Pressable onPress={() => setShowAll(!showAll)}>
            <Text className="text-kashi-text-secondary font-grotesk-medium text-sm">
              {showAll ? "View Less" : "View More"}
            </Text>
          </Pressable>
        )}
      </View>

      <View className="gap-2">
        {displayedData.map((item) => (
          <CategoryCard key={item.category} item={item} />
        ))}
      </View>
    </View>
  );
};

export default CategoriesSpendingList;
