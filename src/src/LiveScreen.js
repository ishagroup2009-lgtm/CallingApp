// import React, { useRef, useState, useEffect } from 'react';
// import {
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
//     Switch,
//     PermissionsAndroid,
//     Platform,
// } from 'react-native';

// import {
//     createAgoraRtcEngine,
//     ChannelProfileType,
//     ClientRoleType,
//     RtcSurfaceView,
//     VideoSourceType,
// } from 'react-native-agora';
// import AsyncStorage from '@react-native-async-storage/async-storage';



// const LiveScreen = () => {
//     const agoraEngineRef = useRef(null);
//     const eventHandler = useRef(null);

//     const [isJoined, setIsJoined] = useState(false);
//     const [isHost, setIsHost] = useState(true);
//     const [remoteUid, setRemoteUid] = useState(0);
//     const [message, setMessage] = useState('');
//     const [localUidSTATE, setLocalUidSTATE] = useState(null);
// const appId = '5585e4187e7c42a38f304f4c1bfae791';
// const token = '007eJxTYMj6t/DQXRGHefv5G/au0VvzNNvK//KVaxabO9vsdtlb1WkoMJiaWpimmhhamKeaJ5sYJRpbpBkbmKSZJBsmpSWmmlsaLopfmdkQyMjQ/t2SlZEBAkF8FgZHv1AvBgYAp40gFw==';
// const channelName = 'ANUJ';
// const localUid = localUidSTATE;

//     useEffect(() => {

//         const loadUser = async () => {

//             const id = await AsyncStorage.getItem("userId");

//             console.log("idid>>>>>>>", id);

//             if (!id) {
//                 console.log("User ID not found");
//                 return;
//             }

//             const numericUid = parseInt(id.slice(-6), 16);
//             setLocalUidSTATE(numericUid);
//         };

//         loadUser();

//     }, []);


//     useEffect(() => {
//         const init = async () => {
//             await setupVideoSDKEngine();
//             setupEventHandler();
//         };

//         init();

//         return () => {
//             cleanupAgoraEngine();
//         };
//     }, []);

//     const setupEventHandler = () => {
//         eventHandler.current = {
//             onJoinChannelSuccess: () => {
//                 setMessage('Successfully joined channel: ' + channelName);
//                 setupLocalVideo();
//                 setIsJoined(true);
//             },

//             onUserJoined: (_connection, uid) => {
//                 setMessage('Remote user ' + uid + ' joined');
//                 setRemoteUid(uid);
//             },

//             onUserOffline: (_connection, uid) => {
//                 setMessage('Remote user ' + uid + ' left the channel');
//                 setRemoteUid(0);
//             },
//         };

//         agoraEngineRef.current?.registerEventHandler(eventHandler.current);
//     };

//     const setupVideoSDKEngine = async () => {
//         try {
//             if (Platform.OS === 'android') {
//                 await getPermission();
//             }

//             agoraEngineRef.current = createAgoraRtcEngine();
//             const agoraEngine = agoraEngineRef.current;

//             await agoraEngine.initialize({ appId: appId });
//         } catch (e) {
//             console.error(e);
//         }
//     };

//     const setupLocalVideo = () => {
//         agoraEngineRef.current?.enableVideo();
//         agoraEngineRef.current?.startPreview();
//     };

//     const join = async () => {
//         if (isJoined) return;

