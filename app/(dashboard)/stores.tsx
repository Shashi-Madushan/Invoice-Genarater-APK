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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-center mt-6 mb-4">
        <MaterialCommunityIcons name="store-outline" size={28} color="#7C3AED" />
        <Text className="ml-2 text-2xl font-bold text-purple-700">My Stores</Text>
      </View>
      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : (
        <ScrollView className="px-4">
          {stores.length === 0 ? (
            <View className="items-center mt-16">
              <MaterialCommunityIcons name="store-remove" size={48} color="#A1A1AA" />
              <Text className="text-center text-gray-400 mt-4 text-lg">No stores found.</Text>
            </View>
          ) : (
            stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                className="mb-4"
                onPress={() => console.log(store)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center p-4 bg-gray-100 rounded-lg shadow mb-2">
                  <MaterialCommunityIcons name="store" size={32} color="#7C3AED" className="mr-4" />
                  <View className="flex-1 mr-4">
                    <Text className="text-lg font-semibold text-purple-700 mb-1">{store.name}</Text>
                    <Text className="text-sm text-gray-700 mb-1">Address: {store.address}</Text>
                    {store.phone && <Text className="text-sm text-gray-600 mb-1">Phone: {store.phone}</Text>}
                    {store.email && <Text className="text-sm text-gray-600">Email: {store.email}</Text>}
                  </View>
                  <View className="flex-row ml-2">
                    <TouchableOpacity onPress={() => {
                      setEditShopId(store.id)
                      setEditShopDetails({ name: store.name, address: store.address, phone: store.phone || '', email: store.email || '' })
                      setModalVisible(true)
                    }} className="mr-4" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="pencil" size={24} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('delete', store.id)} className="ml-2" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
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
          <View className="bg-violet-600 rounded-full w-16 h-16 justify-center items-center shadow-lg">
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
          <View className="bg-white rounded-2xl p-6 w-10/12 shadow-lg">
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
