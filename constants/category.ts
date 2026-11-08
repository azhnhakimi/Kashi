import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export type Category =
  | "food"
  | "entertainment"
  | "utilities"
  | "transport"
  | "care"
  | "savings"
  | "clothing"
  | "supplies"
  | "subscriptions"
  | "miscellaneous";

export type CategorySpending = {
  category: Category;
  amount: number;
};

export type CategoryMeta = {
  label: string;
  icon: IoniconsName;
  color: string;
};

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  food: {
    label: "Food & Drinks",
    icon: "restaurant-outline",
    color: "#FACC15",
  },
  entertainment: {
    label: "Entertainment",
    icon: "game-controller-outline",
    color: "#FB923C",
  },
  utilities: { label: "Utilities", icon: "flash-outline", color: "#60A5FA" },
  transport: { label: "Transport", icon: "car-outline", color: "#34D399" },
  care: {
    label: "Personal Care",
    icon: "sparkles-outline",
    color: "#F472B6",
  },
  savings: { label: "Savings", icon: "wallet-outline", color: "#A3E635" },
  clothing: { label: "Clothing", icon: "shirt-outline", color: "#FF6B6B" },
  supplies: { label: "Supplies", icon: "cube-outline", color: "#C4B5FD" },
  subscriptions: {
    label: "Subscriptions",
    icon: "repeat-outline",
    color: "#67E8F9",
  },
  miscellaneous: {
    label: "Miscellaneous",
    icon: "ellipsis-horizontal-outline",
    color: "#D4D4D4",
  },
};
