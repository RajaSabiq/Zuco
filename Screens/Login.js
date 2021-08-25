import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LoginComponent from '../Components/LoginComponent';
import RegistrationComponent from '../Components/RegistrationComponent';
import { normalize } from '../Style/Responsive';
import { GlobalStyle } from '../Style/GloabalStyle';
import axios from 'axios';
import { Snackbar } from 'react-native-paper';
import {SERVER,TOKEN } from "@env"

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [visible, setVisible] = useState(false);

  const onBtnPress = () => {
    setIsWorking(true);
    if (isLogin) {
      if (email && password) {
        axios
          .post(
            `${SERVER}login`,
            {
              data: {
                type: 'login',
                attributes: {
                  email: email,
                  password: password,
                },
              },
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          )
          .then((res) => {
            setIsWorking(false);
            if (res.data?.data) {
              navigation.navigate('profile', {
                user_id: res.data.data.attributes.user_id,
              });
              setEmail('');
              setPassword('');
            }
          })
          .catch(() => {
            setIsWorking(false);
            setVisible(true);
            setMessage('Wrong email and password');
          });
      } else {
        setIsWorking(false);
        setVisible(true);
        setMessage(`Please Enter email and password`);
      }
    } else {
      if (email) {
        setIsWorking(false);
        setVisible(true);
        setMessage(`email is ${email}`);
      } else {
        setIsWorking(false);
        setVisible(true);
        setMessage(`Please Enter email `);
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={GlobalStyle.container}>
        <Image
          source={require('../assets/logo.png')}
          style={{ alignSelf: 'center', marginTop: 15 }}
        />
        <View
          style={{
            position: 'relative',
            padding: normalize(25),
            marginTop: normalize(60),
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setIsLogin(false);
            }}
          >
            <View
              style={[
                styles.btnStyle,
                {
                  right: 0,
                  backgroundColor: !isLogin ? '#B28A17' : '#000000',
                },
              ]}
            >
              <Text
                style={[
                  styles.textStyle,
                  { fontFamily: 'DMSans', marginStart: normalize(27) },
                ]}
              >
                Register
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setIsLogin(true);
            }}
          >
            <View
              style={[
                styles.btnStyle,
                { backgroundColor: isLogin ? '#B28A17' : '#000000' },
              ]}
            >
              <Text style={[styles.textStyle, { fontFamily: 'DMSans' }]}>
                Login
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {isLogin ? (
          <LoginComponent setEmail={setEmail} setPassword={setPassword} />
        ) : (
          <RegistrationComponent setEmail={setEmail} />
        )}
        <TouchableOpacity
          onPress={onBtnPress}
          style={{
            height: normalize(45),
            backgroundColor: '#B28A17',
            width: normalize(155),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            alignSelf: 'center',
          }}
        >
          {isWorking ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <Text style={[styles.textStyle, { fontSize: 17 }]}>
              {isLogin ? 'Login' : 'Email me instructions'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: normalize(35), alignSelf: 'center' }}
        >
          <Text
            style={[styles.textStyle, { fontWeight: '400', color: '#424242' }]}
          >
            Wachtwoord vergeten?
          </Text>
        </TouchableOpacity>
        <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
          <Text>{message}</Text>
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    position: 'absolute',
    borderRadius: 100,
    top: 0,
    bottom: 0,
    width: normalize(135),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default Login;
