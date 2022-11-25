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

//A ideia é trazer tudo que foi pesquisado, então tudo que foi pesquisado la no search é armazenado no banco de dados da oracle.
//Com tudo: quero dizer hora e data em que aconteceu a pesquisa de uma cidade.
//Função que cria o histórico
export function History() {
  //declaração dos estado
  const [history, setHistory] = useState([]); //é o histórico, que inicialmente começa vazio
  const [isLoading, setIsLoading] = useState(true); //loading é o carregar mesmo, nessa tela está super rapido, então não vai dar pra ver muito

  //Uso essa função de efeito quando abrir a tela, então a dependencia é vazia
  useEffect(() => {
    oracleApi.get('/?limit=10000&totalResults=true') //metodo get / porque e url padrão - 
    // - /?limit=10000&totalResults=true - é um completamento da api da oracle, sem esse complemento ele mostra só 20 resultados no histórico, essa informação a gente pegou na documetação da oracle, assim ele coloca um limite de 10.000 resultados, traduzindo tudo que pesquisamos.
      .then((response) => { //pego a resposta que volta do get acima
        //faz a ordenação dos resultados
        const sortedHistory = response.data.items.sort((a, b) => {
          return new Date(b.datahora) - new Date(a.datahora) //renderiza pela data de forma descendente, do maior pro menor
        });
        
        //setendo dentro de history o resultado
        setHistory(sortedHistory.map(item => ({ //esse map para formatar data
          id: item.cod_weathersearch,
          city: item.cidade,
          datetime: format(new Date(item.datahora), 'dd/MM/yyyy HH:mm'), //formato tradicional
        })));
      })
      .finally(() => { //independente se der certo ou errado ele traz o loading
        setIsLoading(false); //
      })
  }, []); //dependencia vazia

  //retorno é a montagem da pagina que será exibida para o usuario, com a estilização e os dados que devem ser exibidos consolidados.
  return (
    <View style={styles.container}>
      { isLoading ? ( //usando o icone de loading // carregando
        <ActivityIndicator size="large" color="white"/>
      ): (
        <FlatList /* cria listas simples e basicas */
          style={{ width: '100%' }}
          data={history}
          showsVerticalScrollIndicator={false} //esconde o scroll lateral da tela, que não é usual em aplicações mobile
          keyExtractor={historyItem => historyItem.id} // é o id la do banco
          renderItem={({ item }) => ( //chama o mesmo listItem mas sem o avatar, sem o icon (renderItem = pega o item de data e processa na lista)
            <ListItem containerStyle={styles.listItemContainer}> {/* serve para atribuir as caracteristicas de cada item - usada a cada item */}
              <ListItem.Content style={styles.content}>
                <Text style={styles.text}>
                  <Text style={styles.datetime}>{item.datetime}</Text> - {item.city} {/* existe para que esse padaço fique com style a mais, em negrito a data e hora*/} 
                </Text>
              </ListItem.Content>
            </ListItem>
          )}
        />
      )}
    </View>
  );
}