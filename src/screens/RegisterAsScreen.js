import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FormButton from '../components/FormButton';

const { width } = Dimensions.get('screen');


export default function RegisterAs({ navigation }) {
    return (
        <View style={styles.container}>
            <FormButton
                title='Register as Customer'
                modeValue='contained'
                labelStyle={styles.buttonLabel}
                onPress={() => navigation.navigate('Signup', {
                    registerAs: 'customer'
                })}>
            </FormButton>
            <FormButton
                title='Apply for Listing of Barbershop'
                modeValue='contained'
                labelStyle={styles.buttonLabel}
                onPress={() => navigation.navigate('BarberSignup', {
                    registerAs: 'barbershop'
                })}>
            </FormButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLabel: {
        fontSize: 18,
    },
    notAvailButton: {
        backgroundColor: '#626262',
        marginTop: 10,
    }
})