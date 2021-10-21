import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import LoginComponent from '../Components/LoginComponent';
import RegistrationComponent from '../Components/RegistrationComponent';
import { normalize } from '../Style/Responsive';
import { GlobalStyle } from '../Style/GloabalStyle';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN } from '@env';

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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('user_id');
        if (value !== null) {
          navigation.replace('profile');
        } else {
          setIsLoading(true);
        }
      } catch (e) {
        // saving error
      }
    })();
  }, []);

  const onBtnPress = () => {
    setIsWorking(true);
    if (isLogin) {
      if (email && password) {
        if (new Date().getTime().toString().split(' ')[1] == 'GMT +0200') {
          axios
            .post(
              `${PRODUCTIONSERVER}auth/login`,
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
                  Authorization: `Bearer ${PRODUCTIONTOKEN}`,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            )
            .then(async (res) => {
              setIsWorking(false);
              if (res.data?.data) {
                await AsyncStorage.setItem(
                  'user_id',
                  res.data.data.attributes.user_id.toString()
                );
                navigation.replace('profile');
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
          Alert.alert('Your Timespan is not GMT +0200');
          setIsWorking(false);
        }
      } else {
        setIsWorking(false);
        setVisible(true);
        setMessage(`Please Enter email and password`);
      }
    } else {
      if (email) {
        axios
          .post(
            `${PRODUCTIONSERVER}auth/register`,
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
                Authorization: `Bearer ${PRODUCTIONTOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          )
          .then(() => {
            setEmail('');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {!isLoading ? (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <ActivityIndicator size={'large'} color={'#333'} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
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
                  padding: normalize(25),
                  position: 'relative',
                  elevation: 7,

                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: 'gray',
                    borderRadius: 100,
                    padding: 5,
                    top: 10,
                    right: 10,
                    position: 'absolute',
                  }}
                  onPress={toggole}
                >
                  <Entypo name='cross' size={20} color='black' />
                </TouchableOpacity>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                    fontSize: normalize(14),
                  }}
                >
                  Wachtwoord vergeten?
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: 'DMSans',
                    color: 'gray',
                    fontSize: normalize(12),
                  }}
                >
                  Laat hieronder uw email adres achter.{'\n'}
                  We sturen je zo dadelijk een reset link.
                </Text>
                <TextInput
                  style={[
                    GlobalStyle.textInputStyle,
                    { marginVertical: normalize(20) },
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
                        `${PRODUCTIONSERVER}auth/forgot-password`,
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
                            Authorization: `Bearer ${PRODUCTIONTOKEN}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                          },
                        }
                      )
                      .then(() => {
                        setEmail('');
                        setPassword('');
                        setIsForgetWorking(false);
                        setVisibleForgetPassword(false);
                        setVisible(true);
                        setMessage(`Send an email to :${email}`);
                      })
                      .catch((err) => {
                        setIsForgetWorking(false);
                        setForgetVisible(true);
                        setMessage(`Invalid Email address`);
                      });
                  }}
                  style={{
                    height: normalize(40),
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
                    <Text
                      style={[styles.textStyle, { fontSize: normalize(15) }]}
                    >
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
          <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: normalize(50),
              paddingVertical: normalize(25),
            }}
          >
            <Image
              source={require('../assets/logo.png')}
              style={{
                alignSelf: 'center',
                marginTop: normalize(20),
                height: normalize(65),
                width: normalize(152.13),
                maxHeight: 150,
                maxWidth: 360,
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
              <LoginComponent
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            ) : (
              <RegistrationComponent setEmail={setEmail} />
            )}
            <TouchableOpacity
              onPress={onBtnPress}
              style={{
                height: normalize(45),
                backgroundColor: '#B28A17',
                minWidth: normalize(160),
                alignItems: 'center',
                paddingHorizontal: normalize(7),
                justifyContent: 'center',
                borderRadius: 100,
                alignSelf: 'center',
                maxHeight: 120,
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
              style={{ marginTop: normalize(25), alignSelf: 'center' }}
            >
              <Text
                style={[
                  styles.textStyle,
                  { fontWeight: '400', color: '#424242' },
                ]}
              >
                Wachtwoord vergeten?
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <Snackbar
            style={{
              position: 'absolute',
              bottom: normalize(5),
              left: normalize(10),
              right: normalize(10),
            }}
            visible={visible}
            duration={1000}
            onDismiss={() => setVisible(false)}
          >
            <Text>{message}</Text>
          </Snackbar>
        </View>
      )}
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
    maxHeight: 120,

    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: normalize(12),
  },
});

export default Login;
