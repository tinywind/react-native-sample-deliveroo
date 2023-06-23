import React from 'react';
import Restaurant from './src/screens/Restaurant';
import First from './src/screens/First';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/contexts/store/store';

export type NavigationParameters = {
  First: undefined;
  Restaurant: { id: string };
};

const Stack = createNativeStackNavigator<NavigationParameters>();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='First' screenOptions={{}}>
          <Stack.Screen name='First' component={First} />
          <Stack.Screen name='Restaurant' component={Restaurant} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}
