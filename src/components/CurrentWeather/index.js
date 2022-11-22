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
//lib, é da onde vem a função Current
import ptBR from 'date-fns/locale/pt-BR'; 
import * as Location from 'expo-location';
import { ItemInfo } from './ItemInfo';
// importa a lib (biblioteca) de tempo
import { weatherApi } from '../../lib/weatherApi';
//importa arquivo de estilização
import { styles } from './styles';

{/*  */}
export const CurrentWeather = () => {
  //declaração dos estado:
  const [currentDate, setCurrentDate] = useState(new Date()); //atualiza a data e hora, para a atual, que já vem ao usar o (new Date())
  const [coords, setCoords] = useState(null); //pega as coordenados atuais da localização do usuario
  const [weather, setWeather] = useState(null); //traz as informações do clima atual
  const [isLoading, setIsLoading] = useState(true); //status de carregamento, vai servir para exibir o componente de loading

  // useMemo serve para memorizar um dado, e foi usado para armazenar a data e hora
  const hourFormatted = useMemo(() => {
    return format(currentDate, 'HH:mm');
  }, [currentDate]); // quando utiliza-se um estado de fora, precisa incluir como dependencia.

  /*a estrutura dos formatteds seguem o mesmo padra:
  usando o currentDate da lib date-fns, eu trazo a função qe sempre que o ele for atualizado 
  o dado configurado (hora e data) receberão a atualização */

  const dateFormatted = useMemo(() => {
    return format(currentDate, 'EEEE, dd MMM', {
      locale: ptBR, //traduz para ptBr a informação.
    });
  }, [currentDate]);

  //informações do clima - formata nascer e por do sol
  // o weather vem de fora, e por isso é usado como dependencia
  const sunriseFormatted = useMemo(() => { //nascer
    return weather
      ? format(new Date(weather.sys.sunrise * 1000), 'HH:mm') //faz a formatação para o horario do Brasil
      : '00:00'
  }, [weather]);

  const sunsetFormatted = useMemo(() => {  //por
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
      setIsLoading(true); //se o loading ta carregando vai aparecer a formatação descrita no final desse arquivo

      weatherApi.get(`/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`) //api ta definida dentro da pasta lib, temos a da oracle e a weather
        .then(response => {
          setWeather(response.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [coords]); // resumo: eu só aloco um novo valor quando o coords mudar, caso não, fica do mesmo jeito que foi alocado. Evita que ele fique recalculando e realocando na memoria a cada 1000ms

  //função de efeito colateral, faz o efeito quando algo acontecer.
  //defini através do array
  //o primeiro parametro é um função, o segundo é um array de dependencias, sendo assim, só vai ser executado quando o componente carregar.
  /* faz atualização das coordenadas */
  useEffect(() => { 
    const handleGetCoords = async () => {
      /* foi necessario criar a função para depois executar ela no handleGetCoords, porque o useEffect não aceita funcões assincronas, então um precisa acontecer antes do outro, por isso é chamado no final - regra do proprio react */
      //desestruturação
      //await para esperar a resposta, poderia ser qualquer outro com a mesma função, serve para esperar a resposta da localização que vem a seguir
      const { status } = await Location.requestForegroundPermissionsAsync(); //esse location está pegando as coordenadas do provedor da sua internet.
      //a desestrutução acima: const { status } está fazendo o papel de trazer de dentro do result que a consulta retorna apenas o valor de status, mesmo que result.status

      //quando o usuario permite que a sua localização seja acessada o status vai retornar granted

      // em caso de valor de status seja diferente de granted para localização
      if (status !== 'granted') {
        // exibi o alerta para que o usuario permita que a localização seja acessada para que a aplicação possa prosseguir
        alert('Você deve permitir o acesso a localização para exibirmos as informações de clima!');
        return;
      }

      //caso não seja diferente (else if), então quando temos acesso a localização, vai fazer a ação:

      //pega as coordenadas do usuario e vai retornar, atribuindo a coords
      const location = await Location.getCurrentPositionAsync({}); /* location serve basicamente para que a gente consiga pegar a localização atual do usuario */
      setCoords(location.coords); //pega a localização pelo provedor da internet
    }

    handleGetCoords(); //não pode usar uma função async, por isso chama a função aqui.
  }, []);

  /* faz atualização da data e hora */
  useEffect(() => {
    // a cada segundo a data/hora é atualizada
    const updateDateInternal = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // parametro é milisegundo // 1 seconds

    // a cada um minuto chama a função que atualiza o clima
    const updateWeatherInterval = setInterval(() => {
      handleGetCurrentWeather();
    }, 1000 * 60); // 1 minute

    //quando você retorna uma função ele vai executar quando o componente estiver sendo destruido, isso é uma caracteristica do useEffect
    //quando componente estiver sendo fechado eu retorno a função de dentro que vai fazer o clear, se não fazemos isso a memoria ia ficar sempre em uso, logo atualizando de segundo em segundo
    return () => {
      // para limpar a memória
      clearInterval(updateDateInternal);
      clearInterval(updateWeatherInterval);
    }
  }, [handleGetCurrentWeather]) // array de dependência, quando usa algo de fora precisa colocar como dependencia.

  /* para chamar a atualização do tempo */
  useEffect(() => {
    // chama a função do tempo sempre que é atualizado.
    handleGetCurrentWeather();
  }, [handleGetCurrentWeather]); //array dependencia.

  //o retorno é a montagem da pagina, onde eu pego os valores e vou estilizando
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hour}>{hourFormatted}</Text>
        <Text style={styles.date}>{dateFormatted}</Text>

        <View style={styles.infoContainer}>
          {isLoading ? ( //usando o icone de loading // carregando
            <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
          ) : (
            <>
              {/* Cada item traz uma informação que preciso mostrar ao usuario */}
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