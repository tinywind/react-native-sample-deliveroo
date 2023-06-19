export default {
  expo: {
    name: 'react-native-study-delieroo',
    slug: 'react-native-study-delieroo',
    version: '1.0.0',
    orientation: 'default',
    icon: './assets/icon.png',
    scheme: 'com.saerosoft.study.reactnative.deliveroo',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.saerosoft.study.reactnative.deliveroo',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive_icon.png',
        backgroundColor: '#ffffff',
      },
      versionCode: 1,
      package: 'com.saerosoft.study.reactnative.deliveroo',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [],
    extra: {
      eas: {
        projectId: '84cf5fb7-7700-43fa-be8a-6ace050c3202',
      },
    },
    owner: 'tinywind',
  },
};
