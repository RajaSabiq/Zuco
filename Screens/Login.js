import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import LoginComponent from '../Components/LoginComponent';
import RegistrationComponent from '../Components/RegistrationComponent';
import { normalize } from '../Style/Responsive';
import { GlobalStyle } from '../Style/GloabalStyle';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { Snackbar } from 'react-native-paper';
import { SERVER, TOKEN } from '@env';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [isForgetWorking, setIsForgetWorking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleForgetPassword, setVisibleForgetPassword] = useState(false);
  const [isForgetvisible, setForgetVisible] = useState(false);

  const onBtnPress = () => {
    setIsWorking(true);
    console.log(`${SERVER}auth/login`);
    if (isLogin) {
      if (email && password) {
        axios
          .post(
            `${SERVER}auth/login`,
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
        axios
          .post(
            `${SERVER}auth/register`,
            {
              data: {
                type: 'register',
                attributes: {
                  email: email,
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
          .then(() => {
            setIsWorking(false);
            setVisible(true);
            setMessage(`Send an email to :${email}`);
          });
      } else {
        setIsWorking(false);
        setVisible(true);
        setMessage(`Please Enter email `);
      }
    }
  };

  const toggole = () => {
    setVisibleForgetPassword(!visibleForgetPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal visible={visibleForgetPassword} transparent={true}>
        <BlurView
          intensity={200}
          style={{
            backgroundColor: '#fff',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 4.65,
              padding: 12,

              elevation: 7,
              borderRadius: 10,
            }}
          >
            <TouchableOpacity onPress={toggole}>
              <Entypo name='cross' size={24} color='black' />
            </TouchableOpacity>
            <TextInput
              style={[
                GlobalStyle.textInputStyle,
                { marginVertical: normalize(10) },
              ]}
              value={email}
              placeholder={'Email address'}
              onChangeText={(e) => setEmail(e)}
              keyboardType='email-address'
            />
            <TouchableOpacity
              onPress={() => {
                setIsForgetWorking(true);
                axios
                  .post(
                    `${SERVER}auth/forgot-password`,
                    {
                      data: {
                        type: 'forgot-password',
                        attributes: {
                          email: email,
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
                  .then(() => {
                    setIsForgetWorking(false);
                    setVisibleForgetPassword(false);
                    setVisible(true);
                    setMessage(`Send an email to :${email}`);
                  })
                  .catch((err) => {
                    console.log(err, email, TOKEN);
                    setIsForgetWorking(false);
                    setForgetVisible(true);
                    setMessage(`Invalid Email address`);
                  });
              }}
              style={{
                height: normalize(37),
                backgroundColor: '#B28A17',
                minWidth: normalize(100),
                alignItems: 'center',
                paddingHorizontal: normalize(7),
                justifyContent: 'center',
                borderRadius: 100,
                alignSelf: 'center',
              }}
            >
              {isForgetWorking ? (
                <ActivityIndicator color='white' size='small' />
              ) : (
                <Text style={[styles.textStyle, { fontSize: normalize(15) }]}>
                  Send
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
        <Snackbar
          visible={isForgetvisible}
          onDismiss={() => setForgetVisible(false)}
        >
          <Text>{message}</Text>
        </Snackbar>
      </Modal>
      <ScrollView style={GlobalStyle.container}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            alignSelf: 'center',
            marginTop: 15,
            height: normalize(65),
            width: normalize(152.13),
          }}
        />
        <View
          style={{
            position: 'relative',
            padding: normalize(25),
            marginTop: normalize(45),
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
            minWidth: normalize(155),
            alignItems: 'center',
            paddingHorizontal: normalize(7),
            justifyContent: 'center',
            borderRadius: 100,
            alignSelf: 'center',
          }}
        >
          {isWorking ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <Text style={[styles.textStyle, { fontSize: normalize(13) }]}>
              {isLogin ? 'Login' : 'Email me instructions'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggole}
          style={{ marginTop: normalize(35), alignSelf: 'center' }}
        >
          <Text
            style={[styles.textStyle, { fontWeight: '400', color: '#424242' }]}
          >
            Wachtwoord vergeten?
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Snackbar
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <Text>{message}</Text>
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    position: 'absolute',
    borderRadius: 100,
    top: 0,
    bottom: 0,
    minWidth: normalize(135),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default Login;
