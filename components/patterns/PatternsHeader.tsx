import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const PatternsHeader = () => {
  const route = useRouter();

  return (
    <View className="flex flex-row gap-3 items-center">
      <Pressable
        className="bg-kashi-accent p-2 rounded-lg"
        onPress={() => route.replace("/(tabs)")}
      >
        <Ionicons name="unlink" size={18} color="white" />
      </Pressable>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-xl">
        Patterns
      </Text>
    </View>
  );
};

export default PatternsHeader;
