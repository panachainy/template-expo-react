import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useTransactions } from "./hooks/transaction-hook";

export default function Index() {
  const { transactions, addTransaction } = useTransactions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {transactions.map((transaction) => (
          <View
            key={transaction.id}
            style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {transaction.description}
            </Text>
            <Text style={{ color: "#888" }}>{transaction.date}</Text>
            <Text
              style={{
                fontSize: 16,
                color: transaction.amount < 0 ? "red" : "green",
              }}
            >
              {transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Button
        onPress={() => {
          addTransaction({
            amount: 100,
            description: "New Transaction",
            category: "Income",
            date: new Date().toISOString(),
            type: "income",
          });
        }}
        title="Learn More"
      />
    </SafeAreaView>
  );
}
