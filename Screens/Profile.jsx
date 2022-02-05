import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { normalize } from '../Style/Responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Brightness from 'expo-brightness';
import { useStateValue } from '../ContextApi/SateProvider';
import * as ImagePicker from 'expo-image-picker';
import Axios from '../axios/axios';
import { BlurView } from 'expo-blur';

const Profile = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  var timer = useRef(null);

  const onRefresh = React.useCallback(async () => {
    setIsLoading(true);
    clearTimeout(timer);
    selfCalling();
  }, []);

  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);

  const pickImage = async () => {
    setOpenPhotoDialog(false);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      const { uri, type } = result;

      const value = await AsyncStorage.getItem('user_id');
      const formData = new FormData();
      formData.append('data[type]', 'user');
      formData.append('data[attributes][profile_image]', {
        uri,
        name: 'profile_image' + uri.split('/').pop(),
        type: 'image/jpeg',
      });

      Axios.post(`user/${value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        setIsLoading(true);
        clearTimeout(timer);
        selfCalling();
      });
    } catch (e) {
      console.log(e);
    }
  };

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
    setIsLoading(true);
    selfCalling();
  }, []);

  const selfCalling = async () => {
    const value = await AsyncStorage.getItem('user_id');
    Axios.get(`user/${value}`).then((res) => {
      setIsLoading(false);
      setData(res.data.data);
      dispatch({
        type: 'SET_MEMBERSHIP',
        isActiveMemberShip:
          res.data.data.relationships['active-membership'] !== undefined,
        impersonate_url: res.data.data.attributes.impersonate_url,
      });
      timer = setTimeout(() => {
        clearTimeout(timer);
        selfCalling();
      }, parseInt(res.data.data.relationships['qr-code'].data.attributes['expires_in']));
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
      }}
    >
      <Modal visible={openPhotoDialog} animationType='fade' transparent>
        <BlurView
          tint='dark'
          intensity={100}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              padding: normalize(20),
              borderRadius: normalize(10),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: normalize(17),
                fontWeight: 'bold',
                color: '#B28A17',
              }}
            >
              Profielfoto Wijzigen
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: normalize(14),
                color: '#5C5C5C',
                fontWeight: '300',
              }}
            >
              Wenst u uw profielfoto toe te voegen of te wijzigen?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
                marginTop: normalize(15),
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#000',
                  paddingHorizontal: normalize(30),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(10),
                }}
                onPress={() => setOpenPhotoDialog(false)}
              >
                <Text
                  style={{
                    color: '#fff',
                  }}
                >
                  Terug
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#B28A17',
                  paddingHorizontal: normalize(30),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(10),
                }}
                onPress={pickImage}
              >
                <Text
                  style={{
                    color: '#fff',
                  }}
                >
                  Wijzig
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <ScrollView
        style={{
          flex: 1,
        }}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            height: (Dimensions.get('window').height * 70) / 100,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <TouchableOpacity onPress={() => setOpenPhotoDialog(true)}>
            <Image
              source={
                data?.attributes?.profile_image_path
                  ? { uri: data?.attributes?.profile_image_path }
                  : require('../assets/icon.png')
              }
              style={{
                width: normalize(130),
                height: normalize(130),
                maxHeight: 220,
                maxWidth: 220,
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
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
              fontSize: normalize(11),
              marginVertical: normalize(3),
            }}
          >
            Email: {data?.attributes?.email}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: normalize(11),
              marginVertical: normalize(3),
            }}
          >
            Geboortedatum: {data?.attributes?.date_of_birth}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: normalize(11),
              marginVertical: normalize(3),
            }}
          >
            Lidmaatschap:
            {data?.relationships
              ? data?.relationships['active-membership']?.data?.attributes
                  ?.validity_from
              : ' 0000-00-00 '}{' '}
            :{' '}
            {data?.relationships
              ? data?.relationships['active-membership']?.data?.attributes
                  ?.validity_until
              : ' 0000-00-00'}
          </Text>
          <View
            style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={{
                uri:
                  data?.relationships &&
                  `data:image/jpeg;base64,${data?.relationships['qr-code'].data.attributes.image}`,
              }}
              style={{
                width: normalize(170),
                height: normalize(170),
                maxHeight: 350,
                maxWidth: 350,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile;

const styles = StyleSheet.create({});
