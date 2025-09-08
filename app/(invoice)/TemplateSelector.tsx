import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Template1 from "../../components/templates/Template1-minimalModern";
import Template2 from "../../components/templates/Template2–CleanCorporate";
import { InvoiceData } from "../../types/invoice";

const dummyData: InvoiceData = {
  templateId: "",
  storeName: "Your Company",
  date: "2025-09-05",
  items: [
    { name: "Logo Design", quantity: 1, price: 500 },
    { name: "Banner 2x6", quantity: 2, price: 45 },
    { name: "Poster 1x2", quantity: 3, price: 55 },
  ],
  totals: { subtotal: 755, discount: 0, grandTotal: 755 },
  customerDetails: {
    name: "John Doe",
    address: "123 Main St",
    email: "john@example.com",
    phone: "123-456-7890",
  },
  shopDetails: {
    name: "Your Company",
    address: "456 Business Rd",
    email: "info@yourcompany.com",
    phone: "987-654-3210",
  },
};

type Props = {
  onSelectTemplate: (templateId: string) => void;
};

export default function TemplateSelector({ onSelectTemplate }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const templates = [
    { id: "template_1", Component: Template1 },
    { id: "template_2", Component: Template2 },
  ];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // Do NOT call onSelectTemplate here
  };

  const handleNext = () => {
    if (selectedId) {
      onSelectTemplate(selectedId);
      router.push({ pathname: "/FormPage", params: { templateId: selectedId } }); // Navigate and pass templateId
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-2" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex flex-col space-y-4">
          {templates.map((tpl) => (
            <TouchableOpacity
              key={tpl.id}
              onPress={() => handleSelect(tpl.id)}
              className={`rounded-lg border p-2 ${
                selectedId === tpl.id
                  ? "border-blue-500"
                  : "border-gray-200"
              }`}
            >
              <tpl.Component data={{ ...dummyData, templateId: tpl.id }} />
              <Text className="text-center mt-2">{tpl.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View
        className="absolute left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200 flex flex-row justify-center"
      >
        <TouchableOpacity
          className={`px-8 py-3 rounded-full ${selectedId ? "bg-blue-500" : "bg-gray-300"}`}
          disabled={!selectedId}
          onPress={handleNext}
        >
          <Text className={`text-white text-lg font-bold ${!selectedId ? "opacity-50" : ""}`}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}