// components/templates/Template2.tsx
import React from "react";
import { Image, Text, View } from "react-native";
import { InvoiceData } from "../../types/invoice";

type Props = { data: InvoiceData; fullPage?: boolean };
const Template2: React.FC<Props> = ({ data, fullPage }) => {
  return (
    <View style={{
      padding: fullPage ? 32 : 20,
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 12,
      backgroundColor: 'white',
      width: fullPage ? '100%' : 320,
      height: fullPage ? '80%' : undefined,
      alignSelf: fullPage ? 'stretch' : 'center',
      justifyContent: fullPage ? 'center' : undefined,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {data.logoUrl ? (
          <Image source={{ uri: data.logoUrl }} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 10 }} />
        ) : <View style={{ width: 40 }} />}
        <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{data.storeName}</Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>INVOICE</Text>
      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, textAlign: 'center' }}>Date: {data.date}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>Shop Details</Text>
          <Text style={{ fontSize: 12 }}>Name: {data.shopDetails?.name}</Text>
          <Text style={{ fontSize: 12 }}>Address: {data.shopDetails?.address}</Text>
          <Text style={{ fontSize: 12 }}>Phone: {data.shopDetails?.phone}</Text>
          <Text style={{ fontSize: 12 }}>Email: {data.shopDetails?.email}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>Customer Details</Text>
          <Text style={{ fontSize: 12 }}>Name: {data.customerDetails?.name}</Text>
          <Text style={{ fontSize: 12 }}>Address: {data.customerDetails?.address}</Text>
          <Text style={{ fontSize: 12 }}>Phone: {data.customerDetails?.phone}</Text>
          <Text style={{ fontSize: 12 }}>Email: {data.customerDetails?.email}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 4, marginBottom: 4 }}>
        <Text style={{ flex: 2, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Description</Text>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Qty</Text>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Unit Price</Text>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Amount</Text>
      </View>
      {data.items.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 2 }}>
          <Text style={{ flex: 2, textAlign: 'center', fontSize: 12 }}>{item.name}</Text>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>{item.quantity}</Text>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>${item.price}</Text>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>${item.price * item.quantity - (item.discount || 0)}</Text>
        </View>
      ))}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 13 }}>Subtotal: ${data.totals.subtotal}</Text>
        <Text style={{ fontSize: 13 }}>Discount: ${data.totals.discount}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Total Due: ${data.totals.grandTotal}</Text>
      </View>
    </View>
  );
};

export default Template2;
