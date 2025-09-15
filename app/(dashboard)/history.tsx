import EditInvoicePage from "@/components/EditInvoiceForm"
import { getCurrentUser } from "@/services/authService"
import { deleteInvoice, getInvoices, updateInvoice } from "@/services/invoiceService"
import React, { useEffect, useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function HistoryScreen() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null)

  useEffect(() => {
    async function fetchInvoices() {
      const user = await getCurrentUser()
      if (user?.uid) {
        const data = await getInvoices(user.uid)
        setInvoices(data)
      }
      setLoading(false)
    }
    fetchInvoices()
  }, [])

  async function handleDelete(invoiceId: string) {
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (user?.uid) {
        await deleteInvoice(user.uid, invoiceId)
        const data = await getInvoices(user.uid)
        setInvoices(data)
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
    setLoading(false)
  }
  async function handleEditSave(updatedInvoice: any) {
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (user?.uid && editingInvoice?.id) {
        await updateInvoice(user.uid, editingInvoice.id, updatedInvoice)
        const data = await getInvoices(user.uid)
        setInvoices(data)
        setEditingInvoice(null)
      }
    } catch (err) {
      console.error('Update failed:', err)
    }
    setLoading(false)
  }

  function handleEditCancel() {
    setEditingInvoice(null)
  }

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-purple-50 to-white">
      <View className="flex-row items-center justify-center mt-8 mb-6">
        <MaterialCommunityIcons name="file-document-outline" size={32} color="#7C3AED" />
        <Text className="ml-3 text-3xl font-extrabold text-purple-700 tracking-tight">Invoice History</Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">Loading...</Text>
        </View>
      ) : (
        <ScrollView className="px-4 pb-8">
          {invoices.length === 0 ? (
            <View className="items-center mt-24">
              <MaterialCommunityIcons name="file-remove-outline" size={56} color="#A1A1AA" />
              <Text className="text-center text-gray-400 mt-6 text-xl font-medium">No invoices found.</Text>
            </View>
          ) : (
            invoices.map((invoice) => (
              <TouchableOpacity
                key={invoice.id}
                className="mb-6"
                onPress={() => console.log(invoice)}
                activeOpacity={0.85}
              >
                <View className="flex-row items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-200 mb-1">
                  <MaterialCommunityIcons name="file-document" size={36} color="#7C3AED" className="mr-5" />
                  <View className="flex-1 mr-5">
                    <Text className="text-xl font-bold text-purple-700 mb-1">{invoice.storeName}</Text>
                    <Text className="text-sm text-gray-700 mb-1">Customer: <Text className="font-medium text-gray-900">{invoice.customerDetails?.name}</Text></Text>
                    <Text className="text-sm text-gray-600 mb-1">Date: <Text className="font-medium text-gray-800">{invoice.date}</Text></Text>
                    <Text className="text-sm text-gray-600">Total: <Text className="font-semibold text-green-600">Rs. {invoice.totals?.grandTotal}</Text></Text>
                  </View>
                  <View className="flex-row ml-2 space-x-2">
                    <TouchableOpacity onPress={() => setEditingInvoice(invoice)} className="bg-purple-100 rounded-full p-2 hover:bg-purple-200 transition" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="pencil" size={22} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(invoice.id)} className="bg-red-100 rounded-full p-2 hover:bg-red-200 transition" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="delete" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
      {editingInvoice && (
        <View className="absolute inset-0 bg-black/30 z-50">
          <View className="w-full h-full bg-white">
            <EditInvoicePage
              invoice={editingInvoice}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
