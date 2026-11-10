import { type Category } from "@/constants/category";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
};
