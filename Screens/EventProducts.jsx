import axios from 'axios';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Calender from '../Components/Calender';
import { normalize } from '../Style/Responsive';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';

const EventProducts = ({ route }) => {
  const [events, setEvents] = React.useState([]);
  useEffect(() => {
    axios
      .get(`${PRODUCTIONSERVER}events/${route.params.id}/products`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        console.log({ data: res.data });
        setEvents(res.data.data);
      });
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'http://app.zuconightclub.com/storage/YS45qajEdfrrxpP46s5Di1p8VSZZvd31SmL2BHAt.jpg',
          }}
          style={styles.imageContainer}
        />
        <View style={styles.detailContainer}>
          <Calender
            scale={55}
            marginTop={-10}
            fontSizeMonth={14}
            fontSizeDate={25}
            borderRadius={17}
            date={12}
            month={'Dec'}
          />
          <View style={styles.eventTextContainer}>
            <Text style={styles.eventDetail}>{'21-5-2021'}</Text>
            <Text style={styles.eventName}>{'TESTING EVENT'}</Text>
          </View>
        </View>
        {events.map((item, index) => (
          <>
            <Text
              style={[
                styles.eventName,
                {
                  marginTop: normalize(10),
                },
              ]}
            >
              Standard
            </Text>
            <View style={styles.bottomContainer}>
              <Image
                source={require('../assets/ticket.png')}
                style={styles.ticket}
              />
              <View>
                <Text style={styles.ticketType}>{'Ticket Type'}</Text>
                <Text style={styles.txticketDate}>{'21-5-2021'}</Text>
              </View>
              <Text style={styles.txTicket}>€ {'10'}</Text>
              <TouchableOpacity
                style={styles.addToBasket}
                onPress={() => {
                  navigation.navigate('Profile');
                }}
              >
                <Image
                  source={require('../assets/cart.png')}
                  style={{ width: normalize(19), height: normalize(17) }}
                />
              </TouchableOpacity>
            </View>
          </>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default EventProducts;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(25),
    paddingTop: normalize(25),
    marginBottom: normalize(15),
  },
  imageContainer: {
    borderRadius: 10,
    width: '100%',
    height: undefined,
    aspectRatio: 2,
  },
  detailContainer: {
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
});
