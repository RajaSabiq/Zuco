import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Modal,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from 'react-native';
import TicketCard from '../Components/TicketCard';
import { GlobalStyle } from '../Style/GloabalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStateValue } from '../ContextApi/SateProvider';
import { normalize } from '../Style/Responsive';
import Axios from '../axios/axios';

const Tickets = ({ navigation }) => {
  const [ticketList, setTicketList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const value = await AsyncStorage.getItem('user_id');
    Axios.get(`user/${value}/tickets`)
      .then((res) => {
        const { data } = res;
        const groupData = data.data.reduce((r, a) => {
          r[a.attributes.event.id] = [...(r[a.attributes.event.id] || []), a];
          return r;
        }, {});
        const groupDataArray = Object.keys(groupData).map((key) => ({
          key,
          value: groupData[key],
        }));
        setRefreshing(false);
        setTicketList(groupDataArray);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const getMonth = ({ number }) => {
    switch (number) {
      case '01':
        return 'Jan';
      case '02':
        return 'Feb';
      case '03':
        return 'Mar';
      case '04':
        return 'Apr';
      case '05':
        return 'May';
      case '06':
        return 'Jun';
      case '07':
        return 'Jul';
      case '08':
        return 'Aug';
      case '09':
        return 'Sep';
      case '10':
        return 'Oct';
      case '11':
        return 'Nov';
      case '12':
        return 'Dec';
    }
  };
  const getDayName = ({ number }) => {
    switch (number) {
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      case 0:
        return 'Sun';
    }
  };

  const renderCard = ({ item }) => {
    let startDate = new Date(
      item.value[0].attributes.event?.attributes.event_starts_at.split(' ')[0]
    );
    return (
      <TicketCard
        eventImage={
          item.value[0].attributes.event?.attributes.banner_image_path
        }
        eventName={item.value[0].attributes.event.attributes.title}
        date={
          item.value[0].attributes.event?.attributes.event_starts_at
            .split('-')[2]
            .split(' ')[0]
        }
        month={getMonth({
          number:
            item.value[0].attributes.event?.attributes.event_starts_at.split(
              '-'
            )[1],
        })}
        eventDate={`${getDayName({ number: startDate.getDay() })} ${getMonth({
          number:
            item.value[0].attributes.event?.attributes.event_starts_at.split(
              '-'
            )[1],
        })} ${
          item.value[0].attributes.event?.attributes.event_starts_at
            .split('-')[2]
            .split(' ')[0]
        } van ${
          item.value[0].attributes.event?.attributes.event_starts_at
            .split(' ')[1]
            .split(':')[0]
        }:${
          item.value[0].attributes.event?.attributes.event_starts_at
            .split(' ')[1]
            .split(':')[1]
        } tot ${
          item.value[0].attributes.event?.attributes.event_ends_at
            .split(' ')[1]
            .split(':')[0]
        }:${
          item.value[0].attributes.event?.attributes.event_ends_at
            .split(' ')[1]
            .split(':')[1]
        }`}
        tickDateTime={item.value[0].attributes.product.attributes?.created_at}
        navigation={navigation}
        value={item.value}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  };
  return (
    <View style={styles.container}>
      <Text style={GlobalStyle.headerText}>Mijn Bestellingen</Text>
      <FlatList
        data={ticketList}
        renderItem={renderCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: normalize(14), fontWeight: 'bold' }}>
              Geen bestellingen gevonden
            </Text>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default Tickets;
