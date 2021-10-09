import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';

export default function HomeScreen({ navigation })  {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 40
    }
})