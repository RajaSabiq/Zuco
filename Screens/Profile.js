import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { SERVER, TOKEN } from '@env';

const Profile = ({ route }) => {
  const [data, setData] = useState('');
  useEffect(() => {
    console.log(`${SERVER}user/${route.params.user_id}`);
    axios
      .get(`${SERVER}user/${route.params.user_id}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
      });
  }, []);

  return (
    <View style={[GlobalStyle.container, { alignItems: 'center' }]}>
      <Image
        source={require('../assets/icon.png')}
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
        Geboortedatum: 01-01-1111
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins',
          fontWeight: '700',
          fontSize: 13,
          marginVertical: normalize(3),
        }}
      >
        Lidmaatschap: 08-01-2021 - 08-01-2022
      </Text>
      <Image
        source={{
          uri: data?.attributes?.qr,
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
