import type { MonthlySpending } from "@/types/transaction";
import { useFont } from "@shopify/react-native-skia";
import { Text, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

type LatestMonthStatsChartProps = {
  data: MonthlySpending[];
};

const LatestMonthStatsChart = ({ data }: LatestMonthStatsChartProps) => {
  const font = useFont(
    require("@expo-google-fonts/space-grotesk/400Regular/SpaceGrotesk_400Regular.ttf"),
    11,
  );

  const chartData = data.map((item, index) => ({
    ...item,
    index,
    label: item.month.split(" ")[0],
  }));

  const first = data[0]?.month;
  const last = data[data.length - 1]?.month;

  return (
    <View className="mt-4">
      <View className="flex flex-row justify-between items-center w-full mb-4">
        <Text className="text-kashi-text-primary font-grotesk-semibold text-lg">
          Last 12 Months
        </Text>
        <Text className="text-kashi-text-secondary font-grotesk-medium text-sm">
          {first} - {last}
        </Text>
      </View>

      <View className="bg-kashi-card rounded-2xl px-4 py-6">
        <View className="h-64 w-full">
          <CartesianChart
            data={chartData}
            xKey="index"
            yKeys={["amount"]}
            domainPadding={{ left: 16, right: 16, top: 16 }}
            axisOptions={{
              font,
              tickCount: { x: chartData.length, y: 4 },
              labelColor: "#9CA3AF",
              lineColor: "#2A2A33",
              formatXLabel: (value) =>
                value % 2 === 0 ? (chartData[value]?.label ?? "") : "",
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

export default LatestMonthStatsChart;
