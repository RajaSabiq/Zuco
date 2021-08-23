import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';

const LoginComponent = ({ setEmail, setPassword }) => {
  return (
    <View style={GlobalStyle.itemContainer}>
      <TextInput
        style={[
          GlobalStyle.textInputStyle,
          { marginTop: normalize(60), marginBottom: normalize(10) },
        ]}
        placeholder={'Email address'}
        onChangeText={(e) => setEmail(e)}
      />
      <TextInput
        style={[GlobalStyle.textInputStyle, { marginTop: normalize(10) }]}
        secureTextEntry={true}
        placeholder={'Password'}
        onChangeText={(e) => setPassword(e)}
      />
    </View>
  );
};

export default LoginComponent;
