// components/templates/Template2.tsx
import React from "react";
import { Image, Text, View } from "react-native";
import { InvoiceData } from "../../types/invoice";

type Props = { data: InvoiceData };

export const Template2: React.FC<Props> = ({ data }) => {
  return (
    <View className="p-4 border border-gray-400 rounded-lg w-[300px] bg-white">
      <View className="flex-row items-center mb-2.5">
        {data.logoUrl && (
          <Image source={{ uri: data.logoUrl }} className="w-10 h-10 mr-2.5" />
        )}
        <Text className="text-base font-bold">{data.storeName}</Text>
      </View>

      <Text className="text-lg font-bold mb-1.5">INVOICE</Text>
      <Text className="text-xs text-gray-600 mb-2.5">Date: {data.date}</Text>

      <View className="flex-row justify-between border-b pb-1">
        <Text className="w-16 text-center text-xs">Description</Text>
        <Text className="w-16 text-center text-xs">Qty</Text>
        <Text className="w-16 text-center text-xs">Unit Price</Text>
        <Text className="w-16 text-center text-xs">Amount</Text>
      </View>

      {data.items.map((item, index) => (
        <View key={index} className="flex-row justify-between mt-1.5">
          <Text className="w-16 text-center text-xs">{item.name}</Text>
          <Text className="w-16 text-center text-xs">{item.quantity}</Text>
          <Text className="w-16 text-center text-xs">${item.price}</Text>
          <Text className="w-16 text-center text-xs">
            ${item.price * item.quantity - (item.discount || 0)}
          </Text>
        </View>
      ))}

      <View className="mt-2.5">
        <Text>Subtotal: ${data.totals.subtotal}</Text>
        <Text>Discount: ${data.totals.discount}</Text>
        <Text className="font-bold">Total Due: ${data.totals.grandTotal}</Text>
      </View>
    </View>
  );
};