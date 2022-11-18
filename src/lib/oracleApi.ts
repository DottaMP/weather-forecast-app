import axios from 'axios';

export const oracleApi = axios.create({
  baseURL: 'https://gbe9f5772edc850-weatherbd.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/weathersearch',
  //?limit=10000&totalResults=true
  //https://docs.oracle.com/en/cloud/saas/service/18a/cxsvc/c_osvc_pagination.html
});