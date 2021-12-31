import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import EventCard from '../Components/EventCard';
import { GlobalStyle } from '../Style/GloabalStyle';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import { useStateValue } from '../ContextApi/SateProvider';
import { normalize } from '../Style/Responsive';
import UnActiveMembershipCard from '../Components/UnActiveMembershipCard';

const Events = ({ navigation }) => {
  const [events, setEvents] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [{ isActiveMemberShip, impersonate_url }] = useStateValue();

  useEffect(() => {
    getList();
  }, []);

  const getMonth = ({ number }) => {
    switch (number) {
      case 1:
        return 'Jan';
      case 2:
        return 'Feb';
      case 3:
        return 'Mar';
      case 4:
        return 'Apr';
      case 5:
        return 'May';
      case 6:
        return 'Jun';
      case 7:
        return 'Jul';
      case 8:
        return 'Aug';
      case 9:
        return 'Sep';
      case 10:
        return 'Oct';
      case 11:
        return 'Nov';
      case 12:
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

  const getList = async () => {
    axios
      .get(`${PRODUCTIONSERVER}events`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        setRefreshing(false);
        setEvents(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const renderCard = ({ item }) => {
    let startDate = new Date(item.attributes.event_starts_at.split(' ')[0]);
    return (
      <EventCard
        id={item.id}
        eventImage={item.attributes.banner_image_path}
        eventName={item.attributes.title}
        date={startDate.getDate()}
        month={getMonth({ number: startDate.getMonth() + 1 })}
        eventDate={`${getDayName({
          number: startDate.getDay(),
        })} ${getMonth({
          number: startDate.getMonth() + 1,
        })} ${startDate.getDate()} van ${
          item.attributes.event_starts_at.split(' ')[1].split(':')[0]
        }:${item.attributes.event_starts_at.split(' ')[1].split(':')[1]} tot ${
          item.attributes.event_ends_at.split(' ')[1].split(':')[0]
        }:${item.attributes.event_ends_at.split(' ')[1].split(':')[1]}`}
        fblink={item.attributes.properties.social.facebook_url}
        ticketHandler={setIsOpen}
        url={item.attributes.url}
        navigation={navigation}
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
      <Modal visible={isOpen} transparent={false} animationType='fade'>
        <UnActiveMembershipCard
          impersonate_url={impersonate_url}
          setIsOpen={setIsOpen}
        />
      </Modal>
      <Text style={GlobalStyle.headerText}>Evenementen</Text>
      <FlatList
        data={events}
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
export default Events;
