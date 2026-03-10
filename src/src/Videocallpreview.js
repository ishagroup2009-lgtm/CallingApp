import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

const Videocallpreview = ({ route, navigation }) => {

    const userName = route?.params?.userName || "User Name"

    return (
        <View style={styles.container}>

            <View style={styles.overlay}>

                <View style={styles.profileContainer}>
                    <Icon name="person-circle-outline" size={140} color="#fff" />
                    <Text style={styles.name}>{userName}</Text>
                    <Text style={styles.callingText}>Calling...</Text>
                </View>

                <TouchableOpacity
                    style={styles.endCallButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="call" size={28} color="#fff" />
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default Videocallpreview

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#000" // black background
    },

    overlay: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 80
    },

    profileContainer: {
        alignItems: "center",
        marginTop: 100
    },

    name: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        marginTop: 15
    },

    callingText: {
        color: "#ddd",
        fontSize: 16,
        marginTop: 5
    },

    endCallButton: {
        backgroundColor: "red",
        height: 70,
        width: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 60,
        elevation: 5
    }

})