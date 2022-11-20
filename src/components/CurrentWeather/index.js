// rnfes
import React, { 
  // Hooks permitem "enganchar" os recursos do React, como métodos de estado e ciclo de vida.
  useCallback, 
  useEffect, 
  useState, 
  useMemo 
} from 'react';

import { 
  ActivityIndicator, 
  Text,
  View 
} from 'react-native';

import { format } from 'date-fns'; //https://date-fns.org/v2.29.3/docs/format
import ptBR from 'date-fns/locale/pt-BR'; 
import * as Location from 'expo-location';
import { ItemInfo } from './ItemInfo';
import { weatherApi } from '../../lib/weatherApi';
import { styles } from './styles';

export const CurrentWeather = () => {
  //declaração dos estado
  const [currentDate, setCurrentDate] = useState(new Date());
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hourFormatted = useMemo(() => {
    return format(currentDate, 'HH:mm');
  }, [currentDate]); // quando utiliza-se um estado de fora, precisa incluir como dependencia.

  const dateFormatted = useMemo(() => {
    return format(currentDate, 'EEEE, dd MMM', {
      locale: ptBR,
    });
  }, [currentDate]);

  const sunriseFormatted = useMemo(() => {
    return weather
      ? format(new Date(weather.sys.sunrise * 1000), 'HH:mm')
      : '00:00'
  }, [weather]);

  const sunsetFormatted = useMemo(() => { 
    // useMemo função de memorização, retorna um valor memorizada.
    // só é executado quando uma de suas dependências é atualizada. Isso pode melhorar o desempenho.
    return weather
      ? format(new Date(weather.sys.sunset * 1000), 'HH:mm')
      : '00:00';
  }, [weather]);

  const handleGetCurrentWeather = useCallback(() => { 
    // useCallback função de memorização, retorna uma função memorizada.
    // o useCallback mantem a função do jeito que alocou na memória até que ela mude.
    // só é executado quando uma de suas dependências é atualizada.
    if (coords) {
      const { latitude, longitude } = coords;
      setIsLoading(true);

      weatherApi.get(`/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`)
        .then(response => {
          setWeather(response.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [coords]);

  //função de efeito colateral, faz o efeito quando algo acontecer.
  //defini através do array
  //o primeiro parametro é um funação, o segundo é um array de dependencias, sendo assim, só vai ser executado quando o componente carregar.
  useEffect(() => { 
    const handleGetCoords = async () => {
      //desestruturação
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Você deve permitir o acesso a localização para exibirmos as informações de clima!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords); //pega a localização pelo provedor da internet
    }

    handleGetCoords(); //não pode usar uma função async, por isso chama a função aqui.
  }, []);

  useEffect(() => {
    // a cada segundo a data/hora é atualizada
    const updateDateInternal = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // 1 seconds

    // a cada um minuto chama a função que atualiza o clima
    const updateWeatherInterval = setInterval(() => {
      handleGetCurrentWeather();
    }, 1000 * 60); // 1 minute

    return () => {
      // para limpar a memória
      clearInterval(updateDateInternal);
      clearInterval(updateWeatherInterval);
    }
  }, [handleGetCurrentWeather]) // array de dependência, quando usa algo de fora precisa colocar como dependencia.

  useEffect(() => {
    // chama a função do tempo sempre que é atualizado.
    handleGetCurrentWeather();
  }, [handleGetCurrentWeather]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hour}>{hourFormatted}</Text>
        <Text style={styles.date}>{dateFormatted}</Text>

        <View style={styles.infoContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
          ) : (
            <>
              <ItemInfo
                title="Temperatura Local"
                value={Math.round(weather?.main?.temp ?? 0)}
                unit="ºC"
              />

              <ItemInfo
                title="Humidade do Ar"
                value={weather?.main?.humidity ?? 0}
                unit="%"
              />

              <ItemInfo
                title="Nascer do Sol"
                value={sunriseFormatted}
                unit=""
              />

              <ItemInfo
                title="Pôr do Sol"
                value={sunsetFormatted}
                unit=""
              />
            </>
          )}
        </View>

        <Text style={styles.locale}>{weather?.name}</Text>
      </View>
    </View>
  );
}