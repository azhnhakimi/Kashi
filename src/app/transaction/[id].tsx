import { useDeleteTransaction, useTransaction } from "@/hooks/useTransactions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TransactionDetailsSkeleton from "@/components/skeletons/TransactionDetailsSkeleton";
import DeleteTransactionBtn from "@/components/transactions/DeleteTransactionBtn";
import EditTransactionBtn from "@/components/transactions/EditTransactionBtn";
import TransactionDetailsDisplayCard from "@/components/transactions/TransactionDetailsDisplayCard";
import TransactionDetailsHeader from "@/components/transactions/TransactionDetailsHeader";
import TransactionDetailsInfoCard from "@/components/transactions/TransactionDetailsInfoCard";

type DeleteModalProps = {
  modalVisible: boolean;
  setModalVisible: (visibility: boolean) => void;
  onConfirm: () => void;
};

const DeleteModal = ({
  modalVisible,
  setModalVisible,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-kashi-card rounded-2xl px-6 py-8 w-full gap-12">
          <View className="gap-1">
            <Text className="text-kashi-text-primary font-grotesk-bold text-lg">
              Delete transaction?
            </Text>
            <Text className="text-kashi-text-secondary font-grotesk">
              This action cannot be undone.
            </Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="flex-1 bg-kashi-card rounded-lg p-3 items-center"
            >
              <Text className="text-kashi-text-primary font-grotesk-medium">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 bg-[#DC4545] rounded-lg p-3 items-center"
            >
              <Text className="text-white font-grotesk-medium">Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TransactionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: transaction, isPending } = useTransaction(id);
  const { mutate: remove } = useDeleteTransaction();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    router.replace("/(tabs)/transactions");
    setDeleteModalVisible(false);
    remove(id);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-kashi-bg p-4 gap-2"
      edges={["top", "bottom"]}
    >
      <TransactionDetailsHeader />
      {isPending ? (
        <View className="flex-1">
          <TransactionDetailsSkeleton />
        </View>
      ) : transaction ? (
        <>
          <TransactionDetailsDisplayCard
            category={transaction.category}
            title={transaction.title}
            amount={String(transaction.amount)}
          />
          <TransactionDetailsInfoCard
            title={transaction.title}
            category={transaction.category}
            date={transaction.date}
          />
          <View className="mt-auto gap-2 mb-2">
            <EditTransactionBtn id={id} />
            <DeleteTransactionBtn onPress={() => setDeleteModalVisible(true)} />
          </View>

          <DeleteModal
            modalVisible={deleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            onConfirm={handleDelete}
          />
        </>
      ) : (
        <View className="flex-1 bg-kashi-bg justify-center items-center">
          <Text className="text-kashi-text-muted italic font-grotesk-medium text-lg">
            Transaction not found.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TransactionDetails;
