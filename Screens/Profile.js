import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { SERVER, TOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Base64 from 'Base64';

const Profile = ({ route }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const value = await AsyncStorage.getItem('user_id');
      if (value !== null) {
        console.log(value);
        axios
          .get(`${SERVER}user/${value}`, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })
          .then((res) => {
            setIsLoading(false);
            setData(res.data.data);
            selfCalling();
          });
      }
    })();
  }, []);

  const selfCalling = async () => {
    setCurrentTime(new Date().getTime());
    if (data) {
      const expireyDate = Date.parse(
        data?.relationships['qr-code'].data.attributes.expired_at.split(
          ' '
        )[0] +
          'T' +
          data?.relationships['qr-code'].data.attributes.expired_at.split(
            ' '
          )[1]
      );
      if (expireyDate >= currentTime) {
        // console.log('[+] Expiery Exceed');

        const value = await AsyncStorage.getItem('user_id');
        axios
          .get(`${SERVER}user/${value}`, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })
          .then((res) => {
            setData(res.data.data);
          });
      }
    }
    // console.log('Outside');
    setInterval(() => {
      // console.log('Inside');
      selfCalling();
    }, 120000);
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
        {data?.relationships?.length > 0
          ? data?.relationships['active-membership']?.data?.attributes
              ?.validity_from
          : ' 0000-00-00 '}
        -
        {data?.relationships?.length > 0
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
