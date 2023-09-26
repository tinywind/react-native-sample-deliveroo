import React from 'react';
import Restaurant from './src/screens/Restaurant';
import First from './src/screens/First';
import PreparingOrder from './src/screens/PreparingOrder';
import Delivery from './src/screens/Delivery';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/contexts/store/store';

export type NavigationParameters = {
  First: undefined;
  Restaurant: { id: string };
  PreparingOrder: undefined;
  Delivery: undefined;
};

export type Navigation = NavigationProp<NavigationParameters>;

const Stack = createNativeStackNavigator<NavigationParameters>();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='First' screenOptions={{}}>
          <Stack.Screen name='First' component={First} />
          <Stack.Screen name='Restaurant' component={Restaurant} />
          <Stack.Screen name='PreparingOrder' component={PreparingOrder} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name='Delivery' component={Delivery} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}
