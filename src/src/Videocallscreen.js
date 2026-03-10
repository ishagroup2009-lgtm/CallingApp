


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
  Alert,
  BackHandler
} from 'react-native';

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from "react-native";
const screenHeight = Dimensions.get("window").height;
import io from "socket.io-client";
import { navigate } from '../Navigation/navigationRef';

import Icon from "react-native-vector-icons/Ionicons";

const Videocallscreen = ({ navigation, route }) => {

  const socketRef = useRef(null);

  const callerId = route?.params?.callerId || null;

  console.log("CALLER ID >>>>>>>", callerId);
  const agoraEngineRef = useRef(null);
  const eventHandler = useRef(null);

  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [localUidSTATE, setLocalUidSTATE] = useState(null);

  const appId = '5585e4187e7c42a38f304f4c1bfae791';
  const token = '007eJxTYMj6t/DQXRGHefv5G/au0VvzNNvK//KVaxabO9vsdtlb1WkoMJiaWpimmhhamKeaJ5sYJRpbpBkbmKSZJBsmpSWmmlsaLopfmdkQyMjQ/t2SlZEBAkF8FgZHv1AvBgYAp40gFw==';
  const channelName = 'ANUJ';
  const localUid = localUidSTATE;

  console.log("Check ???? localUid", localUid)
  console.log("Check ???? remoteUid", remoteUid)

  useEffect(() => {

    const setupSocket = async () => {

      const userId = await AsyncStorage.getItem("userId");

      socketRef.current = io("https://test-backend-bqhi.onrender.com", {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("VIDEO CALL SOCKET CONNECTED:", socketRef.current.id);

        if (userId) {
          socketRef.current.emit("join", userId);
          console.log("VIDEO CALL ROOM JOIN:", userId);
        }
      });

    };

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
    };

  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    agoraEngineRef.current?.muteLocalAudioStream(newState);
  };

  const toggleCamera = () => {
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    agoraEngineRef.current?.muteLocalVideoStream(!newState);
  };

  const switchCamera = () => {
    agoraEngineRef.current?.switchCamera();
  };

  const confirmEndCall = () => {
    Alert.alert(
      "End Call",
      "Do you want to end the video call?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => leave() }
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const backAction = () => {
      confirmEndCall();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();

  }, []);

  useEffect(() => {

    const loadUser = async () => {

      const id = await AsyncStorage.getItem("userId");

      console.log("idid>>>>>>>", id);

      if (!id) {
        console.log("User ID not found");
        return;
      }

      const numericUid = parseInt(id.slice(-6), 16);
      setLocalUidSTATE(numericUid);
    };

    loadUser();

  }, []);

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

  const setupEventHandler = () => {

    eventHandler.current = {

      onJoinChannelSuccess: () => {

        setMessage('Successfully joined channel: ' + channelName);
        setupLocalVideo();
        setIsJoined(true);

      },

      onUserJoined: (_connection, uid) => {

        console.log("REMOTE USER JOINED", uid);

        setTimeout(() => {
          setRemoteUid(uid);
        }, 300);

      },

      onUserOffline: (_connection, uid) => {

        setMessage('Remote user ' + uid + ' left the channel');
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
      const agoraEngine = agoraEngineRef.current;

      await agoraEngine.initialize({ appId: appId });

      await agoraEngine.enableVideo();

    } catch (e) {
      console.log(e);
    }
  };

  const setupLocalVideo = () => {

    agoraEngineRef.current?.enableVideo();
    agoraEngineRef.current?.startPreview();

  };

  const join = async () => {

    if (isJoined) return;

    if (!localUid) {
      showMessage("User id not loaded yet");
      return;
    }

    try {

      if (isHost) {

        agoraEngineRef.current?.joinChannel(
          token,
          channelName,
          localUid,
          {
            channelProfile: ChannelProfileType.ChannelProfileCommunication,
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            publishMicrophoneTrack: true,
            publishCameraTrack: true,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
          }
        );

      } else {

        agoraEngineRef.current?.joinChannel(
          token,
          channelName,
          localUid,
          {
            channelProfile: ChannelProfileType.ChannelProfileCommunication,
            clientRoleType: ClientRoleType.ClientRoleAudience,
            publishMicrophoneTrack: false,
            publishCameraTrack: false,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
          }
        );

      }

    } catch (e) {
      console.log(e);
    }
  };

  // const leave = () => {

  //   try {

  //     agoraEngineRef.current?.leaveChannel();
  //     setRemoteUid(0);
  //     setIsJoined(false);
  //     showMessage('Left the channel');
  //     navigation.goBack();

  //   } catch (e) {
  //     console.log(e);
  //   }

  // };


  const leave = async () => {

    try {

      const myUserId = await AsyncStorage.getItem("userId");

      if (socketRef.current && callerId && myUserId) {

        socketRef.current.emit("endVideoCall", {
          callerId: myUserId,
          receiverId: callerId
        });

        console.log("END CALL EMITTED");
      }

      agoraEngineRef.current?.leaveChannel();

      setRemoteUid(0);
      setIsJoined(false);

      showMessage('Left the channel');

      navigate("Home", { userId: myUserId });

    } catch (e) {
      console.log(e);
    }

  };


  useEffect(() => {

    if (localUid) {
      join();
    }

  }, [localUid]);

  const cleanupAgoraEngine = () => {

    agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);
    agoraEngineRef.current?.release();

  };

  function showMessage(msg) {
    setMessage(msg);
  }

  return (

    <SafeAreaView style={styles.main}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >

        {isJoined && isHost ? (

          <RtcSurfaceView
            canvas={{
              uid: localUid,
              sourceType: VideoSourceType.VideoSourceCamera,
            }}
            style={styles.videoView}
          />

        ) : (
          <Text>Join a channel</Text>
        )}

        {isJoined && remoteUid !== 0 ? (

          <RtcSurfaceView
            canvas={{
              uid: remoteUid
            }}
            style={styles.videoView}
          />

        ) : (
          <Text>
            {isJoined && !isHost
              ? 'Waiting for remote user to join'
              : ''}
          </Text>
        )}

      </ScrollView>

      <View style={styles.callControls}>

        <Icon
          name={isMuted ? "mic-off" : "mic"}
          size={28}
          color="white"
          style={styles.controlBtn}
          onPress={toggleMute}
        />

        <Icon
          name={isCameraOn ? "videocam" : "videocam-off"}
          size={28}
          color="white"
          style={styles.controlBtn}
          onPress={toggleCamera}
        />

        <Icon
          name="camera-reverse"
          size={28}
          color="white"
          style={styles.controlBtn}
          onPress={switchCamera}
        />

        <Icon
          name="call"
          size={28}
          color="white"
          style={styles.endCallBtn}
          onPress={confirmEndCall}
        />

      </View>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({

  main: { flex: 1 },

  scroll: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },

  scrollContainer: {
    alignItems: 'center',
  },

  videoView: {
    width: '100%',
    height: screenHeight / 2.2,
  },

  callControls: {

    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"

  },

  controlBtn: {

    backgroundColor: "#333",
    padding: 14,
    borderRadius: 40,
    overflow: "hidden"

  },

  endCallBtn: {

    backgroundColor: "red",
    padding: 16,
    borderRadius: 40,
    overflow: "hidden"

  }

});

const getPermission = async () => {

  if (Platform.OS === 'android') {

    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);

  }

};

export default Videocallscreen;