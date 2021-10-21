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
} from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import axios from 'axios';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import Base64 from 'Base64';

const Profile = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  useEffect(() => {
    setIsLoading(true);
    selfCalling();
  }, []);
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to Exit?', [
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.clear().then(() => {
            navigation.replace('login');
          });
        },
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
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
    setCurrentTime(new Date().getTime());
    console.log(new Date().toTimeString());
    const value = await AsyncStorage.getItem('user_id');
    axios
      .get(`${PRODUCTIONSERVER}user/${value}`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        const expirey = new Date(
          res.data?.data?.relationships[
            'qr-code'
          ].data.attributes.expired_at.split(' ')[0] +
            ' ' +
            res.data?.data?.relationships[
              'qr-code'
            ].data.attributes.expired_at.split(' ')[1]
        );
        setData(res.data.data);
        var interval =
          parseInt(expirey.getTime()) - parseInt(new Date().getTime());
        if (interval < 0) {
          interval = 60000;
        }

        console.log(diff_minutes(expirey, new Date()), new Date().getTime());

        setInterval(() => {
          selfCalling();
        }, parseInt(interval));
      });
  };

  function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: normalize(15),
        backgroundColor: '#fff',
      }}
    >
      {Device.osName !== 'Android' ? (
        <TouchableOpacity onPress={backAction}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      ) : null}
      {isLoading ? (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <ActivityIndicator size='large' color='black' />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
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
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image
              source={require('../assets/logo.png')}
              style={{
                width: normalize(125),
                height: normalize(55),
                maxWidth: 350,
                maxHeight: 150,
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
export default Profile;

const styles = StyleSheet.create({});
