import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { normalize } from '../Style/Responsive';
import { Entypo } from '@expo/vector-icons';
import Calender from './Calender';
import { useStateValue } from '../ContextApi/SateProvider';

const EventCard = ({
  date,
  month,
  eventImage,
  eventDate,
  eventName,
  fblink,
  ticketHandler,
  url,
}) => {
  const [{ impersonate_url, isActiveMemberShip }] = useStateValue();
  return (
    <View style={styles.container}>
      <Image source={{ uri: eventImage }} style={styles.imageContainer} />
      <View style={styles.detailContainer}>
        <Calender
          scale={55}
          marginTop={-10}
          fontSizeMonth={14}
          fontSizeDate={25}
          borderRadius={17}
          date={date}
          month={month}
        />
        <View style={styles.eventTextContainer}>
          <Text style={styles.eventDetail}>{eventDate}</Text>
          <Text style={styles.eventName}>{eventName}</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(fblink);
          }}
          style={[styles.btn, { backgroundColor: '#000' }]}
        >
          <Image
            source={require('../assets/fblogo.png')}
            style={styles.fbLogo}
          />
          <Text style={{ color: '#fff' }}>Evenement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isActiveMemberShip)
              Linking.openURL(impersonate_url + '&redirect=' + url);
            else ticketHandler(true);
          }}
          style={[styles.btn, { backgroundColor: '#B28A17' }]}
        >
          <Text style={{ color: '#fff' }}>Tickets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(25),
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
  fbLogo: {
    width: normalize(20),
    height: normalize(20),
    marginRight: 5,
  },
});
export default EventCard;
