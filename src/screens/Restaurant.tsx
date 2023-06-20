import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ColorSchemeScreen from '../components/ColorSchemeScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationParameters } from '../../App';
import { Dish, getRestaurant, Restaurant as RestaurantType } from '../utils/dataLoader';
import Spinner from 'react-native-loading-spinner-overlay';
import { ArrowLeftIcon, ChevronRightIcon, MapPinIcon, QuestionMarkCircleIcon } from 'react-native-heroicons/outline';
import { MinusCircleIcon, PlusCircleIcon, StarIcon } from 'react-native-heroicons/solid';
import Currency from 'react-currency-formatter';
import cn from 'classnames';

function DishRow({ dish }: { dish: Dish }) {
  const [pressed, setPressed] = useState(false);

  return (
    <View className={cn(pressed && `border-y`, `border-gray-300 p-4`)}>
      <TouchableOpacity onPress={() => setPressed(true)} className={cn(`flex-row justify-between space-x-2 pb-2`)}>
        <View className={`flex-1 flex-col`}>
          <Text className={`mb-1 text-lg font-bold`}>{dish.name}</Text>
          <Text className={`mb-1 italic text-gray-500 opacity-50`}>Damn! no descriptions!</Text>
          <Text className={`mb-1 text-gray-500`}>
            <Currency quantity={dish.price || 10} currency={'USD'} />
          </Text>
        </View>
        <Image source={{ uri: dish.photoUrl }} className={`h-20 w-20 border-2 bg-gray-300 py-4`} />
      </TouchableOpacity>
      {pressed && (
        <View className={`bg-white`}>
          <View className={`flex-row items-center space-x-2`}>
            <TouchableOpacity>
              <MinusCircleIcon size={40} color={`#0CB`} opacity={0.5} />
            </TouchableOpacity>
            <Text>0</Text>
            <TouchableOpacity>
              <PlusCircleIcon size={40} color={`#0CB`} opacity={0.5} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function Restaurant({ navigation, route }: NativeStackScreenProps<NavigationParameters, 'Restaurant'>) {
  const [restaurant, setRestaurant] = useState<RestaurantType | undefined>(undefined);
  const restaurantId = route.params.id;
  useEffect(() => {
    getRestaurant(restaurantId).then(res => setRestaurant(res));
  }, []);
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return !restaurant ? (
    <Spinner visible={true} textContent={'Data Fetching...'} textStyle={{ color: '#FFF' }} />
  ) : (
    <ColorSchemeScreen>
      <ScrollView>
        <View className={`relative`}>
          <Image source={{ uri: restaurant.heroImgUrl }} className={`h-56 w-full bg-gray-300 p-4`} />
          <TouchableOpacity onPress={() => navigation.goBack()} className={`absolute left-5 top-14 rounded-full bg-gray-100 p-2`}>
            <ArrowLeftIcon size={20} color={`#0CB`} />
          </TouchableOpacity>
        </View>
        <View className={`bg-white`}>
          <View className={`px-4 pt-4`}>
            <Text className={`text-3xl font-bold`}>{restaurant.name}</Text>
            <View className={`my-1 flex-row items-center space-x-2`}>
              <View className={`flex-row items-center space-x-1`}>
                <StarIcon size={22} color={`green`} opacity={0.5} />
                <Text className={`text-xs text-green-500`}>{restaurant.averageRating}</Text>
                <Text> · Offers</Text>
              </View>
              <View className={`flex-row items-center space-x-1`}>
                <MapPinIcon size={22} color={`gray`} opacity={0.5} />
                <Text className={`text-xs text-gray-500`}>NearBy</Text>
                <Text> · {restaurant.address}</Text>
              </View>
            </View>

            <Text className={`mt-2 pb-4 text-gray-500`}>{restaurant.description}</Text>
          </View>

          <TouchableOpacity className={`flex-row items-center space-x-2 border-y border-gray-300 p-4`}>
            <QuestionMarkCircleIcon size={20} color={`gray`} opacity={0.5} />
            <Text className={`text-gray-500`}>Have a food allergy?</Text>
            <View className={`android:pt-1`}>
              <ChevronRightIcon size={15} color={`#0CB`} />
            </View>
          </TouchableOpacity>

          <View>
            <Text className={`bg-gray-100 px-4 py-6 text-xl font-bold`}>Menu</Text>
            {restaurant.dishes?.map((dish, index) => (
              <DishRow key={index} dish={dish} />
            ))}
          </View>
        </View>
      </ScrollView>
    </ColorSchemeScreen>
  );
}
