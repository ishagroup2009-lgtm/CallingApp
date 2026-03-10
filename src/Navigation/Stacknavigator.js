import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../src/Login';
import Register from '../src/Register';
import Home from '../src/Home';
import Chatscreen from '../src/Chatscreen';
import Videocallscreen from '../src/Videocallscreen';
import Forgetpassword from '../src/Forgetpassword';
import AllCategory from '../src/Shopping/AllCategory';
import Videocallpreview from '../src/Videocallpreview';
import FeedbackVideocall from '../src/FeedbackVideocall';
import VideoCallRequestScreen from '../src/VideoCallRequestScreen';
import LiveScreen from '../src/LiveScreen';
import ProfileScreen from '../src/ProfileScreen';
import Groups from '../src/Groups';
import GroupChat from '../src/GroupChat';























const Stack = createStackNavigator();

const Stacknavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chatscreen" component={Chatscreen} />
            <Stack.Screen name="Forgetpassword" component={Forgetpassword} />
            <Stack.Screen name="AllCategory" component={AllCategory} />

            <Stack.Screen name="Videocallscreen" component={Videocallscreen} />


            <Stack.Screen name="Videocallpreview" component={Videocallpreview} />
            <Stack.Screen name="FeedbackVideocall" component={FeedbackVideocall} />
            <Stack.Screen name="VideoCallRequestScreen" component={VideoCallRequestScreen} />
            <Stack.Screen name="LiveScreen" component={LiveScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="Groups" component={Groups} />
     <Stack.Screen name="GroupChat" component={GroupChat} />

            




























        </Stack.Navigator>
    );
};

export default Stacknavigator;
