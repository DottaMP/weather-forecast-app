import axios from 'axios';

export const oracleApi = axios.create({
  baseURL: 'https://gbe9f5772edc850-weatherbd.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/weathersearch',
});