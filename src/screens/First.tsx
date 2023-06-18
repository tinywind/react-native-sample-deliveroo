import React, { useLayoutEffect, useRef } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { NavigationParameters } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ColorSchemeScreen from '../components/ColorSchemeScreen';
import { ChevronDownIcon, UserIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

function Header() {
  return (
    <View className={`mx-4 flex-row items-center space-x-2 px-2 pb-3`}>
      <Image source={{ uri: 'https://links.papareact.com/wru' }} className={`h-7 w-7 rounded-full bg-gray-300 p-4`} />

      <View className={`flex-1`}>
        <Text className={`text-xs font-bold text-gray-400`}>Deliver Now!</Text>
        <View className={`flex-row`}>
          <Text className={`text-xl font-bold`}>Current Location</Text>
          {/* TODO: padding을 사용하지 않고 `Current Location` 가운데 선을 맞추는 방법은? */}
          <View className={`pt-1.5`}>
            <ChevronDownIcon size={20} color={`#0CB`} />
          </View>
        </View>
      </View>

      <UserIcon size={35} color={`#0CB`} />
    </View>
  );
}

function SearchBar() {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className={`mx-4 flex-row items-center space-x-2 px-2 pb-2`}>
      <Pressable className={`w-full flex-row space-x-2 bg-gray-200 p-3`} onPress={() => inputRef.current?.focus()}>
        <MagnifyingGlassIcon size={25} color={`gray`} />
        <TextInput ref={inputRef} placeholder={`Restaurants and cuisines`} keyboardType={'default'} className={`flex-1`} />

        <AdjustmentsHorizontalIcon size={25} color={`#0CB`} />
      </Pressable>
    </View>
  );
}

export default function First({ navigation }: NativeStackScreenProps<NavigationParameters, 'First'>) {
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <>
      <ColorSchemeScreen className={`bg-white pt-5`}>
        <Header />
        <SearchBar />
      </ColorSchemeScreen>
    </>
  );
}