//         try {
//             if (isHost) {
//                 agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
//                     channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
//                     clientRoleType: ClientRoleType.ClientRoleBroadcaster,
//                     publishMicrophoneTrack: true,
//                     publishCameraTrack: true,
//                     autoSubscribeAudio: true,
//                     autoSubscribeVideo: true,
//                 });
//             } else {
//                 agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
//                     channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
//                     clientRoleType: ClientRoleType.ClientRoleAudience,
//                     publishMicrophoneTrack: false,
//                     publishCameraTrack: false,
//                     autoSubscribeAudio: true,
//                     autoSubscribeVideo: true,
//                 });
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const leave = () => {
//         try {
//             agoraEngineRef.current?.leaveChannel();
//             setRemoteUid(0);
//             setIsJoined(false);
//             showMessage('Left the channel');
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const cleanupAgoraEngine = () => {
//         if (eventHandler.current) {
//             agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);
//         }

//         agoraEngineRef.current?.release();
//     };

//     function showMessage(msg) {
//         setMessage(msg);
//     }

//     return (
//         <SafeAreaView style={styles.main}>
//             <Text style={styles.head}>Agora Video SDK Quickstart</Text>

//             <View style={styles.btnContainer}>
//                 <Text onPress={join} style={styles.button}>
//                     Join Channel
//                 </Text>

//                 <Text onPress={leave} style={styles.button}>
//                     Leave Channel
//                 </Text>
//             </View>

//             <View style={styles.btnContainer}>
//                 <Text>Audience</Text>

//                 <Switch
//                     onValueChange={(value) => {
//                         setIsHost(value);
//                         if (isJoined) {
//                             leave();
//                         }
//                     }}
//                     value={isHost}
//                 />

//                 <Text>Host</Text>
//             </View>

//             <ScrollView
//                 style={styles.scroll}
//                 contentContainerStyle={styles.scrollContainer}
//             >
//                 {isJoined && isHost ? (
//                     <>
//                         <Text>Local user uid: {localUid}</Text>

//                         <RtcSurfaceView
//                             canvas={{ uid: localUid, sourceType: VideoSourceType.VideoSourceCamera }}
//                             style={styles.videoView}
//                         />
//                     </>
//                 ) : (
//                     <Text>Join a channel</Text>
//                 )}

//                 {isJoined && remoteUid !== 0 ? (
//                     <>
//                         <Text>Remote user uid: {remoteUid}</Text>

//                         <RtcSurfaceView
//                             canvas={{ uid: remoteUid, sourceType: VideoSourceType.VideoSourceCamera }}
//                             style={styles.videoView}
//                         />
//                     </>
//                 ) : (
//                     <Text>{isJoined && !isHost ? 'Waiting for remote user to join' : ''}</Text>
//                 )}

//                 <Text style={styles.info}>{message}</Text>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     button: {
//         paddingHorizontal: 25,
//         paddingVertical: 4,
//         fontWeight: 'bold',
//         color: '#ffffff',
//         backgroundColor: '#0055cc',
//         margin: 5,
//     },

//     main: {
//         flex: 1,
//         alignItems: 'center',
//     },

//     scroll: {
//         flex: 1,
//         backgroundColor: '#ddeeff',
//         width: '100%',
//     },

//     scrollContainer: {
//         alignItems: 'center',
//     },

//     videoView: {
//         width: '90%',
//         height: 200,
//     },

//     btnContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },

//     head: {
//         fontSize: 20,
//     },

//     info: {
//         backgroundColor: '#ffffe0',
//         paddingHorizontal: 8,
//         color: '#0000ff',
//     },
// });

// const getPermission = async () => {
//     if (Platform.OS === 'android') {
//         await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//         ]);
//     }
// };

// export default LiveScreen;


import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Switch,
    PermissionsAndroid,
    Platform,
} from 'react-native';

import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    RtcSurfaceView,
    VideoSourceType,
} from 'react-native-agora';

import AsyncStorage from '@react-native-async-storage/async-storage';

