import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {

  // ✅ ALL HOOKS AT TOP (VERY IMPORTANT)
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ helper
  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  }

  // useEffect(() => {
  //   getFCMToken();
  // }, []);

  // const getFCMToken = async () => {
  //   const token = await messaging().getToken();
  //   console.log('FCM TOKEN:', token);

  //   // 👇 Ye token backend API me save karo
  //   // await axios.post('/save-token', { token });
  // };


  const saveTokenToBackend = async (userId) => {
    try {
      await messaging().requestPermission();

      const token = await messaging().getToken();
      console.log("FCM TOKEN:", token);

      await axios.post(
        "https://test-backend-bqhi.onrender.com/api/save-token",
        {
          userId,
          token,
        }
      );

      console.log("Token saved ✅");
    } catch (error) {
      console.log("Token error ❌", error);
    }
  };

  // ✅ login handler
  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Email and Password required')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        'https://test-backend-bqhi.onrender.com/api/login',
        {
          email: email.trim(),
          password,
        }
      )

      showToast(response.data.message || 'Login successful')

      // optional: token / userId
      console.log('TOKEN:', response.data.token)
      console.log('USER ID:', response.data.userId)
      const userId = response.data.userId;
      await AsyncStorage.setItem("userId", userId.toString());
      await saveTokenToBackend(userId);
      navigation.navigate('Home', {
        userId: response.data.userId,
      })

    } catch (error) {
      const msg =
        error.response?.data?.message || 'Something went wrong'
      showToast(msg)
    } finally {
      setLoading(false)
    }
  }

  // ❌ NO HOOKS BELOW THIS LINE

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.heading}>Welcome Back ❤️</Text>
      <Text style={styles.subHeading}>Login to continue</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.forgot} onPress={() => navigation.navigate("AllCategory")}>Forgot Password?</Text>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Login
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f4',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff4d6d',
  },
  subHeading: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff4d6d',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  forgot: {
    textAlign: 'center',
    marginTop: 15,
    color: '#ff4d6d',
    fontWeight: '500',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#555',
    fontSize: 14,
  },
  registerLink: {
    color: '#ff4d6d',
    fontSize: 14,
    fontWeight: 'bold',
  },
})
