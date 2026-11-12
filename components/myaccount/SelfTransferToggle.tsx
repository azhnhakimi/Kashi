import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import {
  SETTING_SKIP_OWN,
  isSkipEnabled,
  setSetting,
} from "../../ownTransfers";

export default function SelfTransferToggle() {
  const [enabled, setEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      isSkipEnabled().then(setEnabled);
    }, []),
  );

  const onChange = async (value: boolean) => {
    setEnabled(value);
    await setSetting(SETTING_SKIP_OWN, value ? "1" : "0");
  };

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text
          style={styles.title}
          className="text-kashi-text-primary font-grotesk"
        >
          Skip own transfers
        </Text>
        <Text
          style={styles.hint}
          className="text-kashi-text-muted font-grotesk"
        >
          Transfers to your own accounts are ignored instead of recorded
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onChange}
        thumbColor={"#6331FB"}
        trackColor={{
          false: "#10101D",
          true: "#6331fb3f",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  text: { flex: 1, paddingRight: 12 },
  title: { fontWeight: "600" },
  hint: { fontSize: 12 },
});
