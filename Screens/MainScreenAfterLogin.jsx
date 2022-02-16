import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomNavigation from '../Routes/BottomNavigation';
import { normalize } from '../Style/Responsive';
import AddToCart from './AddToCart';
import OrderStatus from './OrderStatus';
import addtoBasket from '../assets/cart.png';
import Axios from '../axios/axios';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStateValue } from '../ContextApi/SateProvider';
import UnActiveMembershipCard from '../Components/UnActiveMembershipCard';
import * as Device from 'expo-device';

const MainScreenStack = createStackNavigator();

const MainScreenAfterLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const goingForPayment = useSelector((state) => state.goingForPayment);
  const [{ isActiveMemberShip, impersonate_url }] = useStateValue();
  const [openBackDialog, setOpenBackDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const orderId = useSelector((state) => state.orderId);
  useEffect(() => {
    if (goingForPayment) {
      const timer = setInterval(() => {
        Axios.get(`/orders/${orderId}`)
          .then((res) => {
            if (
              res.data.data.attributes.status !== 'pending' &&
              goingForPayment
            ) {
              clearInterval(timer);
            } else {
              // console.log(res.data.data.attributes);
              setData(res.data.data.attributes);
            }
          })
          .catch((err) => {
            clearInterval(timer);
            console.log(err);
          });
      }, 5000);
    }
  }, []);

  const backAction = async () => {
    await AsyncStorage.clear().then(() => {
      dispatch({ type: 'CLEAR_CART' });
      navigation.replace('login');
    });
  };

  return (
    <>
      <Modal visible={goingForPayment && data !== null}>
        <OrderStatus
          data={data}
          cart={cart}
          setOpenBackDialog={setOpenBackDialog}
          navigation={navigation}
        />
      </Modal>

      <Modal visible={openBackDialog} animationType='fade' transparent>
        <BlurView
          tint='dark'
          intensity={100}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              padding: normalize(20),
              borderRadius: normalize(10),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: normalize(17),
                fontWeight: 'bold',
                color: '#B28A17',
              }}
            >
              Opgelet!
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: normalize(14),
                color: '#5C5C5C',
                fontWeight: '300',
              }}
            >
              Zeker dat je wilt afsluiten?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
                marginTop: normalize(15),
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#000',
                  paddingHorizontal: normalize(30),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(10),
                }}
                onPress={() => setOpenBackDialog(false)}
              >
                <Text
                  style={{
                    color: '#fff',
                  }}
                >
                  Terug
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#B28A17',
                  paddingHorizontal: normalize(30),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(10),
                }}
                onPress={backAction}
              >
                <Text
                  style={{
                    color: '#fff',
                  }}
                >
                  Afsluiten
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <Modal visible={isOpen} transparent={false} animationType='fade'>
        <UnActiveMembershipCard
          impersonate_url={impersonate_url}
          setIsOpen={setIsOpen}
        />
      </Modal>

      <MainScreenStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <MainScreenStack.Screen name='HomeTab'>
          {() => (
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: '#fff',
              }}
            >
              {!isActiveMemberShip && (
                <TouchableOpacity
                  onPress={() => {
                    setIsOpen(true);
                  }}
                  style={{
                    backgroundColor: '#B28A17',
                    padding: normalize(10),
                    borderBottomLeftRadius: normalize(7),
                    borderBottomRightRadius: normalize(7),
                  }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>
                    Opgelet! U heeft geen actief membership. Activeer hier.
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: '#ccc',
                  width: normalize(30),
                  height: normalize(30),
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginEnd: normalize(15),
                  marginTop: normalize(10),
                  borderRadius: normalize(10),
                }}
                onPress={() => setOpenBackDialog(true)}
              >
                <Ionicons name='exit-outline' size={24} color='black' />
              </TouchableOpacity>
              <BottomNavigation />
              {cart.length > 0 && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom:
                      Device.brand == 'Apple' ? normalize(30) : normalize(10),
                    right: normalize(10),
                  }}
                  onPress={() => {
                    navigation.navigate('AddToCart');
                  }}
                  style={styles.addToBasketBtn}
                >
                  <Text style={styles.basketCount}>{cart.length}</Text>
                  <Image source={addtoBasket} style={styles.basketImage} />
                </TouchableOpacity>
              )}
            </SafeAreaView>
          )}
        </MainScreenStack.Screen>
      </MainScreenStack.Navigator>
    </>
  );
};

export default MainScreenAfterLogin;

const styles = StyleSheet.create({
  basketImage: {
    width: 27,
    height: 25,
  },
  addToBasketBtn: {
    position: 'absolute',
    bottom: normalize(50),
    right: normalize(15),
    backgroundColor: '#B28A17',
    width: normalize(45),
    height: normalize(45),
    borderRadius: normalize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketCount: {
    position: 'absolute',
    padding: normalize(5),
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: normalize(100),
    top: -10,
    fontWeight: 'bold',
    fontSize: normalize(12),
    right: -normalize(5),
    width: normalize(23),
    height: normalize(23),
    textAlign: 'center',
  },
});
