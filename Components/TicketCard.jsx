import React from 'react';
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStateValue } from '../ContextApi/SateProvider';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import Calender from './Calender';

const TicketCard = ({
  date,
  month,
  eventImage,
  eventDate,
  eventName,
  navigation,
  value,
  refreshing,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={{ uri: eventImage }} style={styles.imageContainer} />
          <Calender
            marginTop={-20}
            scale={40}
            fontSizeDate={15}
            fontSizeMonth={10}
            borderRadius={8}
            date={date}
            month={month}
          />
        </View>
        <View style={styles.eventTextContainer}>
          <Text style={styles.eventDetail}>{eventDate}</Text>
          <Text style={styles.eventName}>{eventName}</Text>
        </View>
      </View>
      <Text style={styles.txSubHeader}>Tickets</Text>
      {/* <FlatList
        scrollEnabled={false}
        data={value}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => ( */}
      <View style={styles.bottomContainer}>
        <Image source={require('../assets/ticket.png')} style={styles.ticket} />
        <View>
          <Text style={styles.ticketType}>
            {value[0].attributes.product.attributes.category.attributes.name}
          </Text>
          <Text style={styles.txticketDate}>
            {value[0].attributes?.created_at}
          </Text>
        </View>
        <Text style={styles.txTicket}>
          €{value[0].attributes.product.attributes.price / 100}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
        >
          <Image
            source={require('../assets/qrcodescangold.png')}
            style={styles.ticket}
          />
        </TouchableOpacity>
      </View>
      {/* )}
      /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: normalize(25),
    marginTop: normalize(25),
  },
  imageContainer: {
    borderRadius: 10,
    width: normalize(120),
    height: undefined,
    aspectRatio: 2,
    marginLeft: 5,
  },
  header: {
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
  txSubHeader: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    marginLeft: 5,
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
});
export default TicketCard;
