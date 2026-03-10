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

const Groups = () => {

    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()
    const route = useRoute()
    const { userId } = route.params   // 👈 Home se userId bhejna padega

    useEffect(() => {
        if (userId) {
            fetchGroups()
        }
    }, [userId])

    const fetchGroups = async () => {
        try {

            const response = await axios.post(
                "https://test-backend-bqhi.onrender.com/api/my-groups",
                {
                    userId: userId
                }
            )

            console.log("Groups:", response.data)

            setGroups(response.data.groups)

        } catch (error) {
            console.log("Groups fetch error", error)
        } finally {
            setLoading(false)
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.groupCard}
            onPress={() =>
                navigation.navigate("GroupChat", {
                    groupId: item._id,
                    groupName: item.name
                })
            }
        >
            <Ionicons name="people-circle-outline" size={42} color="#ff4d6d" />

            <View style={{ marginLeft: 10 }}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.memberCount}>
                    Members: {item.members?.length || 0}
                </Text>
            </View>

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

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#ff4d6d" />
                </TouchableOpacity>

                <Text style={styles.heading}>My Groups</Text>

                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={groups}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />

        </View>
    )
}

export default Groups

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff0f4',
        padding: 20
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20
    },

    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff4d6d'
    },

    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        marginHorizontal: 5
    },

    groupName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },

    memberCount: {
        fontSize: 12,
        color: '#777'
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff0f4'
    }

})