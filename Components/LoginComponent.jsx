import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { GlobalStyle } from '../Style/GloabalStyle';
import { normalize } from '../Style/Responsive';

const LoginComponent = ({ email, setEmail, password, setPassword, error }) => {
  return (
    <View style={GlobalStyle.itemContainer}>
      <TextInput
        style={[
          GlobalStyle.textInputStyle,
          { marginTop: normalize(60), marginBottom: normalize(10) },
        ]}
        value={email}
        placeholder={'Email address'}
        onChangeText={(e) => setEmail(e)}
        keyboardType='email-address'
      />
      <TextInput
        style={[GlobalStyle.textInputStyle, { marginTop: normalize(10) }]}
        secureTextEntry={true}
        placeholder={'Password'}
        value={password}
        onChangeText={(e) => setPassword(e)}
      />
      {error.isError && (
        <Text style={[GlobalStyle.errorText, { marginTop: normalize(10) }]}>
          {error.errorMessage}
        </Text>
      )}
    </View>
  );
};

export default LoginComponent;
