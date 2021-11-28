import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Image,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { normalize } from '../Style/Responsive';

const UnActiveMembershipCard = ({ setIsOpen, impersonate_url }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: normalize(25),
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setIsOpen(false);
        }}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        <AntDesign name='closecircleo' size={30} color='#B28A17' />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#B28A17',
            fontSize: normalize(16),
            fontWeight: '700',
            marginBottom: normalize(10),
          }}
        >
          Opgelet!
        </Text>
        <Text style={{ textAlign: 'center', color: '#000' }}>
          U heeft geen actief membership.
        </Text>
      </View>

      <Image
        source={require('../assets/membercard.png')}
        style={styles.activationImage}
      />
      <Text
        style={{
          textAlign: 'center',
          color: '#000',
          fontSize: normalize(14),
          lineHeight: 30,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: '#B28A17',
            fontWeight: '700',
          }}
        >
          ZUCO Membercard{' '}
        </Text>
        <Text style={{ fontWeight: '700' }}>gaat digitaal! {`\n`}</Text>
        De ZUCO Magical Membercard is geldig voor 1 jaar vanaf het eerste
        gebruik.
      </Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            impersonate_url +
              '&redirect=https://app.zuconightclub.com/lidmaatschap/activeren'
          );
        }}
        style={[styles.btn, { backgroundColor: '#B28A17' }]}
      >
        <Text style={{ color: '#fff' }}>Nu aankopen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerActive: {
    padding: normalize(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    width: normalize(300),
  },
  activationImage: {
    width: normalize(291),
    height: normalize(219),
  },
  btn: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    paddingVertical: normalize(10),
    marginTop: normalize(10),
    width: normalize(158),
  },
});

export default UnActiveMembershipCard;
