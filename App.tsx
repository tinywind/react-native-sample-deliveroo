import React from 'react';
import Main from './src/screens/Main';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <>
      <View className='flex-1 items-center justify-center bg-white'>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style='auto' />
      </View>
      {/*<Main />*/}
    </>
  );
}