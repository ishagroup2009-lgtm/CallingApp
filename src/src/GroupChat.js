import React, { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from "react-native"
import { GiftedChat, Bubble } from "react-native-gifted-chat"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation, useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import io from "socket.io-client"
import axios from "axios"

const SOCKET_URL = "https://test-backend-bqhi.onrender.com"

const GroupChat = () => {

  const navigation = useNavigation()
  const route = useRoute()

  const { groupId, groupName } = route.params

  const [messages, setMessages] = useState([])
  const [userId, setUserId] = useState(null)

  const socketRef = useRef(null)

  /* ========================
      LOAD USER
  ======================== */

  useEffect(() => {

    const loadUser = async () => {

      const id = await AsyncStorage.getItem("userId")

      setUserId(id)

    }

    loadUser()

  }, [])


  /* ========================
      SOCKET CONNECT
  ======================== */

  useEffect(() => {

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"]
    })

    socketRef.current.on("connect", () => {
      console.log("🔥 Socket connected:", socketRef.current.id)
    })

    return () => {
      socketRef.current.disconnect()
    }

  }, [])


  /* ========================
      JOIN GROUP
  ======================== */

  useEffect(() => {

    if (!socketRef.current || !userId) return

    socketRef.current.emit("join", userId)
    socketRef.current.emit("joinGroup", groupId)

  }, [userId])


  /* ========================
      FETCH OLD MESSAGES
  ======================== */

  const fetchMessages = async () => {

    try {

      const res = await axios.post(
        `${SOCKET_URL}/api/group-messages`,
        {
          groupId: groupId,
          page: 1,
          limit: 20
        }
      )

      const formatted = res.data.messages.map(item => ({

        _id: item._id,
        text: item.message,
        createdAt: new Date(item.createdAt),

        user: {
          _id: item.senderId?._id || item.senderId,
          name: item.senderId?.name || "User"
        }

      }))

      setMessages(formatted)

    } catch (err) {

      console.log("Fetch error:", err)

    }

  }

  useEffect(() => {
    fetchMessages()
  }, [])


  /* ========================
      RECEIVE MESSAGE
  ======================== */

  useEffect(() => {

    if (!socketRef.current) return

    socketRef.current.on("receiveGroupMessage", (msg) => {

      const newMsg = {
        _id: msg._id,
        text: msg.message,
        createdAt: new Date(),
        user: {
          _id: msg.senderId?._id || msg.senderId,
          name: msg.senderId?.name || "User"
        }
      }

      setMessages(previous => GiftedChat.append(previous, [newMsg]))

    })

    return () => {
      socketRef.current.off("receiveGroupMessage")
    }

  }, [])


  /* ========================
      SEND MESSAGE
  ======================== */

  const onSend = (newMessages = []) => {

    const msg = newMessages[0]

    socketRef.current.emit("sendGroupMessage", {
      senderId: userId,
      groupId: groupId,
      message: msg.text
    })

    // setMessages(previous => GiftedChat.append(previous, newMessages))

  }


  /* ========================
      CUSTOM BUBBLE
  ======================== */

  const renderBubble = (props) => {

    const isMe = props.currentMessage.user._id === userId

    return (

      <View style={{ marginBottom: 6 }}>

        {/* USER NAME (only other user) */}

        {!isMe && (
          <Text style={styles.userName}>
            {props.currentMessage.user.name}
          </Text>
        )}

        <Bubble
          {...props}

          wrapperStyle={{
            right: {
              backgroundColor: "#ff4d6d",
              padding: 4
            },
            left: {
              backgroundColor: "#ffffff"
            }
          }}

          textStyle={{
            right: {
              color: "#fff"
            },
            left: {
              color: "#000"
            }
          }}

        />

      </View>

    )

  }


  return (

    <View style={{ flex: 1 }}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.groupName}>{groupName}</Text>

        <Ionicons name="people" size={22} color="#fff" />

      </View>


      {/* CHAT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40} // header height
      >
        <GiftedChat
          messages={messages}

          onSend={messages => onSend(messages)}

          user={{
            _id: userId
          }}

          renderBubble={renderBubble}

          renderUsernameOnMessage

          showUserAvatar

          showAvatarForEveryMessage

          placeholder="Type message..."

          alwaysShowSend
        />
      </KeyboardAvoidingView>


    </View>

  )

}

export default GroupChat


const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ff4d6d",
    padding: 15
  },

  groupName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  userName: {
    fontSize: 11,
    marginLeft: 5,
    marginBottom: 2,
    color: "#555",
    fontWeight: "600"
  }

})