import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import EventCard from '../Components/EventCard';
import { GlobalStyle } from '../Style/GloabalStyle';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import { useStateValue } from '../ContextApi/SateProvider';
import { normalize } from '../Style/Responsive';
import { AntDesign } from '@expo/vector-icons';

const Events = () => {
  const [events, setEvents] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [{ isActiveMemberShip }] = useStateValue();

  useEffect(() => {
    getList();
  }, []);

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
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const renderCard = ({ item }) => {
    let date = new Date(
      item.attributes.created_at.split('-')[0],
      item.attributes.created_at.split('-')[1],
      item.attributes.created_at.split('-')[2].split(' ')[0]
    );
    const tempdate = date.toLocaleString('en-us', { month: 'short' });
    return (
      <EventCard
        eventImage={item.attributes.banner_image_path}
        eventName={item.attributes.title}
        date={tempdate.split(' ')[2]}
        month={tempdate.split(' ')[1]}
        eventDate={`${tempdate.replace(' 00:00:00 ', ' ')} from ${
          item.attributes.event_starts_at.split(' ')[1].split(':')[0]
        }:${item.attributes.event_starts_at.split(' ')[1].split(':')[1]} To ${
          item.attributes.event_ends_at.split(' ')[1].split(':')[0]
        }:${item.attributes.event_ends_at.split(' ')[1].split(':')[1]}`}
        fblink={item.attributes.properties.social.facebook_url}
        ticketHandler={setIsOpen}
      />
    );
  };
  https: return (
    <SafeAreaView style={styles.container}>
      {!isActiveMemberShip && (
        <TouchableOpacity
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
      <Modal visible={isOpen} transparent={true} animationType='slide'>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={styles.containerActive}>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
              }}
              style={{ alignSelf: 'flex-end' }}
            >
              <AntDesign name='closecircleo' size={24} color='#B28A17' />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: 'center',
                color: '#B28A17',
                fontSize: normalize(16),
                fontWeight: '700',
              }}
            >
              Opgelet!
            </Text>
            <Text style={{ textAlign: 'center', color: '#000' }}>
              U heeft geen actief membership.
            </Text>

            <Image
              source={require('../assets/membercard.png')}
              style={styles.activationImage}
            />
            <Text
              style={{
                textAlign: 'center',
                color: '#000',
                fontSize: normalize(14),
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
              <Text style={{ fontWeight: '700' }}> gaat digitaal! </Text> De
              ZUCO Magical Membercard is geldig voor 1 jaar vanaf het eerste
              gebruik.
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://app.zuconightclub.com/lidmaatschap/activeren'
                );
              }}
              style={[styles.btn, { backgroundColor: '#B28A17' }]}
            >
              <Text style={{ color: '#fff' }}>Nu aankopen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ paddingHorizontal: normalize(15) }}>
        <Text style={GlobalStyle.headerText}>Evenementen</Text>
        <FlatList
          data={events}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerActive: {
    padding: normalize(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    width: normalize(300),
  },
  activationImage: {
    width: normalize(250),
    height: normalize(250),
  },
  btn: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    paddingVertical: normalize(10),
    marginTop: normalize(10),
    width: normalize(158),
  },
});
export default Events;
