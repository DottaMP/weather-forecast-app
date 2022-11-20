// rnfes
import { 
  // Hooks permitem "enganchar" os recursos do React, como métodos de estado e ciclo de vida.
  useState, 
  useEffect 
} from 'react';

import { 
  ActivityIndicator,
  FlatList,
  Text, 
  View 
} from 'react-native';

import { ListItem } from '@rneui/themed';
import { format } from "date-fns"; //https://date-fns.org/v2.29.3/docs/format
import { oracleApi } from "../../lib/oracleApi";
import { styles } from './styles';

export function History() {
  //declaração dos estado
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    oracleApi.get('/?limit=10000&totalResults=true')
      .then((response) => {
        const sortedHistory = response.data.items.sort((a, b) => {
          return new Date(b.datahora) - new Date(a.datahora)
        });
        
        setHistory(sortedHistory.map(item => ({
          id: item.cod_weathersearch,
          city: item.cidade,
          datetime: format(new Date(item.datahora), 'dd/MM/yyyy HH:mm'),
        })));
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  return (
    <View style={styles.container}>
      { isLoading ? (
        <ActivityIndicator size="large" color="white"/>
      ): (
        <FlatList
          style={{ width: '100%' }}
          data={history}
          showsVerticalScrollIndicator={false}
          keyExtractor={historyItem => historyItem.id}
          renderItem={({ item }) => (
            <ListItem containerStyle={styles.listItemContainer}>
              <ListItem.Content style={styles.content}>
                <Text style={styles.text}>
                  <Text style={styles.datetime}>{item.datetime}</Text> - {item.city}     
                </Text>
              </ListItem.Content>
            </ListItem>
          )}
        />
      )}
    </View>
  );
}