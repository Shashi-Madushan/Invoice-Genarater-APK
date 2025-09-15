import { getCurrentUser } from "@/services/authService"
import * as shopService from "@/services/shopService"
import { ShopDetails } from "@/types/invoice"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react"
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Add a type for shops with id
interface ShopWithId extends ShopDetails {
  id: string;
}

const Stores = () => {
  const [stores, setStores] = useState<ShopWithId[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [newShop, setNewShop] = useState<ShopDetails>({ name: '', address: '', phone: '', email: '' })
  const [editShopId, setEditShopId] = useState<string | null>(null)
  const [editShopDetails, setEditShopDetails] = useState<ShopDetails>({ name: '', address: '', phone: '', email: '' })
  const [loading, setLoading] = useState(false)
  const userId = getCurrentUser()?.uid || "demoUserId"
  const fetchShops = async () => {

    setLoading(true)
    try {
      const shops = await shopService.getShops(userId)
      setStores(shops as ShopWithId[])
    } catch (err) {
      // handle error
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchShops()
  }, [])

  const handleAddShop = async () => {
    if (newShop.name && newShop.address) {
      setLoading(true)
      try {
        await shopService.addShop(userId, newShop)
        await fetchShops()
        setNewShop({ name: '', address: '', phone: '', email: '' })
        setModalVisible(false)
      } catch (err) {
        // handle error
      }
      setLoading(false)
    }
  }

  const handleEditShop = async () => {
    if (editShopId && editShopDetails.name && editShopDetails.address) {
      setLoading(true)
      try {
        await shopService.updateShop(userId, editShopId, editShopDetails)
        await fetchShops()
        setEditShopId(null)
        setEditShopDetails({ name: '', address: '', phone: '', email: '' })
        setModalVisible(false)
      } catch (err) {
        // handle error
      }
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-purple-50 to-white">
      <View className="flex-row items-center justify-center mt-8 mb-6">
        <MaterialCommunityIcons name="store-outline" size={32} color="#7C3AED" />
        <Text className="ml-3 text-3xl font-extrabold text-purple-700 tracking-tight">My Stores</Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">Loading...</Text>
        </View>
      ) : (
        <ScrollView className="px-4 pb-8">
          {stores.length === 0 ? (
            <View className="items-center mt-24">
              <MaterialCommunityIcons name="store-remove" size={56} color="#A1A1AA" />
              <Text className="text-center text-gray-400 mt-6 text-xl font-medium">No stores found.</Text>
            </View>
          ) : (
            stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                className="mb-6"
                onPress={() => console.log(store)}
                activeOpacity={0.85}
              >
                <View className="flex-row items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-200 mb-1">
                  <MaterialCommunityIcons name="store" size={36} color="#7C3AED" className="mr-5" />
                  <View className="flex-1 mr-5">
                    <Text className="text-xl font-bold text-purple-700 mb-1">{store.name}</Text>
                    <Text className="text-sm text-gray-700 mb-1">Address: <Text className="font-medium text-gray-900">{store.address}</Text></Text>
                    {store.phone && <Text className="text-sm text-gray-600 mb-1">Phone: <Text className="font-medium text-gray-800">{store.phone}</Text></Text>}
                    {store.email && <Text className="text-sm text-gray-600">Email: <Text className="font-medium text-gray-800">{store.email}</Text></Text>}
                  </View>
                  <View className="flex-row ml-2 space-x-2">
                    <TouchableOpacity onPress={() => {
                      setEditShopId(store.id)
                      setEditShopDetails({ name: store.name, address: store.address, phone: store.phone || '', email: store.email || '' })
                      setModalVisible(true)
                    }} className="bg-purple-100 rounded-full p-2 hover:bg-purple-200 transition" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="pencil" size={22} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('delete', store.id)} className="bg-red-100 rounded-full p-2 hover:bg-red-200 transition" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="delete" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
      <View className="absolute bottom-8 right-8">
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View className="bg-violet-600 rounded-full w-16 h-16 justify-center items-center shadow-sm">
            <Text className="text-white text-3xl font-bold">+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false)
          setEditShopId(null)
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-2xl p-6 w-10/12 shadow-sm">
            <Text className="text-xl font-bold text-violet-700 mb-4">{editShopId ? 'Edit Shop' : 'Add New Shop'}</Text>
            <TextInput
              placeholder="Shop Name"
              value={editShopId ? editShopDetails.name : newShop.name}
              onChangeText={text => {
                if (editShopId) setEditShopDetails({ ...editShopDetails, name: text })
                else setNewShop({ ...newShop, name: text })
              }}
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />
            <TextInput
              placeholder="Shop Address"
              value={editShopId ? editShopDetails.address : newShop.address}
              onChangeText={text => {
                if (editShopId) setEditShopDetails({ ...editShopDetails, address: text })
                else setNewShop({ ...newShop, address: text })
              }}
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />
            <TextInput
              placeholder="Phone (optional)"
              value={editShopId ? editShopDetails.phone : newShop.phone}
              onChangeText={text => {
                if (editShopId) setEditShopDetails({ ...editShopDetails, phone: text })
                else setNewShop({ ...newShop, phone: text })
              }}
              className="border border-gray-300 rounded-lg p-2 mb-3"
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email (optional)"
              value={editShopId ? editShopDetails.email : newShop.email}
              onChangeText={text => {
                if (editShopId) setEditShopDetails({ ...editShopDetails, email: text })
                else setNewShop({ ...newShop, email: text })
              }}
              className="border border-gray-300 rounded-lg p-2 mb-3"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={() => {
                setModalVisible(false)
                setEditShopId(null)
              }}>
                <Text className="text-gray-500 mr-4">Cancel</Text>
              </TouchableOpacity>
              {editShopId ? (
                <TouchableOpacity onPress={handleEditShop} disabled={loading}>
                  <Text className="text-violet-700 font-bold">Update</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleAddShop} disabled={loading}>
                  <Text className="text-violet-700 font-bold">Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Stores
