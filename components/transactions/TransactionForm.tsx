import { type Category, CATEGORY_META } from "@/constants/category";
import { colors } from "@/constants/colors";
import type { Transaction } from "@/mock_data/transactions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const categories = Object.entries(CATEGORY_META).map(([category, meta]) => ({
  category: category as Category,
  ...meta,
}));

type CalendarModalProps = {
  modalVisible: boolean;
  setModalVisible: (visibility: boolean) => void;
  date: Date;
  setDate: (date: Date) => void;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const toCalendarDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const fromCalendarDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const CalendarModal = ({
  modalVisible,
  setModalVisible,
  date,
  setDate,
}: CalendarModalProps) => {
  const { width, height } = useWindowDimensions();

  const handleDateSelect = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    setDate(new Date(year, month - 1, day));
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      backdropColor={"#00000050"}
    >
      <View className="flex-1 justify-center items-center">
        <View className="rounded-lg overflow-hidden">
          <Calendar
            showSixWeeks
            current={toCalendarDate(date)}
            onDayPress={(day) => handleDateSelect(day.dateString)}
            markedDates={{
              [toCalendarDate(date)]: {
                selected: true,
              },
            }}
            enableSwipeMonths
            theme={{
              backgroundColor: "#10101D",
              calendarBackground: "#10101D",
              todayTextColor: "#6331FB",
              dayTextColor: "#FFFFFF",
              monthTextColor: "#FFFFFF",
              arrowColor: "#FFFFFF",
              textDisabledColor: "#6F6D80",
              textMonthFontFamily: "SpaceGrotesk_700Bold",
              textDayFontFamily: "SpaceGrotesk_400Regular",
            }}
            dayComponent={({ date, state, marking, onPress }) => {
              const isSelected = marking?.selected;
              const isToday = state === "today";

              return (
                <Pressable
                  onPress={() => date && onPress?.(date)}
                  className={`w-11 h-11 rounded-lg items-center justify-center ${
                    isSelected
                      ? "bg-kashi-accent"
                      : isToday
                        ? "border border-kashi-accent"
                        : ""
                  }`}
                >
                  <Text
                    className={`font-grotesk ${
                      isSelected
                        ? "text-white"
                        : state === "disabled"
                          ? "text-kashi-text-muted"
                          : "text-kashi-text-primary"
                    }`}
                  >
                    {date?.day}
                  </Text>
                </Pressable>
              );
            }}
            style={{
              width: width * 0.8,
            }}
          />
          <Pressable
            onPress={() => setModalVisible(false)}
            className="bg-kashi-card rounded-lg p-3 items-center mt-2"
          >
            <Text className="text-kashi-text-primary font-grotesk-medium">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

type CategoryItemProps = {
  item: (typeof categories)[number];
  selected: boolean;
  onPress: () => void;
};

const CategoryItem = ({ item, selected, onPress }: CategoryItemProps) => {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 150 });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#10101D", "#6331FB"],
    ),
  }));

  return (
    <Pressable className="flex-1" onPress={onPress}>
      <Animated.View
        style={animatedStyle}
        className="p-4 flex-row justify-start items-center gap-4 rounded-lg border border-transparent"
      >
        <Ionicons name={item.icon} size={16} color={item.color} />
        <Text className="text-kashi-text-primary font-grotesk text-sm">
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

type TransactionFormProps = {
  transaction?: Transaction;
};

const TransactionForm = ({ transaction }: TransactionFormProps) => {
  const route = useRouter();
  const isEdit = !!transaction;

  const createPressed = useSharedValue(false);
  const createAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(createPressed.value ? "#5025D5" : "#6331FB", {
      duration: 150,
    }),
  }));

  const discardPressed = useSharedValue(false);
  const discardAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(discardPressed.value ? "#0D0D1B" : "#10101D", {
      duration: 150,
    }),
  }));

  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState(transaction?.title ?? "");
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : "",
  );
  const [date, setDate] = useState(
    transaction ? fromCalendarDate(transaction.date) : new Date(),
  );
  const [category, setCategory] = useState<Category>(
    transaction?.category ?? "food",
  );

  const handleSubmit = () => {
    const payload = {
      ...(transaction && { id: transaction.id }),
      title,
      amount,
      date,
      category,
    };

    console.log(payload);
    route.replace("/(tabs)/transactions");
  };

  return (
    <View className="flex-1 px-4 pt-6 rounded-xl gap-4 justify-start">
      <View className="gap-2">
        <Text className="text-kashi-text-primary font-grotesk-medium text-sm">
          Transaction Title
        </Text>
        <TextInput
          style={{ includeFontPadding: false }}
          value={title}
          onChangeText={setTitle}
          className="bg-kashi-card text-kashi-text-primary px-4 py-0 h-14 rounded-xl font-grotesk text-lg"
          textAlignVertical="center"
          placeholder="Enter title..."
          placeholderTextColor={colors.text.muted}
        />
      </View>

      <View className="gap-2">
        <Text className="text-kashi-text-primary font-grotesk-medium text-sm">
          Transaction Amount
        </Text>
        <View className="flex flex-row justify-between items-center gap-2 bg-kashi-card px-4 py-4 rounded-xl">
          <Text className="text-kashi-text-secondary font-grotesk-bold text-lg">
            RM
          </Text>
          <TextInput
            style={{ includeFontPadding: false }}
            value={amount}
            onChangeText={setAmount}
            className="bg-kashi-card text-kashi-text-primary font-grotesk-semibold text-xl flex-1 h-full"
            keyboardType="numeric"
            textAlignVertical="center"
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-kashi-text-primary font-grotesk-medium text-sm">
          Date
        </Text>
        <Pressable
          className="bg-kashi-card rounded-xl px-4 py-5 flex flex-row justify-start items-center gap-4"
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="calendar-clear-outline"
            size={18}
            className="text-kashi-text-secondary"
          />
          <Text className="text-kashi-text-primary font-grotesk-medium">
            {formatDate(date)}
          </Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <Text className="text-kashi-text-primary font-grotesk-medium text-sm">
          Category
        </Text>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.category}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              selected={category === item.category}
              onPress={() => setCategory(item.category)}
            />
          )}
        />
      </View>

      <View className="flex flex-row gap-2 w-full mt-auto">
        <Pressable
          className="flex-[2] basis-0"
          onPress={() => route.back()}
          onPressIn={() => (discardPressed.value = true)}
          onPressOut={() => (discardPressed.value = false)}
        >
          <Animated.View
            style={discardAnimatedStyle}
            className="p-3 rounded-lg flex justify-center items-center"
          >
            <Text className="text-kashi-text-secondary font-grotesk-medium">
              Discard
            </Text>
          </Animated.View>
        </Pressable>
        <Pressable
          onPress={() => handleSubmit()}
          onPressIn={() => (createPressed.value = true)}
          onPressOut={() => (createPressed.value = false)}
          className="flex-[3] basis-0"
        >
          <Animated.View
            style={createAnimatedStyle}
            className="p-3 rounded-lg flex justify-center items-center"
          >
            <Text className="text-kashi-text-onAccent font-grotesk-bold">
              {isEdit ? "Save" : "Create"}
            </Text>
          </Animated.View>
        </Pressable>
      </View>

      <CalendarModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        date={date}
        setDate={setDate}
      />
    </View>
  );
};

export default TransactionForm;
