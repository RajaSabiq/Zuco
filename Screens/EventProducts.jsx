import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import Calender from '../Components/Calender';
import { normalize } from '../Style/Responsive';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../Store/actions';
import { BlurView } from 'expo-blur';
import Axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const EventProducts = ({ route, navigation }) => {
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    Axios.get(`events/${route.params.id}/products`).then((res) => {
      const { data } = res;
      const groupData = data.data.reduce((r, a) => {
        r[a.attributes.category.id] = [
          ...(r[a.attributes.category.id] || []),
          a,
        ];
        return r;
      }, {});
      const groupDataArray = Object.keys(groupData).map((key) => ({
        key,
        value: groupData[key],
      }));
      setEvents(groupDataArray);
    });
    getList();
  }, []);

  const getList = async () => {
    const value = await AsyncStorage.getItem('user_id');
    Axios.get(`user/${value}/tickets`).then((res) => {
      const { data } = res;
      setAlreadyAdded(
        data.data.some((item) => item.attributes.product.id === route.params.id)
      );
    });
  };

  return (
    <View style={styles.container}>
      <Modal visible={openModal} animationType='fade' transparent>
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
              U heeft al een ticket voor dit evenement. Wenst u uw ticket te
              upgraden? Contacteer ons! Wij helpen jou graag verder.
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
                onPress={() => setOpenModal(false)}
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
                onPress={() => {
                  Linking.openURL('mailto:info@zuconightclub.com');
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                  }}
                >
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Image
        source={{
          uri: route.params.eventImage,
        }}
        style={[styles.imageContainer]}
      />
      <View style={styles.detailContainer}>
        <Calender
          scale={55}
          marginTop={-10}
          fontSizeMonth={14}
          fontSizeDate={25}
          borderRadius={17}
          date={route.params.date}
          month={route.params.month}
        />
        <View style={styles.eventTextContainer}>
          <Text style={styles.eventDetail}>{route.params.eventDate}</Text>
          <Text style={styles.eventName}>{route.params.eventName}</Text>
        </View>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingHorizontal: normalize(25),
            }}
            key={index}
          >
            <Text
              style={[
                styles.eventName,
                {
                  marginTop: normalize(10),
                },
              ]}
            >
              {item.value[0].attributes.category.attributes.name}
            </Text>
            {item.value.map((product) => (
              <View style={styles.bottomContainer}>
                <Image
                  source={require('../assets/ticket.png')}
                  style={styles.ticket}
                />
                <View
                  style={{
                    width: normalize(110),
                  }}
                >
                  <Text style={styles.ticketType}>
                    {product.attributes.name}
                  </Text>
                  <Text style={styles.txticketDate}>
                    {product.attributes.description}
                  </Text>
                </View>
                <Text style={styles.txTicket}>
                  €{' '}
                  {(+product.attributes.price +
                    +product.attributes.handling_cost) /
                    100}
                </Text>
                {+product.attributes.availability >= 1 ? (
                  <TouchableOpacity
                    disabled={cart.some(
                      (cart) =>
                        cart.product.id !== product.id &&
                        cart.id === route.params.id
                    )}
                    style={[
                      styles.addToBasket,
                      {
                        backgroundColor: cart.some(
                          (cart) =>
                            cart.product.id !== product.id &&
                            cart.id === route.params.id
                        )
                          ? '#979797'
                          : '#B28A17',
                      },
                    ]}
                    onPress={() => {
                      if (alreadyAdded) {
                        if (
                          cart.some(
                            (cart) =>
                              cart.product.id !== product.id &&
                              cart.id !== route.params.id
                          ) ||
                          cart.length === 0
                        ) {
                          dispatch(
                            addToCart({
                              isMembership: false,
                              id: route.params.id,
                              product,
                              eventName: route.params.eventName,
                              eventDate: route.params.eventDate,
                              eventImage: route.params.eventImage,
                            })
                          );
                        } else {
                          dispatch(removeFromCart(product));
                        }
                      } else {
                        setOpenModal(true);
                      }
                    }}
                  >
                    <Image
                      source={require('../assets/cart.png')}
                      style={{ width: normalize(19), height: normalize(17) }}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text>SOLD OUT</Text>
                )}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default EventProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(15),
    backgroundColor: '#fff',
  },
  imageContainer: {
    borderRadius: 10,
    width: '85%',
    height: undefined,
    aspectRatio: 2,
    alignSelf: 'center',
  },
  detailContainer: {
    paddingHorizontal: normalize(30),
    flexDirection: 'row',
  },

  eventTextContainer: {
    flex: 1,
    marginStart: 10,
    marginTop: 5,
  },
  eventDetail: {
    color: '#B40000',
    fontWeight: 'bold',
    fontSize: normalize(11),
    textAlign: 'left',
  },
  eventName: {
    color: '#000000',
    fontWeight: '700',
    fontSize: normalize(18),
  },
  btnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    padding: 7,
  },
  bottomContainer: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: '#fff',
    borderRadius: normalize(17),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    marginTop: normalize(10),
    marginBottom: normalize(15),
  },
  ticket: {
    height: normalize(32.5),
    width: normalize(34),
    padding: 5,
  },
  txTicket: {
    fontSize: normalize(15),
    color: '#194039',
    fontWeight: 'bold',
  },
  txticketDate: {
    fontSize: normalize(10),
    color: '#000',
  },
  ticketType: {
    fontWeight: 'bold',
    color: '#194039',
    marginBottom: 2,
  },
  addToBasket: {
    backgroundColor: '#B28A17',
    width: normalize(40),
    height: normalize(25),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketImage: {
    width: 27,
    height: 25,
  },
  addToBasketBtn: {
    position: 'absolute',
    bottom: normalize(10),
    right: normalize(10),
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
