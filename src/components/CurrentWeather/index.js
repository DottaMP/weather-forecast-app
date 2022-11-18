//rafce
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Location from 'expo-location';

import { ItemInfo } from './ItemInfo';
import { weatherApi } from '../../lib/weatherApi';

import { styles } from './styles';


export const CurrentWeather = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hourFormatted = useMemo(() => {
    return format(currentDate, 'KK:mm aaa');
  }, [currentDate]);

  const dateFormatted = useMemo(() => {
    return format(currentDate, 'EEEE, dd MMM', {
      locale: ptBR,
    });
  }, [currentDate]);

  const sunriseFormatted = useMemo(() => {
    return weather
      ? format(new Date(weather.sys.sunrise * 1000), 'hh:mm aaa')
      : '00:00'
  }, [weather]);

  const sunsetFormatted = useMemo(() => {
    return weather
      ? format(new Date(weather.sys.sunset * 1000), 'hh:mm aaa')
      : '00:00';
  }, [weather]);

  const handleGetCurrentWeather = useCallback(() => {
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

  useEffect(() => {
    const handleGetCoords = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Você deve permitir o acesso a localização para exibirmos as informações de clima!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords);
    }

    handleGetCoords();
  }, []);

  useEffect(() => {
    const updateDateInternal = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // 30 seconds

    const updateWeatherInterval = setInterval(() => {
      handleGetCurrentWeather();
    }, 1000 * 60); // 1 minute

    return () => {
      clearInterval(updateDateInternal);
      clearInterval(updateWeatherInterval);
    }
  }, [handleGetCurrentWeather])

  useEffect(() => {
    handleGetCurrentWeather();
  }, [handleGetCurrentWeather]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hour}>{hourFormatted}</Text>
        <Text style={styles.date}>{dateFormatted}</Text>

        <View style={styles.infoContainer}>
          {isLoading ? (
            <ActivityIndicator style={{ flex: 1 }} />
          ) : (
            <>
              <ItemInfo
                title="Temperatura Local"
                value={Math.round(weather?.main?.temp ?? 0)}
                unit="ºC"
              />

              <ItemInfo
                title="Humidade do ar"
                value={weather?.main?.humidity ?? 0}
                unit="%"
              />

              <ItemInfo
                title="Nascer do Sol"
                value={sunriseFormatted}
                unit=""
              />

              <ItemInfo
                title="Por do Sol"
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