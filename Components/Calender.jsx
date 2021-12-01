import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { normalize } from '../Style/Responsive';

const Calender = ({
  scale,
  marginTop,
  fontSizeDate,
  fontSizeMonth,
  borderRadius,
  date,
  month,
}) => {
  return (
    <View
      style={[
        styles.calendarContainer,
        {
          width: normalize(scale),
          height: normalize(scale),
          marginTop: normalize(marginTop),
          borderRadius: normalize(borderRadius),
        },
      ]}
    >
      <Text
        style={[
          styles.month,
          {
            fontSize: normalize(fontSizeMonth),
            borderTopLeftRadius: normalize(borderRadius),
            borderTopRightRadius: normalize(borderRadius),
          },
        ]}
      >
        {month}
      </Text>
      <Text
        style={[
          styles.date,
          {
            fontSize: normalize(fontSizeDate),
            borderBottomLeftRadius: normalize(borderRadius),
            borderBottomRightRadius: normalize(borderRadius),
          },
        ]}
      >
        {date}
      </Text>
    </View>
  );
};

export default Calender;

const styles = StyleSheet.create({
  calendarContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  month: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#B40000',
    color: '#fff',
    fontWeight: 'bold',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    flex: 2,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    color: '#000000',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
