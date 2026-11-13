import { type Category, CATEGORY_META } from "@/constants/category";
import { colors } from "@/constants/colors";
import { useUpsertTransaction } from "@/hooks/useTransactions";
import { toast } from "@/lib/toast";
import type { Transaction } from "@/types/transaction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
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
import { addMerchantCategory } from "../../merchantCategories";
import { isValidFragment } from "../../ownTransfers";

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

const parseAmount = (value: string): number => {
  const n = Number(value.replace(",", ".").trim());
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
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

  const [id] = useState(() => transaction?.id ?? randomUUID());
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});
  const { mutate } = useUpsertTransaction();

  const handleSubmit = () => {
    const parsedAmount = parseAmount(amount);
    const nextErrors: typeof errors = {};

    if (!title.trim()) nextErrors.title = "Please enter a title.";
    if (!(parsedAmount > 0)) nextErrors.amount = "Enter an amount above 0.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Validation failed", Object.values(nextErrors)[0]);
      return;
    }

    // Fire and forget: the cache updates instantly, and the write syncs now
    // or whenever you're back online.
    mutate({
      id,
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: toCalendarDate(date),
    });

    if (
      transaction &&
      transaction.category === "miscellaneous" &&
      category !== "miscellaneous" &&
      isValidFragment(transaction.title)
    ) {
      Alert.alert(
        "Remember this merchant?",
        `Always categorise "${transaction.title}" as ${CATEGORY_META[category].label}?`,
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: () => addMerchantCategory(transaction.title, category),
          },
        ],
      );
    }

    route.replace("/(tabs)/transactions");

    !isEdit
      ? toast.success(
          "Transaction created.",
          "New transaction created successfully.",
        )
      : toast.success(
          "Transaction Updated.",
          "Transaction updated successfully.",
        );
  };

  return (
    <View className="flex-1 px-4 pt-6 rounded-xl gap-4 justify-start">
      <ScrollView
        className=""
        contentContainerClassName="gap-6"
        showsVerticalScrollIndicator={false}
      >
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
          {errors.title && (
            <Text className="text-red-400 font-grotesk text-xs">
              {errors.title}
            </Text>
          )}
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
              keyboardType="decimal-pad"
              textAlignVertical="center"
            />
          </View>
          {errors.amount && (
            <Text className="text-red-400 font-grotesk text-xs">
              {errors.amount}
            </Text>
          )}
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
          <View className="flex-row flex-wrap gap-2 justify-between">
            {categories.map((item) => (
              <View key={item.category} className="w-[48%]">
                <CategoryItem
                  item={item}
                  selected={category === item.category}
                  onPress={() => setCategory(item.category)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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
