import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Screens/Login';
import Profile from './Screens/Profile';
import { useFonts } from 'expo-font';
import BottomNavigation from './Routes/BottomNavigation';
import { StateProvider } from './ContextApi/SateProvider';
import reducer, { initialState } from './ContextApi/reducer';

const mainStack = createStackNavigator();
export default function App() {
  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins.ttf'),
    DMSans: require('./assets/fonts/DMSans.ttf'),
  });
  if (!loaded) {
    return null;
  }
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <NavigationContainer>
        <mainStack.Navigator
          initialRouteName='login'
          screenOptions={{ headerShown: false }}
        >
          <mainStack.Screen name='login' component={Login} />
          <mainStack.Screen name='Home' component={BottomNavigation} />
        </mainStack.Navigator>
      </NavigationContainer>
    </StateProvider>
  );
}
