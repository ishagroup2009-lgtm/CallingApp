// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';


// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Background Message:', remoteMessage);
// });


// AppRegistry.registerComponent(appName, () => App);
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import io from "socket.io-client";
import { navigationRef, navigate } from './src/Navigation/navigationRef';
import { Linking } from 'react-native';
// 🔥 Background + Kill Mode Handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Background/Kill Message:', remoteMessage);

//     await notifee.createChannel({
//         id: 'default',
//         name: 'Default Channel',
//         importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//         title: remoteMessage.notification?.title || "Notification",
//         body: remoteMessage.notification?.body || "You have a new message",
//         android: {
//             channelId: 'default',
//             smallIcon: 'ic_launcher',
//         },
//     });
// });

// messaging().setBackgroundMessageHandler(async remoteMessage => {

//     const isVideoCall = remoteMessage.data?.type === "video_call";

//     await notifee.createChannel({
//         id: 'default',
//         name: 'Default Channel',
//         importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//         title: remoteMessage.notification?.title || "Notification",
//         body: remoteMessage.notification?.body || "You have a new message",
//         android: {
//             channelId: 'default',
//             smallIcon: 'ic_launcher',

//             ...(isVideoCall && {
//                 importance: AndroidImportance.HIGH,
//                 actions: [
//                     {
//                         title: 'Accept',
//                         pressAction: { id: 'accept' },
//                     },
//                     {
//                         title: 'Reject',
//                         pressAction: { id: 'reject' },
//                     },
//                 ],
//             }),
//         },
//     });

// });

const socket = io("https://test-backend-bqhi.onrender.com", {
    transports: ["websocket"],
});

notifee.onBackgroundEvent(async ({ type, detail }) => {

    console.log("BACKGROUND EVENT:", type);
    console.log("ACTION ID:", detail.pressAction?.id);

    if (type === EventType.PRESS) {

        if (detail.notification?.data?.type === "video_call") {

            const callerId = detail.notification?.data?.callerId;

            Linking.openURL(`myapp://VideoCallRequestScreen?callerId=${callerId}`);

        }


        if (detail.notification?.data?.type === "user_live") {



            Linking.openURL(`myapp://LiveScreen?role=audience`);

        }

    }


    if (type === EventType.ACTION_PRESS) {

        if (detail.pressAction.id === "accept") {

            console.log("BACKGROUND ACCEPT PRESSED");

            socket.emit("acceptVideoCall", {
                callerId: detail.notification?.data?.callerId
            });
            // navigate("Videocallscreen");
            Linking.openURL("myapp://videocall");


        }

        if (detail.pressAction.id === "reject") {

            console.log("BACKGROUND REJECT PRESSED");

            socket.emit("rejectVideoCall", {
                callerId: detail.notification?.data?.callerId
            });

        }

    }

});

messaging().setBackgroundMessageHandler(async remoteMessage => {

    const type = remoteMessage.data?.type;
    const isVideoCall = type === "video_call";

    await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
        title:
            remoteMessage.notification?.title ||
            remoteMessage.data?.title ||
            "Notification",

        body:
            remoteMessage.notification?.body ||
            remoteMessage.data?.body ||
            "",

        data: remoteMessage.data,   // 🔥 IMPORTANT ADD THIS

        android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',

            // 🔥 agar video call hai tab hi buttons
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

AppRegistry.registerComponent(appName, () => App);