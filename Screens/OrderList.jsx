import React from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';

const OrderList = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({});
