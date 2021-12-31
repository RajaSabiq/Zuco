import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login';
import { useFonts } from 'expo-font';
import BottomNavigation from './Routes/BottomNavigation';
import { StateProvider } from './ContextApi/SateProvider';
import reducer, { initialState } from './ContextApi/reducer';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Store/Store';
import AddToCart from './Screens/AddToCart';

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StateProvider initialState={initialState} reducer={reducer}>
          <NavigationContainer>
            <mainStack.Navigator
              initialRouteName='login'
              screenOptions={{ headerShown: false }}
            >
              <mainStack.Screen name='login' component={Login} />
              <mainStack.Screen name='Home' component={BottomNavigation} />
              <mainStack.Screen name='AddToCart' component={AddToCart} />
            </mainStack.Navigator>
          </NavigationContainer>
        </StateProvider>
      </PersistGate>
    </Provider>
  );
}
