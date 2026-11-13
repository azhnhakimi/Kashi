import { colors } from "@/constants/colors";
import type { SettlementRecord } from "@/types/settlements";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
  source: string;
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

  const handleSubmit = () => {};

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

export default SettlementForm;
