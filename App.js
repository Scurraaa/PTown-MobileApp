import React from 'react';
import Providers from './src/navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <Providers />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  )
}
