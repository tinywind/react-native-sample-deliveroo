import React from 'react';
import Main from './src/screens/Main';
import First from './src/screens/First';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

export type NavigationParameters = {
  First: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<NavigationParameters>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='First' screenOptions={{}}>
        <Stack.Screen name='First' component={First} />
        <Stack.Screen name='Main' component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
