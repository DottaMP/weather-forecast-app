import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { ListItem } from '@rneui/themed';
import { format } from "date-fns";

import { oracleApi } from "../../lib/oracleApi";

import { styles } from './styles';

export function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    oracleApi.get('/')
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
        <ActivityIndicator />
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