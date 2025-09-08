import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerDetails, InvoiceItem, ShopDetails } from "../../types/invoice";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function FormPage() {
  const { templateId } = useLocalSearchParams();
  const router = useRouter();

  // State for form fields
  const [storeName, setStoreName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [date, setDate] = useState("");
  const [shopDetails, setShopDetails] = useState<ShopDetails>({ name: "" });
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: "" });
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", quantity: 1, price: 0 }
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const grandTotal = subtotal - discount;

  // Handlers for items
  const handleItemChange = (idx: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: field === "quantity" || field === "price" || field === "discount" ? Number(value) : value };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleGoBack = () => {
    router.replace("/(invoice)/TemplateSelector");
  };

  const validateInputs = () => {
    const errs: string[] = [];
    if (!storeName.trim()) errs.push("Store Name is required.");
    if (!date.trim()) errs.push("Date is required.");
    else if (isNaN(new Date(date).getTime())) errs.push("Date format is invalid.");
    if (!shopDetails.name.trim()) errs.push("Shop Name is required.");
    if (!customerDetails.name.trim()) errs.push("Customer Name is required.");
    items.forEach((item, idx) => {
      if (!item.name.trim()) errs.push(`Item ${idx + 1}: Name is required.`);
      if (isNaN(item.quantity) || item.quantity <= 0) errs.push(`Item ${idx + 1}: Quantity must be a positive number.`);
      if (isNaN(item.price) || item.price < 0) errs.push(`Item ${idx + 1}: Price must be a non-negative number.`);
      if (item.discount !== undefined && (isNaN(item.discount) || item.discount < 0)) errs.push(`Item ${idx + 1}: Discount must be a non-negative number.`);
    });
    return errs;
  };

  const handlePreview = () => {
    const validationErrors = validateInputs();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    const invoiceData = {
      templateId: templateId as string,
      storeName: storeName.trim(),
      logoUrl: logoUrl.trim(),
      date: new Date(date).toISOString(),
      items: items.map(item => ({
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
        discount: item.discount !== undefined && item.discount !== null && String(item.discount) !== "" ? Number(item.discount) : undefined,
      })),
      totals: { subtotal, discount, grandTotal },
      customerDetails: {
        ...customerDetails,
        name: customerDetails.name.trim(),
        address: customerDetails.address?.trim(),
        phone: customerDetails.phone?.trim(),
        email: customerDetails.email?.trim(),
      },
      shopDetails: {
        ...shopDetails,
        name: shopDetails.name.trim(),
        address: shopDetails.address?.trim(),
        phone: shopDetails.phone?.trim(),
        email: shopDetails.email?.trim(),
      },
    };
    console.log("InvoiceData:", invoiceData);

    router.push({
      pathname: "/PreviewPage",
      params: {
        invoiceData: JSON.stringify(invoiceData),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xl font-bold mb-4 text-center">Invoice Form</Text>
        <Text className="text-base text-gray-700 mb-2 text-center">
          Selected Template ID:{" "}
          <Text className="font-semibold text-blue-500">{templateId}</Text>
        </Text>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            {errors.map((err, idx) => (
              <Text key={idx} style={{ color: "red", marginBottom: 2 }}>{err}</Text>
            ))}
          </View>
        )}

        {/* Store Name */}
        <Text className="mt-4 font-semibold">Store Name</Text>
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={storeName}
          onChangeText={setStoreName}
          placeholder="Store Name"
        />

        {/* Logo URL */}
        <Text className="font-semibold">Logo URL</Text>
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={logoUrl}
          onChangeText={setLogoUrl}
          placeholder="Logo URL (optional)"
        />

        {/* Date */}
        <Text className="font-semibold">Date</Text>
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={date}
          onChangeText={setDate}
          placeholder="Date (YYYY-MM-DD)"
        />
        {date ? (
          <Text style={{ color: "#2563eb", marginBottom: 8 }}>
            Formatted: {formatDate(date)}
          </Text>
        ) : null}

        {/* Shop Details */}
        <Text className="mt-4 font-semibold">Shop Details</Text>
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={shopDetails.name}
          onChangeText={name => setShopDetails({ ...shopDetails, name })}
          placeholder="Shop Name"
        />
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={shopDetails.address || ""}
          onChangeText={address => setShopDetails({ ...shopDetails, address })}
          placeholder="Shop Address"
        />
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={shopDetails.phone || ""}
          onChangeText={phone => setShopDetails({ ...shopDetails, phone })}
          placeholder="Shop Phone"
          keyboardType="phone-pad"
        />
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={shopDetails.email || ""}
          onChangeText={email => setShopDetails({ ...shopDetails, email })}
          placeholder="Shop Email"
          keyboardType="email-address"
        />

        {/* Customer Details */}
        <Text className="mt-4 font-semibold">Customer Details</Text>
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={customerDetails.name}
          onChangeText={name => setCustomerDetails({ ...customerDetails, name })}
          placeholder="Customer Name"
        />
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={customerDetails.address || ""}
          onChangeText={address => setCustomerDetails({ ...customerDetails, address })}
          placeholder="Customer Address"
        />
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={customerDetails.phone || ""}
          onChangeText={phone => setCustomerDetails({ ...customerDetails, phone })}
          placeholder="Customer Phone"
          keyboardType="phone-pad"
        />
        <TextInput
          className="border rounded px-3 py-2 mb-2"
          value={customerDetails.email || ""}
          onChangeText={email => setCustomerDetails({ ...customerDetails, email })}
          placeholder="Customer Email"
          keyboardType="email-address"
        />

        {/* Items */}
        <Text className="mt-4 font-semibold">Invoice Items</Text>
        {items.map((item, idx) => (
          <View key={idx} className="border rounded p-2 mb-2">
            <TextInput
              className="border rounded px-3 py-2 mb-2"
              value={item.name}
              onChangeText={name => handleItemChange(idx, "name", name)}
              placeholder="Item Name"
            />
            <TextInput
              className="border rounded px-3 py-2 mb-2"
              value={item.quantity.toString()}
              onChangeText={quantity => handleItemChange(idx, "quantity", quantity)}
              placeholder="Quantity"
              keyboardType="numeric"
            />
            <TextInput
              className="border rounded px-3 py-2 mb-2"
              value={item.price.toString()}
              onChangeText={price => handleItemChange(idx, "price", price)}
              placeholder="Price"
              keyboardType="numeric"
            />
            <TextInput
              className="border rounded px-3 py-2 mb-2"
              value={item.discount?.toString() || ""}
              onChangeText={discount => handleItemChange(idx, "discount", discount)}
              placeholder="Discount (optional)"
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="bg-red-200 px-4 py-2 rounded-full self-end"
              onPress={() => handleRemoveItem(idx)}
              disabled={items.length === 1}
            >
              <Text className="text-red-700 font-semibold">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-full mb-4"
          onPress={handleAddItem}
        >
          <Text className="text-white font-semibold text-center">Add Item</Text>
        </TouchableOpacity>

        {/* Totals */}
        <View className="mb-8">
          <Text className="font-semibold">Subtotal: {subtotal.toFixed(2)}</Text>
          <Text className="font-semibold">Discount: {discount.toFixed(2)}</Text>
          <Text className="font-semibold">Grand Total: {grandTotal.toFixed(2)}</Text>
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <SafeAreaView
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderColor: "#eee",
        }}
        edges={["bottom"]}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#e5e7eb",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 9999,
            marginRight: 8,
            flex: 1,
          }}
          onPress={handleGoBack}
        >
          <Text style={{ color: "#374151", fontWeight: "600", textAlign: "center" }}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#3b82f6",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 9999,
            marginLeft: 8,
            flex: 1,
            opacity: errors.length > 0 ? 0.5 : 1,
          }}
          onPress={handlePreview}
          disabled={errors.length > 0}
        >
          <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>Preview</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}