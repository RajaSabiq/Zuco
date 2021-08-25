import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';

const RegistrationComponent = ({ setEmail }) => {
  return (
    <View style={GlobalStyle.itemContainer}>
      <Image
        source={require('../assets/icon.png')}
        style={{
          marginTop: normalize(35),
          width: '100%',
          height: normalize(120),
        }}
      />
      <TextInput
        style={[GlobalStyle.textInputStyle, { marginTop: normalize(20) }]}
        placeholder={'Email'}
        onChangeText={(e) => setEmail(e)}
        keyboardType="email-address"
      />
    </View>
  );
};

export default RegistrationComponent;

const styles = StyleSheet.create({});
