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
    // Replace with actual API call
    return JSON.parse(localStorage.getItem("transactions") || "[]");
  },

  addTransaction: async (
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const updated = [...transactions, newTransaction];
    localStorage.setItem("transactions", JSON.stringify(updated));
    return newTransaction;
  },

  updateTransaction: async (
    id: string,
    updatedTransaction: Partial<Transaction>
  ): Promise<Transaction> => {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const updated = transactions.map((t: Transaction) =>
      t.id === id ? { ...t, ...updatedTransaction } : t
    );
    localStorage.setItem("transactions", JSON.stringify(updated));
    return updated.find((t: Transaction) => t.id === id);
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    const updated = transactions.filter((t: Transaction) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(updated));
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
