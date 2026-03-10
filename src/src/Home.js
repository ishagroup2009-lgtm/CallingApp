import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import { useNavigation, useRoute } from '@react-navigation/native'

const Home = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const route = useRoute()
    const { userId } = route.params
    console.log("userIduserId", userId)

    const navigation = useNavigation()

    useEffect(() => {
        if (userId) {
            fetchUsers()
        }
    }, [userId])

    const fetchUsers = async () => {
        try {
            const response = await axios.post(
                'https://test-backend-bqhi.onrender.com/api/all-users',
                {
                    userId: userId, // 🔴 apna logged-in userId
                }
            )

            setUsers(response.data.users)
        } catch (error) {
            console.log('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.userCard} onPress={() =>
            navigation.navigate("Chatscreen", {
                userId: item._id,   // 👈 id send
                userName: item.name,
                myUserId: userId// (optional)
            })
        }>
            <Ionicons name="person-circle-outline" size={42} color="#ff4d6d" />
            <Text style={styles.userName}>{item.name}</Text>
        </TouchableOpacity>
    )

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#ff4d6d" />
            </View>
        )
    }

    return (
        <View style={styles.container}>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={styles.heading}>Users</Text>
                <Text
                    onPress={() => navigation.navigate("Groups", { userId })}
                    style={styles.heading}>Groups</Text>
            </View>


            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default Home
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff0f4',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ff4d6d',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        marginHorizontal: 5
    },
    userName: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
        color: '#333',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff0f4',
    },
})
