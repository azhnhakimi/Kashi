import NewTransactionHeader from "@/components/transactions/NewTransactionHeader";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Screen } from "@/components/ui/Screen";

const TransactionCreate = () => {
  return (
    <Screen className="gap-2" edges={["top", "bottom"]}>
      <NewTransactionHeader />
      <TransactionForm />
    </Screen>
  );
};

export default TransactionCreate;
