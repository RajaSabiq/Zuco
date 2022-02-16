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
import { BlurView } from 'expo-blur';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Brightness from 'expo-brightness';
import { useStateValue } from '../ContextApi/SateProvider';
import Axios from '../axios/axios';

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
  const [isError, setIsError] = useState({
    isError: false,
    errorMessage: 'Wachtwoord of gebruikersnaam is incorrect. Probeer opnieuw.',
  });
  const [state, dispatch] = useStateValue();
  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        Brightness.setSystemBrightnessAsync(1);
        Brightness.setBrightnessAsync(1);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('user_id');
        if (value !== null) {
          navigation.replace('Home', {
            screen: 'HomeTab',
          });
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
        Axios.post(`auth/login`, {
          data: {
            type: 'login',
            attributes: {
              email: email,
              password: password,
            },
          },
        })
          .then(async (res) => {
            setIsWorking(false);
            if (res.data?.data) {
              await AsyncStorage.setItem(
                'user_id',
                res.data.data.attributes.user_id.toString()
              );
              await AsyncStorage.setItem(
                'user_id',
                res.data.data.attributes.user_id.toString()
              );
              navigation.replace('Home', {
                screen: 'HomeTab',
              });
              setEmail('');
              setPassword('');
            } else {
              setIsError({
                isError: true,
                errorMessage:
                  'Wachtwoord of gebruikersnaam is incorrect. Probeer opnieuw.',
              });
            }
          })
          .catch(() => {
            setIsError({
              isError: true,
              errorMessage:
                'Wachtwoord of gebruikersnaam is incorrect. Probeer opnieuw.',
            });
            setIsError({
              isError: true,
              errorMessage:
                'Wachtwoord of gebruikersnaam is incorrect. Probeer opnieuw.',
            });
          });
      } else {
        setIsWorking(false);
        setIsError({
          isError: true,
          errorMessage:
            'Wachtwoord of gebruikersnaam is incorrect. Probeer opnieuw.',
        });
      }
    } else {
      if (email) {
        Axios.post(`auth/register`, {
          data: {
            type: 'register',
            attributes: {
              email: email,
            },
          },
        }).then(() => {
          setEmail('');
          setIsWorking(false);
          setVisible(true);
          setMessage(`Send an email to :${email}`);
        });
      } else {
        setIsWorking(false);
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
                    Axios.post(`auth/forgot-password`, {
                      data: {
                        type: 'forgot-password',
                        attributes: {
                          email: email,
                        },
                      },
                    })
                      .then(() => {
                        setEmail('');
                        setPassword('');
                        setIsForgetWorking(false);
                        setVisibleForgetPassword(false);
                        setVisible(true);
                        setMessage(`Send an email to :${email}`);
                      })
                      .catch(() => {
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
                error={isError}
              />
            ) : (
              <RegistrationComponent setEmail={setEmail} email={email} />
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
          {/* <Snackbar
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
          </Snackbar> */}
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
