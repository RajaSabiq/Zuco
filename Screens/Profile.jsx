import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { normalize } from '../Style/Responsive';
import axios from 'axios';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness';
import { useStateValue } from '../ContextApi/SateProvider';
import UnActiveMembershipCard from '../Components/UnActiveMembershipCard';

const Profile = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [{ isActiveMemberShip, impersonate_url }] = useStateValue();

  const onRefresh = React.useCallback(async () => {
    setIsLoading(true);
    const value = await AsyncStorage.getItem('user_id');
    axios
      .get(`${PRODUCTIONSERVER}user/${value}`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setData(res.data.data);
        dispatch({
          type: 'SET_MEMBERSHIP',
          isActiveMemberShip:
            res.data.data.relationships['active-membership'] !== undefined,
          impersonate_url: res.data.data.attributes.impersonate_url,
        });
      });
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        Brightness.setSystemBrightnessAsync(1);
        Brightness.setBrightnessAsync(1);
      }
    })();
  }, []);
  useEffect(() => {
    setIsLoading(true);
    selfCalling();
  }, []);
  const backAction = () => {
    Alert.alert('Opgelet!', 'Zeker dat je wilt afsluiten?', [
      {
        text: ' Log Out',
        onPress: async () => {
          await AsyncStorage.clear().then(() => {
            navigation.replace('login');
          });
        },
        style: 'cancel',
      },
      {
        text: Device.osName !== 'Android' ? 'NO' : 'YES',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const selfCalling = async () => {
    const value = await AsyncStorage.getItem('user_id');
    axios
      .get(`${PRODUCTIONSERVER}user/${value}`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setData(res.data.data);
        dispatch({
          type: 'SET_MEMBERSHIP',
          isActiveMemberShip:
            res.data.data.relationships['active-membership'] !== undefined,
          impersonate_url: res.data.data.attributes.impersonate_url,
        });
        setTimeout(() => {
          selfCalling();
        }, parseInt(res.data.data.relationships['qr-code'].data.attributes['expires_in']));
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
      }}
    >
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
      {Device.osName !== 'Android' ? (
        <TouchableOpacity
          style={{
            paddingHorizontal: normalize(15),
          }}
          onPress={backAction}
        >
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      ) : null}
      <ScrollView
        style={{
          flex: 1,
        }}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            height: (Dimensions.get('window').height * 80) / 100,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Image
            source={
              data?.attributes?.profile_image_path
                ? { uri: data?.attributes?.profile_image_path }
                : require('../assets/icon.png')
            }
            style={{
              width: normalize(130),
              height: normalize(130),
              maxHeight: 220,
              maxWidth: 220,
              borderRadius: 20,
              marginTop: 10,
            }}
          />
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '600',
              color: '#B28A17',
              fontSize: normalize(17),
              marginTop: normalize(15),
            }}
          >
            {data?.attributes?.first_name} {data?.attributes?.last_name}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: normalize(11),
              marginVertical: normalize(3),
            }}
          >
            Email: {data?.attributes?.email}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: normalize(11),
              marginVertical: normalize(3),
            }}
          >
            Geboortedatum: {data?.attributes?.date_of_birth}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: normalize(11),
              marginVertical: normalize(3),
            }}
          >
            Lidmaatschap:
            {data?.relationships
              ? data?.relationships['active-membership']?.data?.attributes
                  ?.validity_from
              : ' 0000-00-00 '}{' '}
            :{' '}
            {data?.relationships
              ? data?.relationships['active-membership']?.data?.attributes
                  ?.validity_until
              : ' 0000-00-00'}
          </Text>
          <View
            style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={{
                uri:
                  data?.relationships &&
                  `data:image/jpeg;base64,${data?.relationships['qr-code'].data.attributes.image}`,
              }}
              style={{
                width: normalize(170),
                height: normalize(170),
                maxHeight: 350,
                maxWidth: 350,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile;

const styles = StyleSheet.create({});
