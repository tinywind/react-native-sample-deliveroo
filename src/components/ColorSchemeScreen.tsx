import React, { PropsWithChildren } from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TailwindChildrenProps } from '../types';
import cn from 'classnames';

export default function ColorSchemeScreen({ children, className, ...props }: TailwindChildrenProps<{}>) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter };
  return (
    <SafeAreaView style={{ backgroundColor: backgroundStyle.backgroundColor }} className={cn(className, `flex-1 flex-col`)} {...props}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      {children}
    </SafeAreaView>
  );
}
