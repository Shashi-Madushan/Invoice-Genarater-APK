import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvoiceData } from "../../types/invoice";
// Import your template components
import Template1 from "../../components/templates/Template1-minimalModern";
import Template2 from "../../components/templates/Template2–CleanCorporate";
// Add more templates as needed
import { generateInvoicePDF } from '../../utils/pdfGenerator';

// Accept fullPage prop in template components
const templates: Record<string, React.ComponentType<{ data: InvoiceData; fullPage?: boolean }>> = {
  "template_1": Template1,
  "template_2": Template2,
  // Add more mappings as needed
};

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

  // Select the template component
  const TemplateComponent = templates[data.templateId] || null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 24 }}>
        <Text className="text-2xl font-bold mb-4 text-center">Invoice Preview</Text>
        {TemplateComponent ? (
          <TemplateComponent data={data} fullPage={true} />
        ) : (
          <View style={{ padding: 16 }}>
            <Text className="text-red-500">Selected template not found.</Text>
          </View>
        )}
      </ScrollView>
      {/* Action Buttons */}
      <SafeAreaView
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderColor: '#eee',
        }}
        edges={["bottom"]}
      >
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              style={{
                backgroundColor: '#e5e7eb',
                color: '#374151',
                fontWeight: '600',
                textAlign: 'center',
                paddingVertical: 12,
                borderRadius: 9999,
              }}
              onPress={() => {
                // Navigate to FormPage for editing
                // Pass invoiceData as param
                // You may need to update FormPage to accept invoiceData param
                // For now, just go back
                window.location.href = '/FormPage';
              }}
            >Edit</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                textAlign: 'center',
                paddingVertical: 12,
                borderRadius: 9999,
              }}
              onPress={() => {
                // Save functionality: generate and download PDF
                generateInvoicePDF(data);
              }}
            >Save</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}