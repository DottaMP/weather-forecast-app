import { useState, useEffect } from 'react';
import { 
  KeyboardAvoidingView, 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Alert,
  Platform,
  Keyboard, 
} from 'react-native';
import { Button, ListItem, Avatar } from '@rneui/themed';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { weatherApi } from '../../lib/weatherApi';
import { oracleApi } from '../../lib/oracleApi';

import { styles } from './styles'

export const SearchWeather = () => {
  const [city, setCity] = useState('');
  const [dailyWeather, setDailyWeather] = useState([]);

  const TextToUpperCase = (city) => {

    city = city.toUpperCase()
    setCity(city)
  }

  useEffect(() => {
    if (dailyWeather.length) {
      oracleApi.post('/', {
        datahora: new Date(),
        cidade: city,
      });
    }  
  }, [dailyWeather]);

  const handleGetWeather = async () => {
    Keyboard.dismiss();

    try {
      const locales = await weatherApi.get(`/geo/1.0/direct?q=${city}&limit=1`);

      if (locales.data.length) {
        const { lat, lon } = locales.data[0];

        const response = await weatherApi.get(`data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid`);

        setDailyWeather(response.data.daily.map((dayData, index) => ({
          ...dayData,
          dateFormatted: index === 0
            ? 'hoje'
            : format(new Date(dayData.dt * 1000), 'EEEE', { locale: ptBR }),
        })));
      } else {
        Alert.alert(
          'Cidade não encontrada',
          'Não foi possível encontrar o clima para a cidade pesquisada'
        );
        setDailyWeather([]);
      }
    } catch (err) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao trazer as informações do clima'
      );
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'android' ? 'height' : 'padding' }
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

      <FlatList
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
                Máx {Math.round(weather.temp.night)} &#176;C
              </Text>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </KeyboardAvoidingView>
  );
}

