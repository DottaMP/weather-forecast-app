// rnfes
import { 
  // Hooks permitem "enganchar" os recursos do React, como métodos de estado e ciclo de vida.
  useEffect,
  useState 
} from 'react';

import { 
  Alert, 
  FlatList, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TextInput, 
  View
} from 'react-native';

import { 
  Avatar, 
  Button, 
  ListItem 
} from '@rneui/themed';
 
import { format } from 'date-fns'; //https://date-fns.org/v2.29.3/docs/format
import ptBR from 'date-fns/locale/pt-BR';
//importa a api weather (sugestão)
import { weatherApi } from '../../lib/weatherApi';
//importa a api da oracle
import { oracleApi } from '../../lib/oracleApi';
//importa a estilização
import { styles } from './styles'


//Cria busca de previsão de tempo
export const SearchWeather = () => {
  //declaração dos estado
  const [city, setCity] = useState(''); //atualiza a cidade - base para buscar a previsão do tempo
  const [dailyWeather, setDailyWeather] = useState([]); //atualiza clima

  //para transformar o valor recebido em city em uma palavra com letras maiusculas
  const TextToUpperCase = (city) => {
    // tranforma a entrada de texto em UpperCase
    city = city.toUpperCase() //city recebe city com o metodo upper case, para transformar o valor em maiuscula
    setCity(city) //atribui o texto editado (em maisculo) na variavel city.
  }

  //ADD COMENT
  useEffect(() => {
    if (dailyWeather.length) { //
      oracleApi.post('/', { //consumindo api da oracle, metodo post, adicionando uma nova data.
        datahora: new Date(),
        cidade: city, //recebe a cidade
      });
    }  
  }, [dailyWeather]); //adiciona dependencia, quando usamos algo de fora precisamos colocar como dependencia.

  const handleGetWeather = async () => { //ADD COMENT!!!!!!!
    Keyboard.dismiss();// ADD COMENT!!!!!!!!!!!!!!!!!!!

    //inicio do try catch que faz: tenta trazer as informações de tempo, caso não consiga exibe um alerta de erro (linha 73)
    try {
      const locales = await weatherApi.get(`/geo/1.0/direct?q=${city}&limit=1`); //ADD COMENT

      //se os dados coletados derem match com alguma localização devolve a data e traduzida
      if (locales.data.length) {
        const { lat, lon } = locales.data[0]; //ADD COMENT

        //ADD COMENT!!!!!!!!!!!!!!
        const response = await weatherApi.get(`data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric`);

        setDailyWeather(response.data.daily.map((dayData, index) => ({ //
          ...dayData,
          dateFormatted: index === 0
            ? 'hoje'
            : format(new Date(dayData.dt * 1000), 'EEEE', { locale: ptBR }), //formata a data traduzindo para brasileiro
        })));
      } else { //caso não exibe alerta que não encontrou match com nenhuma localização.
        Alert.alert(
          'Cidade não encontrada',
          'Não foi possível encontrar o clima para a cidade pesquisada'
        );
        setDailyWeather([]);
      }
    } catch (err) { //catch (fechamento do try catch, que é um estrutura de tratamento, que consistem tentar uma vez e caso não dar certo devolver a tratativa (catch))
      Alert.alert( //tratativa: pop de alerta com mensagem de erro.
        'Erro',
        'Ocorreu um erro ao trazer as informações do clima'
      );
    }
  }

  //retorno é a montagem da pagina que quero exibir, onde juntamos os dados e estilizamos a tela que será exibida pela aplicação
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'android' ? 'height' : 'padding' } //faz a configuração para tela android
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="Pesquise uma cidade..."
          value={city}
          onChangeText={TextToUpperCase}
        />

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title="Ok"
            type="solid"
            disabled={!city}
            onPress={handleGetWeather}
          />
        </View>
      </View>

      <FlatList //ADD COMENT
        style={{ marginTop: 32, width: '100%' }}
        data={dailyWeather}
        showsVerticalScrollIndicator={false}
        keyExtractor={weather => weather.dt}
        renderItem={({ item: weather }) => (
          <ListItem containerStyle={styles.listItemContainer}>
            <Avatar
              source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
              size="xlarge"
              containerStyle={{ flex: 1 }}
            />
            <ListItem.Content style={styles.content}>
              <ListItem.Title style={styles.weekDay}>
                {weather.dateFormatted}
              </ListItem.Title>

              <Text style={styles.temperature}>
                Min {Math.round(weather.temp.min)} &#176;C
              </Text>

              <Text style={styles.temperature}>
                Máx {Math.round(weather.temp.max)} &#176;C
              </Text>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </KeyboardAvoidingView>
  );
}

