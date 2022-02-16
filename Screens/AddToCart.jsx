import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Calender from '../Components/Calender';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import { Entypo } from '@expo/vector-icons';
import { removeFromCart, saveOrderId } from '../Store/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../axios/axios';

const AddToCart = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const isMemberShipInCart = useSelector((state) => state.isMemberShipInCart);

  const renderItem = ({ item }) => (
    <View style={GlobalStyle.row}>
      <View style={styles.detailContainer}>
        <Calender
          scale={77}
          marginTop={-10}
          fontSizeMonth={17}
          fontSizeDate={35}
          borderRadius={17}
          date={item.eventDate.split(' ')[2]}
          month={item.eventDate.split(' ')[1]}
        />
        <View style={styles.eventTextContainer}>
          <Text style={styles.eventDetail}>{item.eventDate}</Text>
          <Text style={styles.eventName}>{item.eventName}</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Image source={require('../assets/ticket.png')} style={styles.ticket} />
        <View
          style={{
            width: normalize(110),
          }}
        >
          <Text style={styles.ticketType}>{item.product.attributes.name}</Text>
          <Text style={styles.txticketDate}>
            {item.product.attributes.description}
          </Text>
        </View>
        <Text style={styles.txTicket}>
          €{' '}
          {(+item.product.attributes.price +
            +item.product.attributes.handling_cost) /
            100}
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(removeFromCart(item.product));
          }}
        >
          <Entypo name='cross' size={24} color='black' />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <Text style={GlobalStyle.headerText}>Winkelmand</Text>
        {!isMemberShipInCart ? (
          <FlatList
            style={styles.flatList}
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Uw winkelmand is leeg.</Text>
              </View>
            }
          />
        ) : (
          <View
            style={{
              paddingHorizontal: normalize(25),
              marginTop: normalize(20),
            }}
          >
            <View style={styles.bottomContainer}>
              <Image
                source={require('../assets/membercard.png')}
                style={styles.ticket}
              />
              <View
                style={{
                  width: normalize(110),
                }}
              >
                <Text style={styles.ticketType}>ZUCO Membership</Text>
              </View>
              <Text style={styles.txTicket}>
                &euro;{' '}
                {(+cart[0].product.attributes.price +
                  +cart[0].product.attributes.handling_cost) /
                  100}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch({
                    type: 'CLEAR_CART',
                  });
                  navigation.goBack();
                }}
              >
                <Entypo name='cross' size={24} color='black' />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: '#000',
                fontSize: normalize(14),
                lineHeight: 30,
                marginHorizontal: normalize(30),
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: '#B28A17',
                  fontWeight: '700',
                }}
              >
                ZUCO Membercard{' '}
              </Text>
              <Text style={{ fontWeight: '700' }}>gaat digitaal! {`\n`}</Text>
              De ZUCO Magical Membercard is geldig voor 1 jaar vanaf het eerste
              gebruik.
            </Text>
          </View>
        )}
        {cart.length > 0 && (
          <View>
            <View style={styles.cartTotalView}>
              {/* <Text style={styles.total}>
              Subtotaal: €
              {cart.reduce((acc, item) => {
                return (
                  acc +
                  (+item.product.attributes.price +
                    +item.product.attributes.handling_cost) /
                    100
                );
              }, 0)}
            </Text> */}
              <Text style={styles.total}>
                Totaal: &euro;
                {cart.reduce((acc, item) => {
                  return (
                    acc +
                    (+item.product.attributes.price +
                      +item.product.attributes.handling_cost) /
                      100
                  );
                }, 0)}
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: '#000000',
                    marginRight: normalize(20),
                  },
                ]}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '700',
                  }}
                >
                  Verder kijken
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const value = await AsyncStorage.getItem('user_id');
                  Axios.post(`orders`, {
                    data: {
                      type: 'order',
                      attributes: {
                        user_id: value,
                        products: cart.map((item) => {
                          return {
                            id: item.product.id,
                          };
                        }),
                      },
                    },
                  }).then((res) => {
                    dispatch(saveOrderId(res.data.order_id, true));
                    Linking.openURL(res.data.checkout_url);
                  });
                }}
                style={[
                  styles.btn,
                  {
                    backgroundColor: '#B28A17',
                  },
                ]}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '700',
                  }}
                >
                  Afrekenen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddToCart;

const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(15),
  },
  imageContainer: {
    borderRadius: 10,
    width: '100%',
    height: undefined,
    aspectRatio: 2,
  },
  detailContainer: {
    marginTop: normalize(25),
    paddingHorizontal: 5,
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
    paddingHorizontal: normalize(25),
  },
  btn: {
    flexGrow: 1,
    padding: normalize(10),
    borderRadius: normalize(10),
    alignItems: 'center',
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
  total: {
    fontSize: normalize(15),
    fontWeight: 'bold',
  },
  cartTotalView: {
    alignItems: 'flex-end',
    marginTop: normalize(20),
    paddingHorizontal: normalize(25),
  },
  flatList: {
    maxHeight: (Dimensions.get('window').height / 100) * 70,
  },
  emptyContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: 'bold',
    fontSize: normalize(17),
  },
});
