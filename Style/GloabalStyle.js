import { StyleSheet } from 'react-native';
import { normalize } from './Responsive';

export const GlobalStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(50),
    backgroundColor: '#fff',
  },
  itemContainer: {
    height: normalize(230),
    alignItems: 'center',
  },
  textInputStyle: {
    borderColor: '#ccc',
    borderWidth: 2,
    padding: normalize(9),
    backgroundColor: '#fff',
    borderRadius: 100,
    fontSize: normalize(12),
    paddingHorizontal: normalize(15),
    width: '100%',
  },
  headerText: {
    fontSize: normalize(25),
    fontWeight: '700',
    color: '#000',
    marginLeft: normalize(25),
    marginBottom: normalize(10),
  },
  row: {
    flexDirection: 'column',
    paddingHorizontal: normalize(25),
  },
  errorText: {
    color: 'red',
    fontSize: normalize(12),
  },
});
