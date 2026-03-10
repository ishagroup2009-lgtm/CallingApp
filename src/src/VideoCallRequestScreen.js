import React, { useRef, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import io from "socket.io-client"
import AsyncStorage from '@react-native-async-storage/async-storage'

const VideoCallRequestScreen = ({ navigation, route }) => {

    const socketRef = useRef(null)
    const callerId = route?.params?.callerId

    console.log("callerId????????????", callerId)


    useEffect(() => {

        socketRef.current = io("https://test-backend-bqhi.onrender.com", {
            transports: ["websocket"],
        });

        socketRef.current.on("connect", async () => {

            console.log("REQUEST SCREEN SOCKET:", socketRef.current.id)

            const userId = await AsyncStorage.getItem("userId")

            console.log("JOIN USER:", userId)

            if (userId) {
                socketRef.current.emit("join", userId)
            }

        })

        return () => {
            socketRef.current.disconnect()
        }

    }, [])

    const acceptCall = () => {

        socketRef.current.emit("acceptVideoCall", {
            callerId: callerId
        })

        navigation.navigate("Videocallscreen")

    }

    const rejectCall = () => {

        socketRef.current.emit("rejectVideoCall", {
            callerId: callerId
        })

        navigation.goBack()

    }

    return (
        <View style={styles.container}>

            <View style={styles.profileContainer}>
                <Icon name="person-circle" size={140} color="#ffffff" />
            </View>

            {/* <Text style={styles.name}>John Doe</Text> */}

            <Text style={styles.status}>Incoming Video Call...</Text>

            <View style={styles.buttonContainer}>

                <TouchableOpacity style={styles.actionBox} onPress={rejectCall}>
                    <View style={styles.rejectBtn}>
                        <Icon name="call" size={28} color="#fff" />
                    </View>
                    <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBox} onPress={acceptCall}>
                    <View style={styles.acceptBtn}>
                        <Icon name="videocam" size={28} color="#fff" />
                    </View>
                    <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default VideoCallRequestScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center"
    },

    profileContainer: {
        marginBottom: 20
    },

    name: {
        fontSize: 26,
        color: "#fff",
        fontWeight: "bold"
    },

    status: {
        fontSize: 16,
        color: "#aaa",
        marginTop: 5,
        marginBottom: 80
    },

    buttonContainer: {
        flexDirection: "row",
        width: "60%",
        justifyContent: "space-between"
    },

    actionBox: {
        alignItems: "center"
    },

    rejectBtn: {
        backgroundColor: "#ff3b30",
        height: 70,
        width: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center"
    },

    acceptBtn: {
        backgroundColor: "#34c759",
        height: 70,
        width: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center"
    },

    rejectText: {
        color: "#ff3b30",
        marginTop: 8,
        fontSize: 14
    },

    acceptText: {
        color: "#34c759",
        marginTop: 8,
        fontSize: 14
    }

})