const LiveScreen = () => {

    const agoraEngineRef = useRef(null);
    const eventHandler = useRef(null);

    const [isJoined, setIsJoined] = useState(false);
    const [isHost, setIsHost] = useState(true);
    const [remoteUid, setRemoteUid] = useState(0);
    const [message, setMessage] = useState('');
    const [localUidSTATE, setLocalUidSTATE] = useState(null);

    const appId = '5585e4187e7c42a38f304f4c1bfae791';
    const token = '007eJxTYMj6t/DQXRGHefv5G/au0VvzNNvK//KVaxabO9vsdtlb1WkoMJiaWpimmhhamKeaJ5sYJRpbpBkbmKSZJBsmpSWmmlsaLopfmdkQyMjQ/t2SlZEBAkF8FgZHv1AvBgYAp40gFw==';
    const channelName = 'ANUJ';

    const localUid = localUidSTATE;

    /* LOAD USER UID */

    useEffect(() => {

        const loadUser = async () => {

            const id = await AsyncStorage.getItem("userId");

            if (!id) return;

            const numericUid = parseInt(id.slice(-6), 16);

            setLocalUidSTATE(numericUid);

        };

        loadUser();

    }, []);

    /* INIT AGORA */

    useEffect(() => {

        const init = async () => {

            await setupVideoSDKEngine();
            setupEventHandler();

        };

        init();

        return () => {

            cleanupAgoraEngine();

        };

    }, []);

    /* AUTO JOIN */

    useEffect(() => {

        if (localUid) {

            join();

        }

    }, [localUid]);

    const setupEventHandler = () => {

        eventHandler.current = {

            onJoinChannelSuccess: () => {

                console.log("JOIN SUCCESS");

                setMessage('Joined channel');

                setupLocalVideo();

                setIsJoined(true);

            },

            onUserJoined: (_connection, uid) => {

                console.log("REMOTE USER:", uid);

                setRemoteUid(uid);

            },

            onUserOffline: () => {

                setRemoteUid(0);

            },

        };

        agoraEngineRef.current?.registerEventHandler(eventHandler.current);

    };

    const setupVideoSDKEngine = async () => {

        try {

            if (Platform.OS === 'android') {

                await getPermission();

            }

            agoraEngineRef.current = createAgoraRtcEngine();

            const engine = agoraEngineRef.current;

            await engine.initialize({ appId });

            await engine.enableVideo();

        } catch (e) {

            console.log(e);

        }

    };

    const setupLocalVideo = () => {

        agoraEngineRef.current?.startPreview();

    };

    const join = async () => {

        if (isJoined) return;

        try {

            console.log("Joining channel");

            agoraEngineRef.current.joinChannel(
                token,
                channelName,
                localUid,
                {
                    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
                    clientRoleType: isHost
                        ? ClientRoleType.ClientRoleBroadcaster
                        : ClientRoleType.ClientRoleAudience,
                    publishMicrophoneTrack: isHost,
                    publishCameraTrack: isHost,
                    autoSubscribeAudio: true,
                    autoSubscribeVideo: true,
                }
            );

        } catch (e) {

            console.log(e);

        }

    };

    const leave = () => {

        agoraEngineRef.current?.leaveChannel();

        setIsJoined(false);

        setRemoteUid(0);

    };

    const cleanupAgoraEngine = () => {

        if (eventHandler.current) {

            agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);

        }

        agoraEngineRef.current?.release();

    };

    return (

        <SafeAreaView style={styles.main}>

            <View style={styles.btnContainer}>

                <Text onPress={join} style={styles.button}>
                    Join Channel
                </Text>

                <Text onPress={leave} style={styles.button}>
                    Leave Channel
                </Text>

            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* HOST VIEW */}

                {isJoined && isHost && (

                    <RtcSurfaceView
                        canvas={{
                            uid: localUid,
                            sourceType: VideoSourceType.VideoSourceCamera
                        }}
                        style={styles.videoView}
                    />

                )}

                {/* AUDIENCE VIEW */}

                {isJoined && remoteUid !== 0 && (

                    <RtcSurfaceView
                        canvas={{
                            uid: remoteUid,
                            sourceType: VideoSourceType.VideoSourceRemote
                        }}
                        style={styles.videoView}
                    />

                )}

                <Text style={styles.info}>{message}</Text>

            </ScrollView>

        </SafeAreaView>

    );

};

const styles = StyleSheet.create({

    button: {
        paddingHorizontal: 25,
        paddingVertical: 6,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#0055cc',
        margin: 5,
    },

    main: {
        flex: 1,
        alignItems: 'center',
    },

    scroll: {
        flex: 1,
        backgroundColor: '#ddeeff',
        width: '100%',
    },

    scrollContainer: {
        alignItems: 'center',
    },

    videoView: {
        width: '90%',
        height: 220,
    },

    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    info: {
        marginTop: 10,
        color: '#000',
    },

});

const getPermission = async () => {

    if (Platform.OS === 'android') {

        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

    }

};

export default LiveScreen;