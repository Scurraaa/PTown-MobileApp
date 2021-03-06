import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Loading({ size }) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={size} color='#6646EE'/>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});