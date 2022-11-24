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
//importa a api da oracle
import { oracleApi } from "../../lib/oracleApi";
//importa a estilização
import { styles } from './styles';

//Função que cria o histórico
export function History() {
  //declaração dos estado
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //ADD COMENT
  useEffect(() => {
    oracleApi.get('/?limit=10000&totalResults=true') //metodo get da api oracle, 
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

  //retorno é a montagem da pagina que será exibida para o usuario, com a estilização e os dados que devem ser exibidos consolidados.
  return (
    <View style={styles.container}>
      { isLoading ? ( //usando o icone de loading // carregando
        <ActivityIndicator size="large" color="white"/>
      ): (
        <FlatList
          style={{ width: '100%' }}
          data={history}
          showsVerticalScrollIndicator={false} //esconde o scroll lateral da tela, que não é usual em aplicações mobile
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