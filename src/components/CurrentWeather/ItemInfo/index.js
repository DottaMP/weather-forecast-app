import { View, Text } from 'react-native';
import { styles } from './styles';

export const ItemInfo = ({ title, value, unit }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.text}>{value}{unit}</Text>
    </View>
  );
}