import type { mode } from "@/components/settlements/CreateRecordBtn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SettlementForm from "@/components/settlements/SettlementForm";

type HeaderProps = {
  mode: string;
  source: string;
};

const Header = ({ mode, source }: HeaderProps) => {
  const route = useRouter();

  return (
    <View className="flex flex-row gap-3 items-center mb-4">
      <Pressable onPress={() => route.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          className="text-kashi-text-primary mr-4"
        />
      </Pressable>
      <View className="bg-kashi-accent p-2 rounded-lg">
        <Ionicons name="cash" size={18} color="white" />
      </View>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-xl capitalize">
        {mode} {source}
      </Text>
    </View>
  );
};

const SettlementTemplate = () => {
  const { mode, source } = useLocalSearchParams<{
    mode: string;
    source: mode;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top", "bottom"]}>
      <Header mode={mode} source={source}></Header>
      <SettlementForm source={source} />
    </SafeAreaView>
  );
};

export default SettlementTemplate;
