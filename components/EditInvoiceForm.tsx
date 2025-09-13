import { getCurrentUser } from "@/services/authService";
import * as shopService from "@/services/shopService";
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerDetails, InvoiceItem, ShopDetails } from "./../types/invoice";

interface ShopWithId {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface EditInvoiceFormProps {
  invoice: any;
  onSave: (updated: any) => void;
  onCancel: () => void;
}

export default function EditInvoiceForm({ invoice, onSave, onCancel }: EditInvoiceFormProps) {
  // State for form fields, initialized from invoice
  const [logoUrl, setLogoUrl] = useState(invoice.logoUrl || "");
  const [date, setDate] = useState(invoice.date ? invoice.date.substring(0, 10) : "");
  const [shopDetails, setShopDetails] = useState<ShopDetails>(invoice.shopDetails || { name: "" });
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(invoice.customerDetails || { name: "" });
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items || [{ name: "", quantity: 1, price: 0 }]);
  const [totalDiscount, setTotalDiscount] = useState(invoice.totals?.totalDiscount || 0);
  const [errors, setErrors] = useState<string[]>([]);
  const [stores, setStores] = useState<ShopWithId[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("");

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const grandTotal = subtotal - discount - totalDiscount;

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

  const validateInputs = () => {
    const errs: string[] = [];
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
    if (totalDiscount !== undefined && (isNaN(totalDiscount) || totalDiscount < 0)) errs.push("Total Discount must be a non-negative number.");
    return errs;
  };

  const handleSave = () => {
    const validationErrors = validateInputs();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;
    const updatedInvoice = {
      ...invoice,
      logoUrl: logoUrl.trim(),
      date: new Date(date).toISOString(),
      items: items.map(item => ({
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
        discount: item.discount !== undefined && item.discount !== null && String(item.discount) !== "" ? Number(item.discount) : undefined,
      })),
      totals: { subtotal, discount, totalDiscount, grandTotal },
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
    onSave(updatedInvoice);
  };

  useEffect(() => {
    const fetchShops = async () => {
      const userId = getCurrentUser()?.uid || "demoUserId";
      try {
        const shops = await shopService.getShops(userId);
        setStores(shops as ShopWithId[]);
      } catch (err) {
        // handle error
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    // Set selectedShopId from invoice.shopDetails if available and stores are loaded
    if (stores.length > 0 && invoice.shopDetails && invoice.shopDetails.name) {
      const foundShop = stores.find(s => s.name === invoice.shopDetails.name);
      if (foundShop) {
        setSelectedShopId(foundShop.id);
        setShopDetails({
          name: foundShop.name || "",
          address: foundShop.address || "",
          phone: foundShop.phone || "",
          email: foundShop.email || ""
        });
      }
    }
  }, [stores, invoice.shopDetails]);

  useEffect(() => {
    if (selectedShopId) {
      const shop = stores.find((s: ShopWithId) => s.id === selectedShopId);
      if (shop) {
        setShopDetails({
          name: shop.name || "",
          address: shop.address || "",
          phone: shop.phone || "",
          email: shop.email || ""
        });
      }
    }
  }, [selectedShopId, stores]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4 pt-8"
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold mb-2 text-center text-black">Edit Invoice</Text>
        {/* Validation Errors */}
        {errors.length > 0 && (
          <View className="mb-4">
            {errors.map((err, idx) => (
              <Text key={idx} className="text-red-500 text-sm mb-1">{err}</Text>
            ))}
          </View>
        )}
        {/* Logo URL */}
        <Text className="font-semibold text-black">Logo URL</Text>
        <TextInput
          className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
          value={logoUrl}
          onChangeText={setLogoUrl}
          placeholder="Logo URL (optional)"
          placeholderTextColor="#888"
        />
        {/* Date */}
        <Text className="font-semibold text-black">Date</Text>
        <TextInput
          className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
          value={date}
          onChangeText={setDate}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#888"
        />
        {/* Select Store */}
        <Text className="mt-2 font-semibold text-black">Select Store</Text>
        <View className="border border-gray-300 rounded-xl mb-3 bg-white">
          <Picker
            selectedValue={selectedShopId}
            onValueChange={(itemValue: string) => setSelectedShopId(itemValue)}
          >
            <Picker.Item label="Select a store" value="" />
            {stores.map((store: ShopWithId) => (
              <Picker.Item key={store.id} label={store.name} value={store.id} />
            ))}
          </Picker>
        </View>
        {/* Shop Details (read-only, filled from selected store) */}
        <Text className="mt-4 font-semibold text-black">Shop Details</Text>
        <View className="space-y-2 mb-2">
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={shopDetails.name}
            editable={false}
            placeholder="Shop Name"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={shopDetails.address || ""}
            editable={false}
            placeholder="Shop Address"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={shopDetails.phone || ""}
            editable={false}
            placeholder="Shop Phone"
            keyboardType="phone-pad"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={shopDetails.email || ""}
            editable={false}
            placeholder="Shop Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
        </View>
        {/* Customer Details */}
        <Text className="mt-4 font-semibold text-black">Customer Details</Text>
        <View className="space-y-2 mb-2">
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={customerDetails.name}
            onChangeText={name => setCustomerDetails({ ...customerDetails, name })}
            placeholder="Customer Name"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={customerDetails.address || ""}
            onChangeText={address => setCustomerDetails({ ...customerDetails, address })}
            placeholder="Customer Address"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={customerDetails.phone || ""}
            onChangeText={phone => setCustomerDetails({ ...customerDetails, phone })}
            placeholder="Customer Phone"
            keyboardType="phone-pad"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
            value={customerDetails.email || ""}
            onChangeText={email => setCustomerDetails({ ...customerDetails, email })}
            placeholder="Customer Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
        </View>
        {/* Items */}
        <Text className="mt-4 font-semibold text-black">Invoice Items</Text>
        <View className="space-y-4">
          {items.map((item, idx) => (
            <View key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <TextInput
                className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
                value={item.name}
                onChangeText={name => handleItemChange(idx, "name", name)}
                placeholder="Item Name"
                placeholderTextColor="#888"
              />
              <View className="flex-row space-x-2">
                <TextInput
                  className="mt-2 mb-3 flex-1 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
                  value={item.quantity.toString()}
                  onChangeText={quantity => handleItemChange(idx, "quantity", quantity)}
                  placeholder="Quantity"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                />
                <TextInput
                  className="mt-2 mb-3 flex-1 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
                  value={item.price.toString()}
                  onChangeText={price => handleItemChange(idx, "price", price)}
                  placeholder="Price"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                />
                <TextInput
                  className="mt-2 mb-3 flex-1 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
                  value={item.discount?.toString() || ""}
                  onChangeText={discount => handleItemChange(idx, "discount", discount)}
                  placeholder="Discount (optional)"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                />
              </View>
              <TouchableOpacity
                className={`bg-red-100 px-4 py-2 rounded-full self-end mt-2 ${items.length === 1 ? 'opacity-50' : ''}`}
                onPress={() => handleRemoveItem(idx)}
                disabled={items.length === 1}
              >
                <Text className="text-red-700 font-semibold">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity
          className="bg-purple-600 px-6 py-3 rounded-xl mt-4 mb-4"
          onPress={handleAddItem}
        >
          <Text className="text-white font-semibold text-center">Add Item</Text>
        </TouchableOpacity>
        {/* Total Discount */}
        <Text className="font-semibold text-black mt-4">Total Discount (optional)</Text>
        <TextInput
          className="mt-2 mb-3 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-purple-500"
          value={totalDiscount.toString()}
          onChangeText={val => setTotalDiscount(val === '' ? 0 : Number(val))}
          placeholder="Total Discount"
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        {/* Totals */}
        <View className="mb-8 mt-2 bg-purple-50 rounded-xl p-4 border border-purple-100">
          <Text className="font-semibold text-black">Subtotal: <Text className="text-purple-700">{subtotal.toFixed(2)}</Text></Text>
          <Text className="font-semibold text-black">Item Discounts: <Text className="text-purple-700">{discount.toFixed(2)}</Text></Text>
          <Text className="font-semibold text-black">Total Discount: <Text className="text-purple-700">{totalDiscount.toFixed(2)}</Text></Text>
          <Text className="font-semibold text-black">Grand Total: <Text className="text-purple-700">{grandTotal.toFixed(2)}</Text></Text>
        </View>
      </ScrollView>
      {/* Fixed Action Buttons */}
      <SafeAreaView
        className="absolute left-0 right-0 bottom-0 bg-white px-4 py-4 flex-row justify-between border-t border-gray-200"
        edges={["bottom"]}
      >
        <TouchableOpacity
          className="bg-gray-100 px-6 py-3 rounded-xl flex-1 mr-2"
          onPress={onCancel}
        >
          <Text className="text-black font-semibold text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-purple-600 px-6 py-3 rounded-xl flex-1 ml-2 ${errors.length > 0 ? 'opacity-50' : ''}`}
          onPress={handleSave}
          disabled={errors.length > 0}
        >
          <Text className="text-white font-semibold text-center">Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}
