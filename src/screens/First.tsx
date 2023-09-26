import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationParameters } from '../../App';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import ColorSchemeScreen from '../components/ColorSchemeScreen';
import { AdjustmentsHorizontalIcon, ArrowRightIcon, ChevronDownIcon, CurrencyDollarIcon, MagnifyingGlassIcon, TagIcon, UserIcon } from 'react-native-heroicons/outline';
import tw from 'twrnc';
import { ImageSourcePropType } from 'react-native/Libraries/Image/Image';
import { StarIcon } from 'react-native-heroicons/solid';
import { TailwindProps } from '../types';
import cn from 'classnames';
import { Category, createTables, getAllCategories, getAllRestaurants } from '../utils/dataLoader';
import Spinner from 'react-native-loading-spinner-overlay';

function BannerRow() {
  return (
    <View className={`mx-4 flex-row items-center space-x-2 pb-3`}>
      <Image source={{ uri: 'https://links.papareact.com/wru' }} className={`h-7 w-7 rounded-full bg-gray-300 p-4`} />

      <View className={`flex-1`}>
        <Text className={`text-xs font-bold text-gray-400`}>Deliver Now!</Text>
        <View className={`flex-row items-center`}>
          <Text className={`text-xl font-bold`}>Current Location</Text>
          <View className={`android:pt-1.5`}>
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
    <View className={`mx-4 flex-row items-center space-x-2 pb-2`}>
      <Pressable className={`w-full flex-row space-x-2 bg-gray-200 p-3`} onPress={() => inputRef.current?.focus()}>
        <MagnifyingGlassIcon size={25} color={`gray`} />
        <TextInput ref={inputRef} placeholder={`Restaurants and cuisines`} keyboardType={'default'} className={`flex-1`} />

        <AdjustmentsHorizontalIcon size={25} color={`#0CB`} />
      </Pressable>
    </View>
  );
}

type CategoryProps = { title: string; imageSource: ImageSourcePropType };

