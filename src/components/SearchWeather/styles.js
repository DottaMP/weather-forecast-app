import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#18181b99',
    paddingVertical: 30,
    paddingHorizontal: 40
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderBottomColor: "#CCC",
    borderBottomWidth: 2,
    padding: 8,
    marginBottom: 4,
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    marginLeft: 16
  },
  button: {
    width: 50,
    borderRadius: 10,
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
    justifyContent: "center",
    alignItems: 'center',
    marginRight: 30,
    flex: 1,
  },
  weekDay: {
    fontSize: 20,
    width: 160,
    color: 'white',
    backgroundColor: "#3c3c44",
    paddingVertical: 8,
    paddingHorizontal: 19,
    borderRadius: 50,
    marginBottom: 15,
    textAlign: "center",
  },
  temperature: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    textAlign: "center",
    justifyContent: "center",
  }
});