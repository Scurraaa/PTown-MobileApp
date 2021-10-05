import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BarberShopScreen({ navigation })  {
    return (
        <View style={styles.container}>
            <Text>List of Barbershop</Text>
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