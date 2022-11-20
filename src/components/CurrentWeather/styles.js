import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    margin: 10,
  },
  hour: {
    fontSize: 55,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  date: {
    fontSize: 35,
    color: "white",
    fontWeight: '300',
    fontWeight: "bold",
    textTransform: 'capitalize'
  },
  infoContainer: {
    backgroundColor: "#18181b99",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    minHeight: 105,
  },
  locale: {
    fontSize: 35,
    color: 'white',
    fontWeight: '600',
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5
  },
});