import React from 'react';
import Main from './src/screens/Main';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';

export default function App() {
  return (
    <>
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <Text className={`italic text-fuchsia-500 text-opacity-25 ring-offset-rose-700`}>Open up App.js to start working on your app!</Text>
        <StatusBar style='auto' />
      </View>
      {/*<Main />*/}
    </>
  );
}
