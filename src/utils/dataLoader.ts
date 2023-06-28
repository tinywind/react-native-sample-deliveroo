import * as SQLite from 'expo-sqlite';
import { DATABASE_FILE } from '../config/constants';
import { searchLocation, searchRestaurants, getRestaurantDetails } from './apis';
import { convertSnakeToCamel } from './strings';

const database = SQLite.openDatabase(DATABASE_FILE);

export type Category = string;
export type Location = {
  locationId: number;
  documentId?: string;
  propertyId?: number;
  localizedName: string;
  localizedAdditionalNames?: string;
  placeType: string;
  latitude?: number;
  longitude?: number;
  isGeo?: boolean;
  thumbnailUrl?: string;
  thumbnailMaxWidth?: number;
  thumbnailMaxHeight?: number;
};
export type Restaurant = {
  restaurantId: string;
  locationId: number;
  name: string;
  heroImgUrl?: string;
  heroImgRawHeight?: number;
  heroImgRawWidth?: number;
  averageRating?: number;
  priceTag?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  locationString?: string;
  doubleclickZone?: string;
  priceLevel?: string;
  price?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  webUrl?: string;
  website?: string;
  photoUrlThumbnail?: string;
  photoUrlSmall?: string;
  photoUrlMedium?: string;
  photoUrlLarge?: string;
  photoUrlOriginal?: string;
  displayHours?: string;
  categories?: Category[];
  dishes?: Dish[];
};
export type Dish = {
  id: number;
  restaurantId: string;
  name: string;
  price?: number;
  photoUrl?: string;
};

export const createTables = async () => {
  await createTable(CATEGORY_TABLE_DDL);
  await createTable(LOCATION_TABLE_DDL);
  await createTable(RESTAURANT_TABLE_DDL);
  await createTable(RESTAURANT_X_CATEGORY_TABLE_DDL);
  await createTable(DISH_TABLE_DDL);
};

export const getAllLocations = async (): Promise<Location[]> => {
  const SQL = `SELECT * FROM location`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [], async (_, { rows: { _array } }) => {
      if (_array.length) return resolve(shortArray(_array));

      setTimeout(async () => {
        const response = await searchLocation();
        const locations = response.data.data as any[];
        for (const location of locations) await insertLocation(location);

        getAllLocations().then(resolve).catch(reject);
      }, 100);
    });
  });
};

export const getAllCategories = async (): Promise<Category[]> => {
  const SQL = `SELECT * FROM category`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [], async (_, { rows: { _array } }) => {
      if (_array.length) return resolve(_array.sort(e => e.name).map(({ name }) => name));

      setTimeout(async () => {
        const locations = await getAllLocations();
        if (!locations.length) return reject(new Error('No location found'));
        const targetLocationId = locations[0].locationId;

        const response = await searchRestaurants(targetLocationId, 1);
        const restaurants = response.data.data.data as any[];
        for (const restaurant of restaurants) await insertRestaurant(restaurant, targetLocationId);

        getAllCategories().then(resolve).catch(reject);
      }, 100);
    });
  });
};

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  const setCategories = async (entities: Restaurant[]) => {
    const restaurantMap = (await getAllRestaurantXCategory()).reduce((map: { [key: string]: string[] }, item) => {
      if (!map[item.restaurantId]) map[item.restaurantId] = [];
      map[item.restaurantId].push(item.category);
      return map;
    }, {});
    entities.forEach(entity => {
      const categories = restaurantMap[entity.restaurantId] || [];
      if (!categories.length) console.log('No category found for restaurantId', entity.restaurantId, 'name', entity.name);
      entity.categories = categories;
    });
  };

  const SQL = `SELECT * FROM restaurant`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [], async (_, { rows: { _array } }) => {
      if (_array.length) {
        const restaurants: Restaurant[] = shortArray(_array);
        await setCategories(restaurants);
        return resolve(restaurants);
      }

      setTimeout(async () => {
        const locations = await getAllLocations();
        if (!locations.length) return reject(new Error('No location found'));

        const targetLocationId = locations[0].locationId;
        const restaurants = (await searchRestaurants(targetLocationId, 1)).data.data.data as any[];
        for (const restaurant of restaurants) await insertRestaurant(restaurant, targetLocationId);

        getAllRestaurants().then(resolve).catch(reject);
      }, 100);
    });
  });
};

export const getRestaurant = async (restaurantId: string): Promise<Restaurant> => {
  const SQL = `SELECT * FROM restaurant WHERE restaurant_id = ?`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [restaurantId], async (_, { rows: { _array } }) => {
      if (!_array.length) return reject(new Error('No restaurant found'));

      const restaurant: Restaurant = shortArray(_array)[0];
      if (restaurant.address) {
        restaurant.dishes = await getDishesByRestaurantId(restaurantId);
        restaurant.categories = await getCategoriesByRestaurantId(restaurantId);
        return resolve(restaurant);
      }

      setTimeout(async () => {
        const restaurantResponse = (await getRestaurantDetails(restaurantId)).data.data as any;
        await updateRestaurantDetail(restaurantId, restaurantResponse);
        getRestaurant(restaurantId).then(resolve).catch(reject);
      }, 100);
    });
  });
};

