import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

const ProfileScreen = ({ navigation, route }) => {

    const socketRef = useRef(null);
    const [userId, setUserId] = useState(null);

    const userName = route?.params?.userName || "User";

    useEffect(() => {

        const setupSocket = async () => {

            const id = await AsyncStorage.getItem("userId");

            if (!id) return;

            setUserId(id);

            socketRef.current = io("https://test-backend-bqhi.onrender.com", {
                transports: ["websocket"],
            });

            socketRef.current.on("connect", () => {

                console.log("PROFILE SOCKET CONNECTED:", socketRef.current.id);

                // 🔥 join room
                socketRef.current.emit("join", id);

                console.log("PROFILE ROOM JOIN:", id);

            });

        };

        setupSocket();

        return () => {
            socketRef.current?.disconnect();
        };

    }, []);

    const goLive = () => {

        if (!userId) return;

        // 🔴 Live start event
        socketRef.current.emit("userLiveStarted", {
            userId: userId
        });

        console.log("LIVE EVENT EMITTED");

        navigation.navigate("LiveScreen");

    };

    return (

        <SafeAreaView style={styles.container}>

            {/* Header */}

            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Profile</Text>

                <View style={{ width: 26 }} />

            </View>

            {/* Profile */}

            <View style={styles.profileSection}>

                <Icon name="person-circle" size={120} color="#777" />

                <Text style={styles.userName}>{userName}</Text>

            </View>

            {/* Go Live */}

            <TouchableOpacity
                style={styles.liveButton}
                onPress={goLive}
            >
                <Icon name="radio" size={20} color="#fff" />
                <Text style={styles.liveText}>Go Live</Text>
            </TouchableOpacity>

        </SafeAreaView>

    );
};

export default ProfileScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "600"
    },

    profileSection: {
        alignItems: "center",
        marginTop: 50
    },

    userName: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10
    },

    liveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        marginHorizontal: 40,
        marginTop: 60,
        paddingVertical: 14,
        borderRadius: 30
    },

    liveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8
    }

});