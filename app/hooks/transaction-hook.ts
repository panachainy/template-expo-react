import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
}

// Mock API functions (replace with actual API calls)
const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const stored = await AsyncStorage.getItem("transactions");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting transactions:", error);
      return [];
    }
  },

  addTransaction: async (
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      const stored = await AsyncStorage.getItem("transactions");
      const transactions = stored ? JSON.parse(stored) : [];
      const updated = [...transactions, newTransaction];
      await AsyncStorage.setItem("transactions", JSON.stringify(updated));
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  updateTransaction: async (
    id: string,
    updatedTransaction: Partial<Transaction>
  ): Promise<Transaction> => {
    try {
      const stored = await AsyncStorage.getItem("transactions");
      const transactions = stored ? JSON.parse(stored) : [];
      const updated = transactions.map((t: Transaction) =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      );
      await AsyncStorage.setItem("transactions", JSON.stringify(updated));
      return updated.find((t: Transaction) => t.id === id);
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  deleteTransaction: async (id: string): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem("transactions");
      const transactions = stored ? JSON.parse(stored) : [];
      const updated = transactions.filter((t: Transaction) => t.id !== id);
      await AsyncStorage.setItem("transactions", JSON.stringify(updated));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },
};

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading: loading } = useQuery({
    queryKey: ["transactions"],
    queryFn: api.getTransactions,
  });

  const addTransactionMutation = useMutation({
    mutationFn: api.addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({
      id,
      updatedTransaction,
    }: {
      id: string;
      updatedTransaction: Partial<Transaction>;
    }) => api.updateTransaction(id, updatedTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: api.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const getTransactionsByType = (type: "income" | "expense") => {
    return transactions.filter((transaction) => transaction.type === type);
  };

  const getTotalAmount = (type?: "income" | "expense") => {
    return transactions
      .filter((transaction) => !type || transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  return {
    transactions,
    loading,
    addTransaction: addTransactionMutation.mutate,
    updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) =>
      updateTransactionMutation.mutate({ id, updatedTransaction }),
    deleteTransaction: deleteTransactionMutation.mutate,
    getTransactionsByType,
    getTotalAmount,
  };
};
