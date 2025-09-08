import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvoiceData } from "../../types/invoice";

export default function PreviewPage() {
  const { invoiceData } = useLocalSearchParams();

  let data: InvoiceData | null = null;
  try {
    data = invoiceData ? JSON.parse(invoiceData as string) : null;
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text className="text-red-500">No invoice data found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text className="text-2xl font-bold mb-4 text-center">Invoice Preview</Text>
        <Text className="mb-2">Template ID: <Text className="font-semibold">{data.templateId}</Text></Text>
        <Text className="mb-2">Store Name: <Text className="font-semibold">{data.storeName}</Text></Text>
        {data.logoUrl ? (
          <Text className="mb-2">Logo URL: <Text className="font-semibold">{data.logoUrl}</Text></Text>
        ) : null}
        <Text className="mb-2">Date: <Text className="font-semibold">{data.date}</Text></Text>

        <Text className="mt-4 font-bold">Shop Details</Text>
        <Text>Name: {data.shopDetails.name}</Text>
        {data.shopDetails.address && <Text>Address: {data.shopDetails.address}</Text>}
        {data.shopDetails.phone && <Text>Phone: {data.shopDetails.phone}</Text>}
        {data.shopDetails.email && <Text>Email: {data.shopDetails.email}</Text>}

        <Text className="mt-4 font-bold">Customer Details</Text>
        <Text>Name: {data.customerDetails.name}</Text>
        {data.customerDetails.address && <Text>Address: {data.customerDetails.address}</Text>}
        {data.customerDetails.phone && <Text>Phone: {data.customerDetails.phone}</Text>}
        {data.customerDetails.email && <Text>Email: {data.customerDetails.email}</Text>}

        <Text className="mt-4 font-bold">Items</Text>
        {data.items.map((item, idx) => (
          <View key={idx} style={{ marginBottom: 8, padding: 8, borderWidth: 1, borderColor: "#eee", borderRadius: 8 }}>
            <Text>Name: {item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: {item.price}</Text>
            {item.discount ? <Text>Discount: {item.discount}</Text> : null}
          </View>
        ))}

        <Text className="mt-4 font-bold">Totals</Text>
        <Text>Subtotal: {data.totals.subtotal}</Text>
        <Text>Discount: {data.totals.discount}</Text>
        <Text>Grand Total: {data.totals.grandTotal}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}