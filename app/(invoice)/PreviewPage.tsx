import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvoiceData } from "../../types/invoice";
// Import your template components
import Template1 from "../../components/templates/Template1-minimalModern";
import Template2 from "../../components/templates/Template2–CleanCorporate";
// Add more templates as needed
import { generateInvoicePDF } from '../../utils/pdfGenerator';

import { getCurrentUser } from '../../services/authService';



// Accept fullPage prop in template components
const templates: Record<string, React.ComponentType<{ data: InvoiceData; fullPage?: boolean }>> = {
  "template_1": Template1,
  "template_2": Template2,
  // Add more mappings as needed
};

export default function PreviewPage() {
  const router = useRouter();
  const { invoiceData } = useLocalSearchParams();
  // Get current user
  const currentUser = getCurrentUser();
  const userId = currentUser ? currentUser.uid : null;

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

  // Select the template component
  const TemplateComponent = templates[data.templateId] || null;

  const handleEdit = () => {
    router.push({
      pathname: "/(invoice)/EditInvoicePage",
      params: {
        invoiceData: JSON.stringify(data),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 py-6 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold mb-4 text-center text-black">Invoice Preview</Text>
        {TemplateComponent ? (
          <TemplateComponent data={data} fullPage={true} />
        ) : (
          <View className="p-4">
            <Text className="text-red-500">Selected template not found.</Text>
          </View>
        )}
      </ScrollView>
      {/* Action Buttons */}
      <SafeAreaView className="absolute left-0 right-0 bottom-0 bg-white px-4 py-4 flex-row justify-between border-t border-gray-200" edges={["bottom"]}>
        <View className="flex-row w-full">
          <View className="flex-1 mr-2">
            <TouchableOpacity
              className="bg-purple-600 px-6 py-3 rounded-xl"
              onPress={handleEdit}
            >
              <Text className="text-white font-semibold text-center">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 ml-2">
            <TouchableOpacity
              className="bg-blue-600 px-6 py-3 rounded-xl"
              onPress={async () => {
                await generateInvoicePDF(data, data.templateId, userId);
                router.replace("/home");
              }}
            >
              <Text className="text-white font-semibold text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}