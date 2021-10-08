import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
} from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import axios from 'axios';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Base64 from 'Base64';

const Profile = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  useEffect(() => {
    setIsLoading(true);
    selfCalling();
  }, []);

  useEffect(() => {
    var date = new Date().toISOString().split('T');
    console.log(
      date[0].replace('-', '/').replace('-', '/'),
      date[1].split('.')[0]

      // new Date().getFullYear().toString() +
      //   '/' +
      //   new Date().getMonth().toString() +
      //   '/' +
      //   new Date().getMonth().toString() +
      //   ' ' +
      //   new Date().getHours().toString() +
      //   ':' +
      //   new Date().getMinutes().toString() +
      //   ':' +
      //   new Date().getSeconds().toString() +
      //   ' +0000'
    );
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

    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === 'string' ? new Date(date) : date).toLocaleString(
          'en-US',
          { timeZone: tzString }
        )
      );
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const formatTimeByOffset = (dateString, offset) => {
    // Params:
    // How the backend sends me a timestamp
    // dateString: on the form yyyy-mm-dd hh:mm:ss
    // offset: the amount of hours to add.
    // If we pass anything falsy return empty string
    if (!dateString) return '';
    if (dateString.length === 0) return '';
    // Step a: Parse the backend date string
    // Get Parameters needed to create a new date object
    const year = dateString.slice(0, 4);
    const month = dateString.slice(5, 7);
    const day = dateString.slice(8, 10);
    const hour = dateString.slice(11, 13);
    const minute = dateString.slice(14, 16);
    const second = dateString.slice(17, 19);
    // Step: bMake a JS date object with the data
    const dateObject = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}`
    );
    // Step c: Get the current hours from the object
    const currentHours = dateObject.getHours();
    // Step d: Add the offset to the date object
    dateObject.setHours(currentHours + offset);
    // Step e: stringify the date object, replace the T with a space and slice off the seconds.
    const newDateString = dateObject.toISOString().slice(0, 19);
    // Step f: Return the new formatted date string with the added offset
    return `${newDateString}`;
  };

  const selfCalling = async () => {
    setCurrentTime(new Date().getTime());
    const value = await AsyncStorage.getItem('user_id');
    axios
      .get(`${PRODUCTIONSERVER}user/${value}`, {
        headers: {
          Authorization: `Bearer ${PRODUCTIONTOKEN}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        const expirey = Date.parse(
          res.data?.data?.relationships[
            'qr-code'
          ].data.attributes.expired_at.split(' ')[0] +
            'T' +
            res.data?.data?.relationships[
              'qr-code'
            ].data.attributes.expired_at.split(' ')[1]
        );
        setData(res.data.data);
        console.log(
          PRODUCTIONSERVER,
          PRODUCTIONTOKEN,
          parseInt(expirey) - parseInt(currentTime)
        );
        setInterval(() => {
          selfCalling();
        }, (parseInt(expirey) - parseInt(currentTime)) / 100);
      });
  };

  return isLoading ? (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <ActivityIndicator size='large' color='black' />
    </View>
  ) : (
    <View style={[GlobalStyle.container, { alignItems: 'center' }]}>
      <Image
        source={
          data?.attributes?.profile_image_path
            ? { uri: data?.attributes?.profile_image_path }
            : require('../assets/icon.png')
        }
        style={{
          width: normalize(130),
          height: normalize(130),
          borderRadius: 20,
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
          fontSize: 13,
          marginVertical: normalize(3),
        }}
      >
        Email: {data?.attributes?.email}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins',
          fontWeight: '700',
          fontSize: 13,
          marginVertical: normalize(3),
        }}
      >
        Geboortedatum: {data?.attributes?.date_of_birth}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins',
          fontWeight: '700',
          fontSize: 13,
          marginVertical: normalize(3),
        }}
      >
        Lidmaatschap:
        {data?.relationships
          ? data?.relationships['active-membership']?.data?.attributes
              ?.validity_from
          : ' 0000-00-00 '}{' '}
        -{' '}
        {data?.relationships
          ? data?.relationships['active-membership']?.data?.attributes
              ?.validity_until
          : ' 0000-00-00'}
      </Text>
      <Image
        source={{
          uri:
            data?.relationships &&
            `data:image/jpeg;base64,${data?.relationships['qr-code'].data.attributes.image}`,
        }}
        style={{
          width: normalize(170),
          height: normalize(170),
          marginTop: normalize(50),
        }}
      />
      <Image
        source={require('../assets/logo.png')}
        style={{
          width: normalize(125),
          height: normalize(55),
          marginTop: normalize(33),
        }}
      />
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({});
