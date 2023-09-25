import React from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationParameters } from '../../App';

export default function PreparingOrder({ navigation, route }: NativeStackScreenProps<NavigationParameters, 'PreparingOrder'>) {
  return (
    <View>
      <Text>abc</Text>
    </View>
  );
}
