import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
  },
  {
    id: 2,
    name: 'Clothing',
    image:
      'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 3,
    name: 'Footwear',
    image:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 4,
    name: 'Beauty',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200',
  },
  {
    id: 5,
    name: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=200',
  },
  {
    id: 6,
    name: 'Groceries',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
  },
  {
    id: 7,
    name: 'Mobile',
    image:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200',
  },
  {
    id: 8,
    name: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
  },
  {
    id: 9,
    name: 'Watches',
    image:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: 10,
    name: 'Sports',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200',
  },
]

const mightNeedProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: '₹1,999',
    image:
      'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    name: 'Men T-Shirt',
    price: '₹799',
    image:
      'https://images.unsplash.com/photo-1520975918318-3a6d8b2a6a8f?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: '₹2,499',
    image:
      'https://images.unsplash.com/photo-1528701800489-20be3c1a1b7b?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    name: 'Smart Watch',
    price: '₹3,999',
    image:
      'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=500&q=60',
  },
]

const popularProducts = [
  {
    id: 1,
    name: 'iPhone 15',
    price: '₹79,999',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
  },
  {
    id: 2,
    name: 'Laptop HP',
    price: '₹55,000',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Women Handbag',
    price: '₹2,199',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    price: '₹1,499',
    image:
      'https://images.unsplash.com/photo-1585386959984-a415522316b2?auto=format&fit=crop&w=500&q=60',
  },
]

const AllCategory = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.header}>

        <View style={styles.headerRow}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color="#888" />
            <Text style={styles.searchText}>Search grocery</Text>
          </View>

          <TouchableOpacity style={styles.cartIcon}>
            <Icon name="cart-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.deliveryText}>Deliver to</Text>
        <Text style={styles.locationText}>Alathur, India</Text>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}>
          {categories.map(item => (
            <TouchableOpacity key={item.id} style={styles.categoryItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* YOU MIGHT NEED */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>You might need</Text>
            <Text style={styles.seeMore}>See more</Text>
          </View>

          <FlatList
            horizontal
            data={mightNeedProducts}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.productCard}>

                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />

                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>

                <View style={styles.qtyContainer}>
                  <TouchableOpacity style={styles.circleBtn}>
                    <Text style={styles.circleText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyNumber}>1</Text>

                  <TouchableOpacity style={styles.circleBtn}>
                    <Text style={styles.circleText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* POPULAR ITEMS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <Text style={styles.seeMore}>See more</Text>
          </View>

          <FlatList
            horizontal
            data={popularProducts}

            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.popularCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.popularImage}
                />

                <Text style={styles.popularName}>{item.name}</Text>
                <Text style={styles.popularPrice}>{item.price}</Text>

                <TouchableOpacity style={styles.smallAddBtn}>
                  <Icon name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

      </ScrollView>
    </View>
  )
}

export default AllCategory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },

  searchText: {
    marginLeft: 8,
    color: '#888',
  },

  cartIcon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },

  deliveryText: {
    color: '#bbb',
    marginTop: 15,
    fontSize: 12,
  },

  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  categoryItem: {
    marginRight: 15,
    alignItems: 'center',
  },

  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },

  categoryText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  seeMore: {
    color: '#ff6b6b',
  },

  /* YOU MIGHT NEED CARD */
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    margin: 4,

    width: 140,
    elevation: 4,
  },

  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 15,
  },

  productName: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 13,
  },

  productPrice: {
    color: '#2c5364',
    marginVertical: 4,
    fontWeight: '700',
    fontSize: 12,
  },

  qtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  circleBtn: {
    backgroundColor: '#2c5364',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  qtyNumber: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  /* POPULAR CARD */
  popularCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    margin: 4,
    width: 120,
    elevation: 4,
  },

  popularImage: {
    width: '100%',
    height: 80,
    borderRadius: 15,
  },

  popularName: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },

  popularPrice: {
    fontSize: 12,
    color: '#2c5364',
    fontWeight: '700',
    marginVertical: 4,
  },

  smallAddBtn: {
    backgroundColor: '#ff6b6b',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
})
