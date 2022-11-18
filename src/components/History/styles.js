import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181b99',
    paddingVertical: 30,
    paddingHorizontal: 40
  },
  listItemContainer: {
    backgroundColor: '#000000033',
    justifyContent: "space-between",
    alignItems: 'center',
    borderColor: '#eee',
    borderWidth: 1,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  datetime: {
    fontWeight: 'bold',
  },
});