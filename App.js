// import React, { useEffect } from 'react';
// import { StyleSheet, Text, View, StatusBar } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import Stacknavigator from './src/Navigation/Stacknavigator';
// import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';


// const App = () => {
//   useEffect(() => {
//     requestPermission();
//   }, []);
//   async function requestPermission() {
//     const authStatus = await messaging().requestPermission();
//     console.log('Permission status:', authStatus);
//   }

//   ;

//   return (
//     <SafeAreaProvider>

//       <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

//         <NavigationContainer >
//           <Stacknavigator />
//         </NavigationContainer>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//   }
// });
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Stacknavigator from './src/Navigation/Stacknavigator';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigationRef, navigate } from './src/Navigation/navigationRef';
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

const App = () => {
  const socketRef = useRef(null);

  const linking = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Videocallscreen: 'videocall',
        LiveScreen: 'LiveScreen',
        VideoCallRequestScreen: {
          path: 'VideoCallRequestScreen',
          parse: {
            callerId: (callerId) => callerId,
          },
        },
      },
    },
  };

  useEffect(() => {

    socketRef.current = io("https://test-backend-bqhi.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", async () => {
      console.log("GLOBAL SOCKET CONNECTED:", socketRef.current.id);

      const userId = await AsyncStorage.getItem("userId");

      console.log("JOIN USER:", userId);

      if (userId) {
        socketRef.current.emit("join", userId);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };

  }, []);

  // useEffect(() => {

  //   return notifee.onForegroundEvent(({ type, detail }) => {

  //     console.log("detaildetail", detail)

  //     if (type === 1) {

  //       if (detail.pressAction.id === 'accept') {
  //         console.log("Call Accepted");
  //         socketRef.current.emit("acceptVideoCall", {
  //           callerId: detail.notification?.data?.callerId
  //         });
  //       }

  //       if (detail.pressAction.id === 'reject') {
  //         console.log("Call Rejected");
  //         socketRef.current.emit("rejectVideoCall", {
  //           callerId: detail.notification?.data?.callerId
  //         });
  //       }

  //     }

  //   });

  // }, []);
  useEffect(() => {

    return notifee.onForegroundEvent(({ type, detail }) => {

      console.log("EVENT TYPE:", type);
      console.log("PRESS ID:", detail.pressAction?.id);



      if (type === EventType.PRESS) {

        console.log("NOTIFICATION CLICKED");

        if (detail.notification?.data?.type === "video_call") {
          navigate("VideoCallRequestScreen", {
            callerId: detail.notification?.data?.callerId
          });
        }

        if (detail.notification?.data?.type === "user_live") {
          navigate("LiveScreen", {
            role: "audience"
          });
        }

      }


      if (type === EventType.ACTION_PRESS) {

        if (detail.pressAction.id === "accept") {

          console.log("ACCEPT BUTTON CLICKED");

          socketRef.current.emit("acceptVideoCall", {
            callerId: detail.notification?.data?.callerId
          });
          navigate("Videocallscreen", { callerId: detail.notification?.data?.callerId });


        }

        if (detail.pressAction.id === "reject") {

          console.log("REJECT BUTTON CLICKED");

          socketRef.current.emit("rejectVideoCall", {
            callerId: detail.notification?.data?.callerId
          });

        }

      }

    });

  }, []);


  useEffect(() => {

    const setupNotifications = async () => {
      await messaging().requestPermission();

      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };

    setupNotifications();

    // 🔥 Foreground Notification
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('Foreground Message:', remoteMessage);

    //   await notifee.displayNotification({
    //     title: remoteMessage.notification?.title || "Notification",
    //     body: remoteMessage.notification?.body || "You have a new message",
    //     android: {
    //       channelId: 'default',
    //       smallIcon: 'ic_launcher',
    //     },
    //   });
    // });

    // return unsubscribe;
    // const unsubscribe = messaging().onMessage(async remoteMessage => {

    //   const isVideoCall = remoteMessage.data?.type === "video_call";

    //   await notifee.displayNotification({
    //     title: remoteMessage.notification?.title || "Notification",
    //     body: remoteMessage.notification?.body || "You have a new message",
    //     data: remoteMessage.data,
    //     android: {
    //       channelId: 'default',
    //       smallIcon: 'ic_launcher',

    //       ...(isVideoCall && {
    //         importance: AndroidImportance.HIGH,
    //         actions: [
    //           {
    //             title: 'Accept',
    //             pressAction: { id: 'accept' },
    //           },
    //           {
    //             title: 'Reject',
    //             pressAction: { id: 'reject' },
    //           },
    //         ],
    //       }),
    //     },
    //   });
    // });
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const type = remoteMessage.data?.type;
      console.log("remoteMessage>>>>>>>>", remoteMessage?.data?.callerId)

      const callerId = remoteMessage?.data?.callerId

      const userId = await AsyncStorage.getItem("userId");

      console.log("typetype??????", type)

      // ✅ USER A foreground me
      if (type === "call_accepted") {
        navigate("Videocallscreen", { callerId });
        return;
      }

      if (type === "call_rejected") {
        ToastAndroid.show("User Declined Your Call", ToastAndroid.LONG);
        navigate("Home", { userId });
        return;
      }

      if (type === "call_ended") {
        ToastAndroid.show("User Ended the Video Call", ToastAndroid.LONG);
        navigate("Home", { userId });
        return;
      }




      const isVideoCall = type === "video_call";

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || remoteMessage.data?.title || "Notification",
        body: remoteMessage.notification?.body || remoteMessage.data?.body || "",
        data: remoteMessage.data,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',

          ...(isVideoCall && {
            importance: AndroidImportance.HIGH,
            actions: [
              { title: 'Accept', pressAction: { id: 'accept' } },
              { title: 'Reject', pressAction: { id: 'reject' } },
            ],
          }),
        },
      });

    });

    return unsubscribe

  }, []);

  useEffect(() => {

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.type === "call_accepted") {
        navigate("Videocallscreen");
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.type === "call_accepted") {
          navigate("Videocallscreen");
        }
      });

  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef} linking={linking}>
          <Stacknavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;