function Categories({ categories }: { categories: CategoryProps[] }) {
  function Card({ title, imageSource }: CategoryProps) {
    return (
      <TouchableOpacity className={`relative mr-2`}>
        <Image source={imageSource} className={`h-20 w-20 rounded`} />
        <View className={`absolute bottom-1 w-full items-center font-bold text-white`}>
          <Text className={`font-bold capitalize text-white`}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView className={`mx-2 flex-row space-x-2 pb-2`} horizontal={true} contentContainerStyle={tw`py-3 pt-2`}>
      {categories.map((category, index) => (
        <Card key={index} {...category} />
      ))}
    </ScrollView>
  );
}

type FeaturedCardProps = {
  restaurantId: string;
  title: string;
  imageSource: ImageSourcePropType;
  rating: number;
  categories: Category[];
  priceTag: string;
};
type FeaturedRowProps = { title: string; description?: string; items: FeaturedCardProps[] };

function FeaturedRows({ navigation, rows }: { navigation: NativeStackNavigationProp<NavigationParameters, 'First'>; rows: FeaturedRowProps[] }) {
  function Card({ restaurantId, title, imageSource, categories, rating, priceTag }: FeaturedCardProps) {
    return (
      <TouchableOpacity className={`mr-3 rounded bg-white shadow-sm`} activeOpacity={0.5} onPress={() => navigation.navigate('Restaurant', { id: restaurantId })}>
        <Image source={imageSource} className={`h-36 w-64 rounded`} />
        <View className={`w-full px-2 py-2 pb-5`}>
          <Text className={`w-52 pt-1 text-xl font-bold capitalize text-gray-800`} numberOfLines={1}>
            {title}
          </Text>
          <View className={`flex-row items-center`}>
            <View className={`flex-row`}>
              <StarIcon size={22} color={'lime'} opacity={0.5} />
              <Text className={`pl-2 text-lime-700`}>{Math.round(rating * 10) / 10}</Text>
            </View>
            <Text className={`text-gray-700`}> · Offers</Text>
          </View>
          <View className={`flex-row items-center`}>
            <TagIcon color={'gray'} size={22} opacity={0.5} />
            <Text className={`w-52 pl-2 text-gray-700`} numberOfLines={1}>
              Categories · {categories.map(category => category).join(', ')}
            </Text>
          </View>
          <View className={`flex-row items-center`}>
            <CurrencyDollarIcon color={'gray'} size={22} opacity={0.5} />
            <Text className={`w-52 pl-2 text-gray-700`} numberOfLines={1}>
              Price · {priceTag}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function Row({ title, description, items }: FeaturedRowProps) {
    return (
      <>
        <TouchableOpacity>
          <View className={`flex-row items-center justify-between`}>
            <Text className={`text-2xl font-bold`}>{title}</Text>
            <View className={`android:pt-1 pl-2`}>
              <ArrowRightIcon size={20} color={'#0CB'} />
            </View>
          </View>
          {description && <Text className={`italic text-gray-600`}>{description}</Text>}
        </TouchableOpacity>
        <ScrollView className={`mx-2 flex-row space-x-2 pb-2`} horizontal={true} contentContainerStyle={tw`py-3 pt-2`}>
          {items.map((item, index) => (
            <Card key={index} {...item} />
          ))}
        </ScrollView>
      </>
    );
  }

  return <>{rows.map((row, index) => (row.items.length ? <Row key={index} {...row} /> : <React.Fragment key={index} />))}</>;
}

function Header2({ className, ...props }: TailwindProps) {
  return (
    <View className={cn(className, `bg-white pt-2`)} {...props}>
      <View>
        <BannerRow />
        <SearchBar />
      </View>
    </View>
  );
}

function Body({
  className,
  navigation,
  ...props
}: TailwindProps & {
  navigation: NativeStackNavigationProp<NavigationParameters, 'First'>;
}) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [restaurants, setRestaurants] = useState<FeaturedCardProps[]>([]);

  const setup = async () => {
    await createTables();
    setCategories(
      (await getAllCategories()).map(category => ({
        title: category,
        imageSource: { uri: `https://source.unsplash.com/300x300/?food,dish,cuisine,${category}` },
      })),
    );
    setRestaurants(
      (await getAllRestaurants()).map(restaurant => ({
        restaurantId: restaurant.restaurantId,
        title: restaurant.name,
        imageSource: { uri: restaurant.heroImgUrl },
        rating: restaurant.averageRating || 0,
        categories: restaurant.categories || [],
        priceTag: restaurant.priceTag || '$',
      })),
    );
  };

  useEffect(() => {
    setup();
  }, []);

  return !categories.length || !restaurants.length ? (
    <Spinner visible={true} textContent={'Data Fetching...'} textStyle={{ color: '#FFF' }} />
  ) : (
    <ScrollView {...props} className={cn(className, `bg-gray-100 px-2`)} contentContainerStyle={tw`pb-10`}>
      <Categories categories={categories} />
      <FeaturedRows
        navigation={navigation}
        rows={[
          {
            title: 'Offers near you!',
            description: 'Why not support your local restaurant tonight!',
            items: [...restaurants].sort(() => 0.5 - Math.random()).slice(0, 5),
          },
          {
            title: 'Featured',
            description: 'Paid placements from our partners',
            items: [...restaurants].sort(() => 0.5 - Math.random()).slice(0, 5),
          },
          {
            title: 'Tasty Discounts',
            description: "Everyone's been enjoying these juicy discounts!",
            items: [...restaurants].sort(() => 0.5 - Math.random()).slice(0, 5),
          },
        ]}
      />
    </ScrollView>
  );
}

export default function First({ navigation }: NativeStackScreenProps<NavigationParameters, 'First'>) {
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <ColorSchemeScreen>
      <Header2 />
      <Body className={`flex-1`} navigation={navigation} />
    </ColorSchemeScreen>
  );
}
