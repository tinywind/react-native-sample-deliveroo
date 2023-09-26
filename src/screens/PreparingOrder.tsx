import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationParameters } from '../../App';
import ColorSchemeScreen from '../components/ColorSchemeScreen';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';

export default function PreparingOrder({ navigation, route }: NativeStackScreenProps<NavigationParameters, 'PreparingOrder'>) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Delivery');
    }, 1000);
  }, []);

  return (
    <ColorSchemeScreen className={`items-center justify-center bg-[#0CB]`}>
      <Animatable.Image source={require('../../assets/pizza-2661933_1280.png')} animation={'slideInUp'} iterationCount={1} className={`h-96 w-96`} />
      <Animatable.Text animation={'slideInUp'} iterationCount={1} className={`text-center text-lg font-bold text-white`}>
        Waiting for Restaurant to accept your order
      </Animatable.Text>

      <Progress.Circle size={60} indeterminate={true} color={'white'} />
    </ColorSchemeScreen>
  );
}
