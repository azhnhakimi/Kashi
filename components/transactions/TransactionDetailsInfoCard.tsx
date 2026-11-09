import { CATEGORY_META, type Category } from "@/constants/category";
import Entypo from "@expo/vector-icons/Entypo";
import { Text, View } from "react-native";

type Props = {
  title: string;
  category: Category;
  date: string;
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Seperator = () => {
  return <View className="w-full h-[0.5] bg-kashi-text-muted/30 my-1" />;
};

const TransactionDetailsInfoCard = ({ title, category, date }: Props) => {
  const meta = CATEGORY_META[category];

  return (
    <View className="bg-kashi-card px-4 py-6 rounded-2xl gap-4">
      <View className="flex flex-row justify-between items-start gap-4">
        <Text className="text-kashi-text-secondary font-grotesk">Title</Text>
        <Text className="text-kashi-text-primary font-grotesk-semibold flex-1 text-right">
          {title}
        </Text>
      </View>

      <Seperator />

      <View className="flex flex-row justify-between items-center">
        <Text className="text-kashi-text-secondary font-grotesk">Category</Text>
        <View className="flex flex-row justify-center items-center">
          <Entypo name="dot-single" size={30} color={meta.color} />
          <Text className="text-kashi-text-primary font-grotesk-semibold capitalize text-right">
            {category}
          </Text>
        </View>
      </View>

      <Seperator />

      <View className="flex flex-row justify-between items-center">
        <Text className="text-kashi-text-secondary font-grotesk">Date</Text>
        <Text className="text-kashi-text-primary font-grotesk-semibold flex-1 text-right">
          {formatDate(date)}
        </Text>
      </View>
    </View>
  );
};

export default TransactionDetailsInfoCard;
