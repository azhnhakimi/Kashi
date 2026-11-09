import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const UnmatchedHeader = () => {
  const route = useRouter();

  return (
    <View className="flex flex-row gap-3 items-center mb-4">
      <Pressable
        className="bg-kashi-accent p-2 rounded-lg"
        onPress={() => route.replace("/(tabs)")}
      >
        <Ionicons name="pulse" size={18} color="white" />
      </Pressable>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-xl">
        Unmatched
      </Text>
    </View>
  );
};

export default UnmatchedHeader;
