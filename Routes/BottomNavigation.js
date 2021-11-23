import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../Screens/Profile';
import Tickets from '../Screens/Tickets';
import Events from '../Screens/Events';
import { Image, View } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { normalize } from '../Style/Responsive';

const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Profile'}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      })}
    >
      <Tab.Screen
        name='Events'
        component={Events}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/eventLogo.png')}
              style={{
                height: normalize(30),
                width: normalize(30),
                alignSelf: 'flex-end',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => (
            <View
              style={{
                backgroundColor: '#B28A17',
                padding: 7,
                borderRadius: 100,
                marginTop: -50,
              }}
            >
              <Image
                source={require('../assets/qrcode.png')}
                style={{ height: normalize(45), width: normalize(45) }}
              />
            </View>
          ),
        }}
        name='Profile'
        component={Profile}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/tickets.png')}
              style={{
                height: normalize(30),
                width: normalize(30),
                alignSelf: 'flex-start',
              }}
            />
          ),
        }}
        name='Ticket'
        component={Tickets}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
