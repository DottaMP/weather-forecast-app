import { useState } from 'react'
import { SafeAreaView, StatusBar, ImageBackground, StyleSheet, Text, Platform } from 'react-native';
import { Tab, TabView } from '@rneui/themed';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'

import { CurrentWeather } from './src/components/CurrentWeather';
import { SearchWeather } from './src/components/SearchWeather';
import { History } from './src/components/History'; 

import image1 from './assets/fundo1.png';
import image2 from './assets/fundo2.png';
import image3 from './assets/fundo3.jpg';

export default function App() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Tab 
          style={styles.tabContainer}
          value={index}
          onChange={setIndex}
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
              {index === 2 && <History /> }
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
