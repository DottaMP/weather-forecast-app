// App é o componente principal, os componentes são declarados como funções. 
// O que defini o componente é uma função que retorna o Jsx.

import { 
  // Hooks permitem "enganchar" os recursos do React, como métodos de estado e ciclo de vida.
  useState 
} from 'react'

import { 
  ImageBackground, 
  Platform, 
  SafeAreaView, 
  StatusBar, 
  StyleSheet
} from 'react-native';

import { 
  Tab, 
  TabView 
} from '@rneui/themed';

import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import { CurrentWeather } from './src/components/CurrentWeather';
import { SearchWeather } from './src/components/SearchWeather';
import { History } from './src/components/History'; 
import image1 from './assets/fundo1.png';
import image2 from './assets/fundo2.png';
import image3 from './assets/fundo3.jpg';

export default function App() {
  // A função de estado (useState) renderiza a função novamente quando identifica que teve 
  // alteração no estado e executa novamente.
  const [index, setIndex] = useState(0);

  return (
    <> {/*fragmento, componente pai*/}

      {/*componente SafeAreaView trabalha com área segura (funciona apenas para IOS)*/}   
      <SafeAreaView style={styles.container}>

        {/*componente Tab, trabalha com index*/} 
        <Tab 
          style={styles.tabContainer}
          value={index}
          onChange={setIndex} //deixa implicito a chamada
          indicatorStyle={{
            backgroundColor: 'white',
            height: 3,
          }}
        >
          <Tab.Item
            title="Agora"
            titleStyle={styles.tab}
          />
          <Tab.Item
            title="Pesquisar"
            titleStyle={styles.tab}
          />
          <Tab.Item
            title="Histórico"
            titleStyle={styles.tab}
          />
        </Tab>

        <TabView 
          style={styles.container} 
          value={index} 
          onChange={setIndex} 
          animationType="spring"
        >
          <TabView.Item style={styles.tabItem}>
            <ImageBackground 
              source={image1} 
              resizeMode="cover" 
              style={styles.image}
            >
              <CurrentWeather />
            </ImageBackground>
          </TabView.Item>
          
          <TabView.Item style={styles.tabItem}>
            <ImageBackground 
              source={image2} 
              resizeMode="cover" 
              style={styles.image}
            >
            <SearchWeather />
          </ImageBackground>
          </TabView.Item>

          <TabView.Item style={styles.tabItem}>
            <ImageBackground 
              source={image3} 
              resizeMode="cover" 
              style={styles.image}
            >
              { //força a renderização ao mudar para a aba do histórico
                index === 2 && <History /> 
              }
            
            </ImageBackground>
          </TabView.Item>
        </TabView>
      </SafeAreaView>

      <ExpoStatusBar backgroundColor="#18181b99" /> 

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    //se o sistema operacional for android vai uma margin top do tamanho da statusBar,
    //se não retornará zero, (onde a SafeAreaView já faz isso para o IOS)
  },
  tabContainer: {
    backgroundColor: '#18181b99', 
    width: '100%',
  },
  tabItem: {
    width: '100%',
  },
  image: {
    flex: 1,
  },
  tab: {
    fontSize: 17, 
    color: 'white', 
    fontWeight: 'bold',
  }
});
