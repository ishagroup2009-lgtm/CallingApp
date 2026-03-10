import { StyleSheet, View, Image } from 'react-native'
import React from 'react'

const Forgetpassword = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../Assets/Images/heyllo.webp')}
                style={styles.banner}
                resizeMode="cover"
            />
        </View>
    )
}

export default Forgetpassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
})
