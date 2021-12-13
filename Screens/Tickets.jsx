import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import TicketCard from '../Components/TicketCard';
import { GlobalStyle } from '../Style/GloabalStyle';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useStateValue } from '../ContextApi/SateProvider';
import UnActiveMembershipCard from '../Components/UnActiveMembershipCard';
import { normalize } from '../Style/Responsive';

const Tickets = ({ navigation }) => {
  const [ticketList, setTicketList] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [{ isActiveMemberShip, impersonate_url }] = useStateValue();

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
        const { data } = res;
        const groupData = data.data.reduce((r, a) => {
          r[a.attributes.event.id] = [...(r[a.attributes.event.id] || []), a];
          return r;
        }, {});
        const groupDataArray = Object.keys(groupData).map((key) => ({
          key,
          value: groupData[key],
        }));
        setTicketList(groupDataArray);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const getMonth = ({ number }) => {
    switch (number) {
      case '1':
        return 'Jan';
      case '2':
        return 'Feb';
      case '3':
        return 'Mar';
      case '4':
        return 'Apr';
      case '5':
        return 'May';
      case '6':
        return 'Jun';
      case '7':
        return 'Jul';
      case '8':
        return 'Aug';
      case '9':
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
      case 7:
        return 'Sun';
    }
  };

  const renderCard = ({ item }) => {
    let startDate = new Date(
      item.value[0].attributes.event?.attributes.event_starts_at.split(' ')[0]
    );
    startDate.setTime(
      startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
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
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
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
      <Modal visible={isOpen} transparent={false} animationType='slide'>
        <UnActiveMembershipCard
          impersonate_url={impersonate_url}
          setIsOpen={setIsOpen}
        />
      </Modal>
      <Text style={GlobalStyle.headerText}>Mijn Bestellingen</Text>
      <FlatList
        style={{ flex: 1 }}
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
