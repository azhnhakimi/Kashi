import { colors } from "@/constants/colors";
import {
  createSettlement,
  deleteSettlement,
  updateSettlement,
} from "@/lib/settlements";
import { toast } from "@/lib/toast";
import type { SettlementRecord, SettlementSource } from "@/types/settlements";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

const parseAmount = (value: string): number => {
  const n = Number(value.replace(",", ".").trim());
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
};

const fromCalendarDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
};

type CalendarModalProps = {
  modalVisible: boolean;
  setModalVisible: (visibility: boolean) => void;
  date: Date;
  setDate: (date: Date) => void;
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

type SettlementFormProps = {
  source: SettlementSource;
  settlement?: SettlementRecord;
};

const SettlementForm = ({ source, settlement }: SettlementFormProps) => {
  const route = useRouter();
  const isEdit = !!settlement;

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

  const [title, setTitle] = useState(settlement?.title ?? "");
  const [name, setName] = useState(settlement?.name ?? "");
  const [amount, setAmount] = useState(
    settlement ? String(settlement.amount) : "",
  );
  const [date, setDate] = useState(
    settlement ? fromCalendarDate(settlement.date) : new Date(),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const parsedAmount = parseAmount(amount);

    if (!title.trim() || !name.trim()) {
      Alert.alert("Missing information", "Please fill in the event and name.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        "Invalid amount",
        "Please enter a valid amount greater than zero.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const record = {
        source,
        title: title.trim(),
        name: name.trim(),
        amount: parsedAmount,
        date: toCalendarDate(date),
      };

      if (isEdit && settlement) {
        await updateSettlement(settlement.id, record);
        toast.success("Settlement Updated", "Settlement updated successfully.");
      } else {
        await createSettlement(record);
        toast.success("Settlement Created", "Settlement created successfully.");
      }

      route.back();
    } catch (error) {
      Alert.alert(
        isEdit ? "Unable to update settlement" : "Unable to create settlement",
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!settlement) return;

    Alert.alert(
      "Delete settlement",
      "Are you sure you want to delete this record? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSubmitting(true);

              await deleteSettlement(settlement.id);
              toast.success(
                "Settlement Deleted",
                "Settlement deleted successfully.",
              );

              route.back();
            } catch (error) {
              Alert.alert(
                "Unable to delete settlement",
                error instanceof Error
                  ? error.message
                  : "Something went wrong.",
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 px-4 pt-6 rounded-xl gap-4 justify-start bg-kashi-bg">
      <ScrollView
        className=""
        contentContainerClassName="gap-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Text className="text-kashi-text-primary font-grotesk-medium text-sm">
            Event
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
            Name
          </Text>
          <TextInput
            style={{ includeFontPadding: false }}
            value={name}
            onChangeText={setName}
            className="bg-kashi-card text-kashi-text-primary px-4 py-0 h-14 rounded-xl font-grotesk text-lg"
            textAlignVertical="center"
            placeholder="Enter name..."
            placeholderTextColor={colors.text.muted}
          />
        </View>

        <View className="gap-2">
          <Text className="text-kashi-text-primary font-grotesk-medium text-sm">
            Amount
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
            Summary
          </Text>
          <Text className="text-kashi-text-primary font-grotesk-medium text-lg">
            {source === "incoming"
              ? `${name !== "" ? name : "[  ]"} owes you`
              : `You owe ${name !== "" ? name : "[  ]"}`}
            {", "}
            RM {parseAmount(amount).toFixed(2)} for{"\n"}
            {title !== "" ? title : "[   ]"}
          </Text>
        </View>
      </ScrollView>

      <View className="flex flex-row gap-2 w-full mt-auto">
        {isEdit && (
          <Pressable
            disabled={isSubmitting}
            onPress={handleDelete}
            className="bg-red-900/30 flex-1 basis-0 p-3 rounded-lg justify-center items-center"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </Pressable>
        )}

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
              Cancel
            </Text>
          </Animated.View>
        </Pressable>

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit}
          onPressIn={() => (createPressed.value = true)}
          onPressOut={() => (createPressed.value = false)}
          className="flex-[3] basis-0"
        >
          <Animated.View
            style={createAnimatedStyle}
            className="p-3 rounded-lg flex justify-center items-center"
          >
            <Text className="text-kashi-text-onAccent font-grotesk-bold">
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save"
                  : "Create"}
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

export default SettlementForm;
