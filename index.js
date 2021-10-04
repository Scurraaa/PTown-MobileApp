import * as React from 'react'
import { AppRegistry } from 'react-native'
import { Proviser as PaperProvider } from 'react-native-paper'
import { expo } from './app.json'
import App from './src/App'

export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    )
}

AppRegistry.registerComponent(expo.name, () => Main);