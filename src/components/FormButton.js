import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { SCREEN_HEIGHT } from '../utils/constants';



export default function FormButton({ title, modeValue, buttonStyle, ...rest}) {
    return (
        <Button 
        {...rest}
        mode={modeValue}
        style={buttonStyle ? buttonStyle : styles.button}
        contentStyle={styles.buttonContainer}
        >
            { title }
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10
    },
    buttonContainer: {
        height: SCREEN_HEIGHT / 18
    }
});