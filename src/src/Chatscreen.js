import { StyleSheet, View, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/elements'
import axios from 'axios'
import io from 'socket.io-client'
import Ionicons from 'react-native-vector-icons/Ionicons'
import messaging from '@react-native-firebase/messaging';

import {
    InputToolbar, Composer, Send, Actions, MessageText
} from 'react-native-gifted-chat'

const SOCKET_URL = 'https://test-backend-bqhi.onrender.com'


const Chatscreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { userId, userName, myUserId } = route.params

    console.log("userIduserId", userId)
    console.log("myUserIdmyUserId", myUserId)
    console.log("userNameuserName", userName)

    const [messages, setMessages] = useState([])
    const [replyMessage, setReplyMessage] = useState(null)
    const socketRef = useRef(null)
    const headerHeight = useHeaderHeight()
    const [limit, setLimit] = useState(20)
    const [loadingEarlier, setLoadingEarlier] = useState(false)
    const [canLoadMore, setCanLoadMore] = useState(true)
    const [attachModal, setAttachModal] = useState(false)

    /* ======================
       SOCKET + OLD MESSAGES
    ======================= */

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Foreground Message:', remoteMessage);

            // 👇 Yaha message ko chat list me add kar sakte ho
        });

        return unsubscribe;
    }, []);


    useEffect(() => {
        // connect socket
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
        })

        // join own room
        socketRef.current.emit('join', myUserId)

        // receive message
        socketRef.current.on('receiveMessage', msg => {
            const newMsg = {
                _id: Date.now().toString(),
                text: msg.message,
                createdAt: new Date(),
                replyTo: msg.replyTo || null,
                user: {
                    _id: msg.senderId,
                    name: userName,
                },
            }

            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, [newMsg]),
            )
        })

        fetchOldMessages(20)

        return () => {
            socketRef.current.disconnect()
        }
    }, [])



    const renderSend = props => (
        <Send {...props}>
            <View style={{ marginRight: 10, marginBottom: 5 }}>
                <Ionicons name="send" size={24} color="#ff4d6d" />
            </View>
        </Send>
    )

    const renderActions = props => (
        <TouchableOpacity
            style={{ marginLeft: 5, marginBottom: 5 }}
            onPress={() => setAttachModal(true)}
        >
            <Ionicons name="add-circle-outline" size={28} color="#ff4d6d" />
        </TouchableOpacity>
    )

    const renderComposer = props => (
        <Composer
            {...props}
            textInputStyle={{
                backgroundColor: '#fff0f4',
                borderRadius: 20,
                paddingHorizontal: 12,
                marginLeft: 5,
                marginRight: 5,
            }}
        />
    )

    const renderInputToolbar = props => (
        <View>
            {renderReplyBar()}
            <InputToolbar
                {...props}
                containerStyle={{
                    borderTopWidth: 1,
                    borderColor: '#ffd6df',
                    paddingVertical: 5,
                    backgroundColor: '#fff',
                }}
            />
        </View>
    )


    const renderBubble = props => {
        const { currentMessage } = props

        return (

            <Bubble
                {...props}
                onLongPress={() => {
                    setReplyMessage(currentMessage)
                }}
                wrapperStyle={{
                    right: { backgroundColor: '#ff4d6d' },
                    left: { backgroundColor: '#fff' },
                }}
                renderMessageText={textProps => (
                    <View>
                        {/* 🔥 REPLIED MESSAGE (UPPER PART) */}
                        {currentMessage.replyTo && (
                            <View style={styles.quoteBox}>
                                <Text style={styles.quoteText}>
                                    {currentMessage.replyTo.text}
                                </Text>
                            </View>
                        )}

                        {/* 🔥 ACTUAL MESSAGE */}
                        <MessageText
                            {...textProps}
                            textStyle={{
                                right: { color: '#fff' },
                                left: { color: '#333' },
                            }}
                        />
                    </View>
                )}
            />

        )
    }
    const renderReplyBar = () => {
        if (!replyMessage) return null

        return (
            <View style={styles.replyBar}>
                <View style={styles.replyLine} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.replyUser}>
                        Replying to {replyMessage.user._id === myUserId ? 'You' : userName}
                    </Text>
                    <Text numberOfLines={1} style={styles.replyText}>
                        {replyMessage.text}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => setReplyMessage(null)}>
                    <Ionicons name="close" size={20} color="#555" />
                </TouchableOpacity>
            </View>
        )
    }

    /* ======================
       FETCH OLD CHAT
    ======================= */
    const fetchOldMessages = async (newLimit = limit) => {
        if (loadingEarlier || !canLoadMore) return

        setLoadingEarlier(true)

        try {
            const res = await axios.post(`${SOCKET_URL}/api/messages`, {
                senderId: myUserId,
                receiverId: userId,
                limit: "100",
            })

            const data = res.data.messages || []

            console.log("data.length", data.length)

            const formatted = data.map(item => ({
                _id: item._id,
                text: item.message,
                createdAt: new Date(item.createdAt),
                replyTo: item.replyTo || null,
                user: {
                    _id: item.senderId,
                    name: item.senderId === myUserId ? 'Me' : userName,
                },
            }))

            // 🔥 LIMIT-INCREASE approach → LIST REPLACE
            setMessages(formatted)
            setLimit(newLimit)

            // agar aur purane messages hi nahi
            if (data.length < newLimit) {
                setCanLoadMore(false)
            }
        } catch (err) {
            console.log('Fetch messages error', err)
        } finally {
            setLoadingEarlier(false)
        }
    }


    /* ======================
       SEND MESSAGE
    ======================= */
    const onSend = useCallback((msgs = []) => {
        const msg = msgs[0]

        // 🔥 reply attach karo
        const newMsg = {
            ...msg,
            replyTo: replyMessage
                ? {
                    messageId: replyMessage._id,
                    text: replyMessage.text,
                }
                : null,
        }

        // socket emit (reply bhi bhejo)
        socketRef.current.emit('sendMessage', {
            senderId: myUserId,
            receiverId: userId,
            message: msg.text,
            replyTo: newMsg.replyTo,
        })

        // optimistic UI
        setMessages(prev =>
            GiftedChat.append(prev, [newMsg]),
        )

        setReplyMessage(null)
    }, [replyMessage])


    return (
        <View style={{ flex: 1, backgroundColor: "#fff0f4" }}>
            <View style={styles.header}>

                {/* LEFT SIDE */}
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => navigation.navigate("ProfileScreen", { userName })}>



                        <Ionicons
                            name="person-circle-outline"
                            size={36}
                            color="#fff"
                            style={{ marginLeft: 10 }}
                        />

                        <Text style={styles.headerText}>{userName}</Text>
                    </TouchableOpacity>
                </View>

                {/* RIGHT SIDE ICONS */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("LiveScreen", { userName })}
                        style={{ marginRight: 15 }}
                    >
                        <Ionicons name="call-outline" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        // onPress={() => {
                        //     socketRef.current.emit("sendVideoCallNotification", {
                        //         callerId: myUserId,
                        //         receiverId: userId
                        //     })
                        // }}
                        onPress={() => {
                            socketRef.current.emit("sendVideoCallNotification", {
                                callerId: myUserId,
                                receiverId: userId
                            });

                            navigation.navigate("Videocallpreview", {
                                userName
                            });
                        }}
                    >
                        <Ionicons name="videocam-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={40} // header height
            >
                <GiftedChat

                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: myUserId,
                    }}
                    onLongPress={(context, message) => {
                        setReplyMessage(message)
                    }}
                    loadEarlier={canLoadMore}
                    isLoadingEarlier={loadingEarlier}
                    onLoadEarlier={() => {
                        console.log('LOAD MORE')
                        fetchOldMessages(limit + 20)
                    }}





                    infiniteScroll
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    renderActions={renderActions}
                    renderComposer={renderComposer}
                    renderInputToolbar={renderInputToolbar}
                    alwaysShowSend
                    placeholder="Type a message..."
                // keyboardAvoidingViewProps={{
                //     keyboardVerticalOffset: headerHeight,
                // }}
                />
            </KeyboardAvoidingView>
            <Modal visible={attachModal} transparent animationType="none">

                <View style={styles.modalOverlay}>

                    {/* outside click close */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setAttachModal(false)}
                    />

                    <View style={styles.bottomSheet}>

                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Attach File</Text>

                            <TouchableOpacity onPress={() => setAttachModal(false)}>
                                <Ionicons name="close" size={24} color="#ff4d6d" />
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity style={styles.optionBtn}>
                            <View style={[styles.iconCircle, { backgroundColor: "#e3f2fd" }]}>
                                <Ionicons name="document" size={22} color="#1976d2" />
                            </View>
                            <Text style={styles.optionText}>File</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionBtn}>
                            <View style={[styles.iconCircle, { backgroundColor: "#e8f5e9" }]}>
                                <Ionicons name="camera" size={22} color="#2e7d32" />
                            </View>
                            <Text style={styles.optionText}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionBtn}>
                            <View style={[styles.iconCircle, { backgroundColor: "#fff3e0" }]}>
                                <Ionicons name="image" size={22} color="#ef6c00" />
                            </View>
                            <Text style={styles.optionText}>Gallery</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>
        </View>
    )
}

export default Chatscreen

const styles = StyleSheet.create({


    header: {
        height: 60,
        backgroundColor: '#ff4d6d',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        elevation: 4,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    replyBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff0f4',
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#ffd6df',
    },
    replyLine: {
        width: 4,
        height: '100%',
        backgroundColor: '#ff4d6d',
        marginRight: 8,
    },
    replyUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ff4d6d',
    },
    replyText: {
        fontSize: 12,
        color: '#333',
    },
    quoteBox: {
        borderLeftWidth: 3,
        borderLeftColor: '#ff4d6d',
        paddingLeft: 8,
        paddingVertical: 4,
        marginBottom: 6,
    },
    quoteText: {
        fontSize: 12,
        color: '#555',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)"
    },

    bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 20,
        paddingTop: 10,
    },

    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },

    sheetTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333"
    },

    optionBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    optionText: {
        fontSize: 16,
        marginLeft: 15,
        color: "#333"
    },
    bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 25,
        paddingTop: 10,
        maxHeight: 250
    }

})

