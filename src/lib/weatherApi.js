//axios cria e consome a api
import axios from 'axios';

export const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org',
  params: { 
    appId: 'ef0b0973b783e0614ac87612ec04344b'
  }
});