export const getDish = async (dishId: number): Promise<Dish> => {
  const SQL = `SELECT * FROM dish WHERE id = ?`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [dishId], async (_, { rows: { _array } }) => {
      if (!_array.length) return reject(new Error('No restaurant found'));
      return resolve(shortArray(_array)[0]);
    });
  });
};

const getCategoriesByRestaurantId = async (restaurantId: string): Promise<Category[]> => {
  const SQL = `SELECT * FROM restaurant_x_category WHERE restaurant_id = ?`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [restaurantId], async (_, { rows: { _array } }) => resolve(shortArray(_array).map(({ category }) => category)));
  });
};

const getDishesByRestaurantId = async (restaurantId: string): Promise<Dish[]> => {
  const SQL = `SELECT * FROM dish WHERE restaurant_id = ?`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [restaurantId], async (_, { rows: { _array } }) => resolve(shortArray(_array)));
  });
};

const getAllRestaurantXCategory = async (): Promise<{ restaurantId: string; category: string }[]> => {
  const SQL = `SELECT * FROM restaurant_x_category`;
  return executeSql((tx, resolve, reject) => {
    tx.executeSql(SQL, [], async (_, { rows: { _array } }) => resolve(shortArray(_array)));
  });
};

const executeSql = async <T>(func: (tx: SQLite.SQLTransaction, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => unknown): Promise<T> => {
  return new Promise((resolve, reject) => {
    try {
      database.transaction(async transaction => func(transaction, resolve, reject));
    } catch (e) {
      reject(e);
    }
  });
};

const shortArray = (_array: any[]) =>
  _array.map(obj => {
    let newObj: any = {};
    for (let key in obj) {
      let camelCaseKey = convertSnakeToCamel(key);
      newObj[camelCaseKey] = obj[key];
    }
    return newObj;
  });

const CATEGORY_TABLE_DDL = `
  CREATE TABLE IF NOT EXISTS category (
    name TEXT PRIMARY KEY NOT NULL
  );
`;
/*
{
  locationId: 304554,
  documentId: 'loc;304554;g304554',
  propertyId: 304554,
  localizedName: 'Mumbai',
  localizedAdditionalNames: { longOnlyHierarchy: 'Maharashtra, India, Asia' },
  placeType: 'CITY',
  latitude: 18.936844,
  longitude: 72.8291,
  isGeo: true,
  thumbnail: {
    photoSizeDynamic: {
      maxWidth: 5328,
      maxHeight: 3000,
      urlTemplate: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/4e/55/e6/chhatrapati-shivaji-terminus.jpg?w={width}&h={height}&s=1',
    },
  },
}
 */
const LOCATION_TABLE_DDL = `
  CREATE TABLE IF NOT EXISTS location (
    location_id INTEGER PRIMARY KEY NOT NULL,
    document_id TEXT,
    property_id INTEGER,
    localized_name TEXT NOT NULL,
    localized_additional_names TEXT,
    place_type TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    is_geo INTEGER,
    thumbnail_url TEXT,
    thumbnail_max_width INTEGER,
    thumbnail_max_height INTEGER
  );
`;
/* searchRestaurants data
{
  restaurantsId: 'Restaurant_Review-g304554-d1008614-Reviews-Mabruk-Mumbai_Maharashtra',
  heroImgUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/0b/55/a9/05/mabruk-the-mediterranean.jpg',
  heroImgRawHeight: 367,
  heroImgRawWidth: 550,
  locationId: 1008614,
  name: 'Mabruk',
  averageRating: 5,
  establishmentTypeAndCuisineTags: ['Lebanese', 'Mediterranean'],
  priceTag: '$$$$',
},
 */
/* detailRestaurant data
{
  location: {
    location_id: '1008614',
    name: 'Mabruk',
    latitude: '19.096565',
    longitude: '72.85387',
    timezone: 'Asia/Kolkata',
    location_string: 'Mumbai, Maharashtra',
    doubleclick_zone: 'as.india.mumbai',
    rating: '5.0',
    price_level: '$$$$',
    price: '$1,100 - $2,500',
    description:
      'Mabruk - The Mediterranean restaurant, This Lebanese offing sets the mood with its casual low seating on a wooden deck and a spectacular view of the lagoon area, the pillar less clear-to-the sky dome as well as the other restaurants. Combining the sophistication and subtleties of Mediterranean cuisines with the exotic ingredients of the Middle and Far East. MABRUK, the Mediterranean, nine-time award winner for the "Best Lebanese Restaurant" by Times Food Guide offers rich Lebanese culture with soulful Mediterranean sounds and mouth-watering cuisine conjured by Chef Jihad. Chef Jihad creates a repertoire of traditional mezzeh\'s complimented by carefully picked soups, main courses and desserts, creating an awe-inspiring array of flavors, textures and aromas.',
    web_url: 'https://www.tripadvisor.com/Restaurant_Review-g304554-d1008614-Reviews-Mabruk-Mumbai_Maharashtra.html',
    parent_display_name: 'Mumbai',
    is_jfy_enabled: false,
    phone: '+91 86574 11561',
    website: 'http://www.saharastar.com/dining/mabruk-mediterranean-restaurant.html',
    email: 'info@saharastar.com',
    address: 'Domestic Airport Western Express Highway Hotel Sahara Star, Mumbai 400099 India',
    cuisine: [
      { key: '10626', name: 'Lebanese' },
      { key: '10649', name: 'Mediterranean' },
      { key: '10687', name: 'Middle Eastern' },
      { key: '10665', name: 'Vegetarian Friendly' },
      { key: '10697', name: 'Vegan Options' },
      { key: '10751', name: 'Halal' },
      { key: '10992', name: 'Gluten Free Options' },
    ],
    photo: {
      id: '220718948',
      caption: 'Inside View of Lagoon',
      published_date: '2016-09-30T09:50:38-0400',
      helpful_votes: '6',
      is_blessed: false,
      uploaded_date: '2016-09-30T09:50:38-0400',
      images: {
        small: { url: 'https://media-cdn.tripadvisor.com/media/photo-l/0d/27/e7/64/inside-view-of-lagoon.jpg', width: '150', height: '150' },
        thumbnail: { url: 'https://media-cdn.tripadvisor.com/media/photo-t/0d/27/e7/64/inside-view-of-lagoon.jpg', width: '50', height: '50' },
        original: { url: 'https://media-cdn.tripadvisor.com/media/photo-o/0d/27/e7/64/inside-view-of-lagoon.jpg', width: '1024', height: '683' },
        large: { url: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/27/e7/64/inside-view-of-lagoon.jpg', width: '550', height: '366' },
        medium: { url: 'https://media-cdn.tripadvisor.com/media/photo-f/0d/27/e7/64/inside-view-of-lagoon.jpg', width: '250', height: '167' },
      },
    },
    tags: null,
    display_hours: [{ days: 'Sun - Sat', times: ['7:00 PM - 11:45 PM'] }],
  },
}
 */
const RESTAURANT_TABLE_DDL = `
  CREATE TABLE IF NOT EXISTS restaurant (
--  from searchRestaurants
    restaurant_id TEXT PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES location(location_id),
    name TEXT NOT NULL,
    hero_img_url TEXT,
    hero_img_raw_height INTEGER,
    hero_img_raw_width INTEGER,
    average_rating REAL,
    -- establishment_type_and_cuisine_tags TEXT, -- --> categories
    price_tag TEXT,
--  from deatailRestaurant location
    latitude REAL,
    longitude REAL,
    timezone TEXT,
    location_string TEXT,
    doubleclick_zone TEXT,
    price_level TEXT,
    price TEXT,
    description TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    web_url TEXT, -- of tripadvisor
    website TEXT,
    photo_url_thumbnail TEXT,
    photo_url_small TEXT,
    photo_url_medium TEXT,
    photo_url_large TEXT,
    photo_url_original TEXT,
    display_hours TEXT
    -- cuisine TEXT, -- --> isnert dishes with random attributes
  );
`;
const RESTAURANT_X_CATEGORY_TABLE_DDL = `
  CREATE TABLE IF NOT EXISTS restaurant_x_category (
    restaurant_id TEXT NOT NULL REFERENCES restaurant(restaurant_id),
    category TEXT NOT NULL REFERENCES category(name),
    PRIMARY KEY (restaurant_id, category)
  );
`;
const DISH_TABLE_DDL = `
  CREATE TABLE IF NOT EXISTS dish (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id TEXT NOT NULL REFERENCES location(location_id),
    name TEXT NOT NULL,
    price INTEGER,
    photo_url TEXT,
    UNIQUE (restaurant_id, name)
  );
`;

const createTable = async (ddl: string) =>
  executeSql(async (tx, resolve, reject) => {
    await tx.executeSql(ddl);
    resolve(void 0);
  });

const insertCategory = async (category: string) => {
  const SQL = `INSERT OR IGNORE INTO category (name) VALUES (?)`;
  return executeSql(async (tx, resolve, reject) => {
    await tx.executeSql(SQL, [category]);
    resolve(void 0);
  });
};

const insertLocation = async (location: any) => {
  const SQL = `INSERT OR IGNORE INTO location ( location_id, document_id, property_id, localized_name, localized_additional_names, place_type, latitude, longitude, is_geo, thumbnail_url, thumbnail_max_width, thumbnail_max_height) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  return executeSql(async (tx, resolve, reject) => {
    const params = [
      location.locationId,
      location.documentId,
      location.propertyId,
      location.localizedName,
      JSON.stringify(location.localizedAdditionalNames),
      location.placeType,
      location.latitude,
      location.longitude,
      location.isGeo,
      location.thumbnail.photoSizeDynamic.urlTemplate,
      location.thumbnail.photoSizeDynamic.maxWidth,
      location.thumbnail.photoSizeDynamic.maxHeight,
    ];
    console.log('inserting location:', SQL, params);
    await tx.executeSql(SQL, params);

    resolve(void 0);
  });
};

const insertRestaurant = async (restaurant: any, locationId: number) => {
  const SQL = `INSERT OR IGNORE INTO restaurant (restaurant_id, location_id, name, hero_img_url, hero_img_raw_height, hero_img_raw_width, average_rating, price_tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  return executeSql(async (tx, resolve, reject) => {
    const params = [
      restaurant.restaurantsId,
      locationId,
      restaurant.name,
      restaurant.heroImgUrl,
      restaurant.heroImgRawHeight,
      restaurant.heroImgRawWidth,
      restaurant.averageRating,
      restaurant.priceTag,
    ];
    console.log('inserting restaurant:', SQL, params);
    await tx.executeSql(SQL, params);

    const categories = restaurant.establishmentTypeAndCuisineTags as string[] | undefined;
    if (categories) {
      for (const category of categories) {
        await insertCategory(category);
        await insertRestaurantXCategory(restaurant.restaurantsId, category);
      }
    }
    resolve(void 0);
  });
};

const insertRestaurantXCategory = async (restaurantId: string, category: string) => {
  const SQL = `INSERT OR IGNORE INTO restaurant_x_category (restaurant_id, category) VALUES (?,?)`;
  return executeSql(async (tx, resolve, reject) => {
    const params = [restaurantId, category];
    console.log('inserting restaurant_x_category:', SQL, params);
    await tx.executeSql(SQL, params);
    resolve(void 0);
  });
};

const updateRestaurantDetail = async (restaurantId: string, restaurant: any) => {
  const SQL = `UPDATE restaurant SET latitude=?, longitude=?, timezone=?, location_string=?, doubleclick_zone=?, price_level=?, price=?, description=?, phone=?, email=?, address=?, web_url=?, website=?, photo_url_thumbnail=?, photo_url_small=?, photo_url_medium=?, photo_url_large=?, photo_url_original=?, display_hours=? WHERE restaurant_id=?`;
  return executeSql(async (tx, resolve, reject) => {
    const params = [
      restaurant.location.latitude,
      restaurant.location.longitude,
      restaurant.location.timezone,
      restaurant.location.location_string,
      restaurant.location.doubleclick_zone,
      restaurant.location.price_level,
      restaurant.location.price,
      restaurant.location.description,
      restaurant.location.phone,
      restaurant.location.email,
      restaurant.location.address,
      restaurant.location.web_url,
      restaurant.location.website,
      JSON.stringify(restaurant.location.photo?.images?.thumbnail?.url),
      JSON.stringify(restaurant.location.photo?.images?.small?.url),
      JSON.stringify(restaurant.location.photo?.images?.medium?.url),
      JSON.stringify(restaurant.location.photo?.images?.large?.url),
      JSON.stringify(restaurant.location.photo?.images?.original?.url),
      JSON.stringify(restaurant.location.display_hours),
      restaurantId,
    ];
    console.log('updating restaurant:', SQL, params);
    await tx.executeSql(SQL, params);

    const cuisines = restaurant.location.cuisine as { key: unknown; name: string }[];
    for (const cuisine of cuisines) await insertDish(restaurantId, restaurant, cuisine);

    resolve(void 0);
  });
};

const insertDish = async (restaurantId: string, restaurant: any, dish: any) => {
  const SQL = `INSERT OR IGNORE INTO dish (restaurant_id, name, price, photo_url) VALUES (?,?,?,?)`;
  return executeSql(async (tx, resolve, reject) => {
    const params = [
      restaurantId,
      dish.name,
      // random value in restaurant.location.price_level('$$$$')
      Math.floor(Math.random() * restaurant.location.price_level.length) + 1,
      // random food image url
      `https://source.unsplash.com/300x300/?food,dish,cuisine,${dish.name}`,
    ];
    console.log('inserting dish:', SQL, params);
    await tx.executeSql(SQL, params);

    resolve(void 0);
  });
};
