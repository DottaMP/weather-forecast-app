// O que defini o componente é uma função que retorna o Jsx.
// App é o componente principal, os componentes são declarados como funções. 

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

//imports do react
import { 
  Tab, 
  TabView 
} from '@rneui/themed';

import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
//importando os componentes
import { CurrentWeather } from './src/components/CurrentWeather';
import { SearchWeather } from './src/components/SearchWeather';
import { History } from './src/components/History'; 
//importanto as imagens
import image1 from './assets/fundo1.png';
import image2 from './assets/fundo2.png';
import image3 from './assets/fundo3.jpg';

//declara os componentes como funções que retorna um jsx(html dentro do javascript), conceito do react.
export default function App() {
  // A função de estado (useState) renderiza a função novamente quando identifica que teve 
  // alteração no estado e executa novamente.
  //a função de estado é para onde o react olha quando ocorre atualizaçoes, isto é, quando ela é atualizada nosso componente é renderizado novamente 
  const [index, setIndex] = useState(0);

  return (
    <> {/*fragmento, componente pai*/}

      {/*componente SafeAreaView trabalha com área segura (funciona apenas para IOS)*/}  
      {/* serve para que nosso app trabalhe apenas com essa area segura, que é basicamente usar apenas o que está disponivel da tela, liberando o espaço de camera e menus das telas*/} 
      <SafeAreaView style={styles.container}>

        {/*componente Tab, trabalha com index*/}
        {/* o componente tab faz as abas, que são as telas da nossa aplicação */} 
        <Tab 
          //traz a estilização da pagina do arquivo de style criado em outra pasta.
          style={styles.tabContainer}
          //atribui o index criado no inicio da função ao valor dessa tab
          value={index}
          //função para alterar esse estado, já que o valor de index é imutavel. Então cria um novo set (um novo valor) para esse index
          //faz a referencia da função 
          //poderiamos usar arrowfuction onChange={(i) -> setIndex(1)}, mas do jeito que está
          //o onChange está passando direto pro setIndex o valor que value receber
          onChange={setIndex} //deixa implicito a chamada
          //estilização da pagina
          indicatorStyle={{
            backgroundColor: 'white',
            height: 3,
          }}
        >
          {/* são os itens das abas, cada tab é uma nova aba, onde title é o titulo da pagina/aba  */}
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
        {/* O tabView é o que vai testar todo mundo dentro das abas, a repetição se dá devido a orientação da documentação, mas value e onChange é igual acima*/}
        <TabView 
          style={styles.container} 
          value={index} 
          onChange={setIndex} 
          animationType="spring"
        >
          {/* o .Item indica oficialmente o que vamos ter em cada aba */}
          {/* cada item é um componente, presente lá na pasta de componentes do projeto*/}
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

{/* aciona cor na status bar, mas só funciona no celular */}
      <ExpoStatusBar backgroundColor="#18181b99" /> 

    </>
  );
}

{/* equivalente ao SafeAreaView mas para Android, faz a estilização conforme abaixo, para usar apenas a area segura.*/}
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
