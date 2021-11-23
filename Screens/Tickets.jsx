import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, RefreshControl, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import TicketCard from '../Components/TicketCard';
import { GlobalStyle } from '../Style/GloabalStyle';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const Tickets = ({ navigation }) => {
  const [ticketList, setTicketList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(true);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const value = await AsyncStorage.getItem('user_id');
    axios
      .get(`${PRODUCTIONSERVER}user/${value}/tickets`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        setRefreshing(false);
        setTicketList(res.data.data);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const renderCard = ({ item }) => {
    let date = new Date(
      item.attributes.event?.attributes.created_at.split('-')[0],
      item.attributes.event?.attributes.created_at.split('-')[1],
      item.attributes.event?.attributes.created_at.split('-')[2].split(' ')[0]
    );
    const tempdate = date.toLocaleString('en-us', { month: 'short' });
    const statdate = new Date(
      item.attributes.event?.attributes.created_at.split('-')[0],
      item.attributes.event?.attributes.created_at.split('-')[1],
      item.attributes.event?.attributes.created_at.split('-')[2].split(' ')[0]
    ).toLocaleString('en-us', { month: 'short' });
    return (
      <TicketCard
        eventImage={item.attributes.event?.attributes.banner_image_path}
        eventName={item.attributes.product.attributes.name}
        ticketType={item.attributes.product.attributes.category.type}
        ticketPrice={item.attributes.product.attributes.price / 100}
        date={tempdate.split(' ')[2]}
        month={tempdate.split(' ')[1]}
        eventDate={`${statdate.replace(' 00:00:00 ', ' ')} from ${
          item.attributes.event?.attributes.event_starts_at
            .split(' ')[1]
            .split(':')[0]
        }:${
          item.attributes.event?.attributes.event_starts_at
            .split(' ')[1]
            .split(':')[1]
        } To ${
          item.attributes.event?.attributes.event_ends_at
            .split(' ')[1]
            .split(':')[0]
        }:${
          item.attributes.event?.attributes.event_ends_at
            .split(' ')[1]
            .split(':')[1]
        }`}
        tickDateTime={item.attributes.product.attributes?.created_at}
        navigation={navigation}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={GlobalStyle.headerText}>Mijn Bestellingen</Text>
      <FlatList
        data={ticketList}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default Tickets;
