import { useFont } from "@shopify/react-native-skia";
import { Text, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

import { MOCK_DAILY_SPENDING } from "@/mock_data/daily_spending";

const getCurrentMonthRange = () => {
  const now = new Date();

  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(now);

  const day = now.getDate();

  return day === 1 ? `${month} 1` : `${month} 1 - ${month} ${day}`;
};

const DailySpendingChart = () => {
  const font = useFont(
    require("@expo-google-fonts/space-grotesk/400Regular/SpaceGrotesk_400Regular.ttf"),
    11,
  );

  const chartData = MOCK_DAILY_SPENDING.map((item) => ({
    ...item,
    day: new Date(`${item.date}T00:00:00`).getDate(),
  }));

  return (
    <View className="mt-4">
      <View className="flex flex-row justify-between items-center w-full mb-4">
        <Text className="text-kashi-text-primary font-grotesk-semibold text-lg">
          Daily Spending
        </Text>
        <Text className="text-kashi-text-secondary font-grotesk-medium text-sm">
          {getCurrentMonthRange()}
        </Text>
      </View>

      <View className="bg-kashi-card rounded-2xl px-4 py-6">
        <View className="h-64 w-full">
          <CartesianChart
            data={chartData}
            xKey="day"
            yKeys={["amount"]}
            domainPadding={{ left: 12, right: 12, top: 16 }}
            axisOptions={{
              font,
              tickCount: { x: 6, y: 4 },
              labelColor: "#9CA3AF",
              lineColor: "#2A2A33",
              formatXLabel: (value) => `${value}`,
              formatYLabel: (value) => `${value}`,
            }}
          >
            {({ points, chartBounds }) => (
              <Bar
                points={points.amount}
                chartBounds={chartBounds}
                color="#6331FB"
                roundedCorners={{
                  topLeft: 4,
                  topRight: 4,
                }}
              />
            )}
          </CartesianChart>
        </View>
      </View>
    </View>
  );
};

export default DailySpendingChart;
