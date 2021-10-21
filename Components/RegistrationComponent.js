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
        source={require('../assets/instructions_email_icon.png')}
        style={{
          marginTop: normalize(25),
          width: normalize(100),
          height: normalize(100),
        }}
      />
      <Text style={{ fontSize: normalize(11), textAlign: 'center' }}>
        Laat hieronder jouw email adres achter {'\n'}We sturen jou dadelijk een
        uilnodiging tot registratie via mail.
      </Text>
      <TextInput
        style={[GlobalStyle.textInputStyle, { marginTop: normalize(20) }]}
        placeholder={'Email'}
        onChangeText={(e) => setEmail(e)}
        keyboardType='email-address'
      />
    </View>
  );
};

export default RegistrationComponent;

const styles = StyleSheet.create({});
