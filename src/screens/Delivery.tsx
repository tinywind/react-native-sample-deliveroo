import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationParameters } from '../../App';
import ColorSchemeScreen from '../components/ColorSchemeScreen';
import * as Progress from 'react-native-progress';
import { useAppSelector } from '../contexts/store/store';
import { getRestaurant, Restaurant as RestaurantType } from '../utils/dataLoader';
import { XMarkIcon } from 'react-native-heroicons/outline';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, { Marker } from 'react-native-maps';

export default function Delivery({ navigation, route }: NativeStackScreenProps<NavigationParameters, 'Delivery'>) {
  const { restaurantId } = useAppSelector(state => state.basket);
  const [restaurant, setRestaurant] = useState<RestaurantType | undefined>(undefined);

  useEffect(() => {
    if (restaurantId === undefined)
      return Alert.alert('Error', 'Restaurant ID is undefined', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('First'),
        },
      ]);
    getRestaurant(restaurantId).then(res => setRestaurant(res));
  }, []);

  return !restaurant ? (
    <Spinner visible={true} textStyle={{ color: '#FFF' }} />
  ) : (
    <ColorSchemeScreen className={`z-50 bg-[#0CB]`}>
      <View className={`flex-row items-center justify-between p-5`}>
        <TouchableOpacity onPress={() => navigation.navigate('First')}>
          <XMarkIcon color={'white'} size={30} />
        </TouchableOpacity>
        <Text className={`text-lg font-light text-white`}>Order help</Text>
      </View>

      <View className={`z-50 mx-5 my-2 rounded-md bg-white p-6 shadow-md`}>
        <View className={`flex-row justify-between`}>
          <View>
            <Text className={`text-lg text-gray-500`}>Estimated Time</Text>
            <Text className={`text-4xl font-bold`}>45-55 Minutes</Text>
          </View>
          <Image source={{ uri: 'https://links.papareact.com/fls' }} className={`h-20 w-20`} />
        </View>

        <Progress.Bar size={30} indeterminate={true} color={'#0CB'} />
        <View className={`mt-3 flex-row`}>
          <Text className={`text-gray-500`}>Your order at </Text>
          <Text className={`font-bold text-black`}>{restaurant.name}</Text>
          <Text className={`text-gray-500`}> is being prepared</Text>
        </View>
      </View>

      <MapView
        initialRegion={{
          latitude: parseFloat(restaurant.latitude ?? '0'),
          longitude: parseFloat(restaurant.longitude ?? '0'),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        className={`z-0 -mt-10 flex-1`}
        mapType={'mutedStandard'}>
        <Marker
          coordinate={{
            latitude: parseFloat(restaurant.latitude ?? '0'),
            longitude: parseFloat(restaurant.longitude ?? '0'),
          }}
          title={restaurant.name}
          description={restaurant.description}
          identifier={'origin'}
          pinColor={'#0CB'}
        />
      </MapView>

      <SafeAreaView className={`h-20 flex-row items-center space-x-5 bg-white`}>
        <Image source={{ uri: 'https://links.papareact.com/wru' }} className={`ml-5 h-12 w-12 rounded-full bg-gray-300 p-4`} />
        <View className={`flex-1`}>
          <Text className={`text-lg`}>tinywind</Text>
          <Text className={`text-gray-500`}>Your Rider</Text>
        </View>
        <Text className={`mr-5 text-lg font-bold text-[#0CB]`}>Call</Text>
      </SafeAreaView>
    </ColorSchemeScreen>
  );
}
