import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import Calender from '../Components/Calender';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons, Entypo } from '@expo/vector-icons';

const OrderStatus = ({ data, cart, setOpenBackDialog, navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      setOpenBackDialog(false);
    }, 300000);
  }, []);
  const isMemberShipInCart = useSelector((state) => state.isMemberShipInCart);
  const renderItem = ({ item }) => {
    return (
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
              {item.product.attributes.name}
            </Text>
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
          <Image
            source={
              data.status == 'completed'
                ? require('../assets/check.png')
                : require('../assets/failed.png')
            }
            style={styles.ticketStatus}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.row}>
        <Text style={GlobalStyle.headerText}>
          {data.status == 'pending'
            ? 'Bestelling Bezig'
            : data.status == 'completed'
            ? 'Bestelling gelukt'
            : 'Bestelling mislukt'}
        </Text>
        {data.status != 'pending' ? (
          <Image
            source={
              data.status == 'completed'
                ? require('../assets/check.png')
                : require('../assets/failed.png')
            }
            style={styles.img}
          />
        ) : (
          <ActivityIndicator size='large' color='#000' />
        )}
      </View>

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
            <Image
              source={
                data.status == 'completed'
                  ? require('../assets/check.png')
                  : require('../assets/failed.png')
              }
              style={styles.ticketStatus}
            />
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
      {data.status != 'pending' && (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (data.status == 'completed') {
              navigation.replace('Home', {
                screen: 'Profile',
              });
              dispatch({ type: 'CLEAR_CART' });
            } else {
              dispatch({ type: 'isPayment', isPayment: false });
            }
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontWeight: '700',
            }}
          >
            {data.status == 'completed'
              ? 'Overzicht bestellingen'
              : 'Opnieuw proberen'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  container: {
    paddingTop: normalize(25),
  },
  row: {
    flexDirection: 'row',
  },
  img: {
    width: normalize(50),
    height: normalize(50),
    marginStart: normalize(15),
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
  btn: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    alignItems: 'center',
    backgroundColor: '#000000',
    alignSelf: 'center',
    marginTop: normalize(20),
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
  ticketStatus: {
    width: normalize(24),
    height: normalize(24),
  },
});
