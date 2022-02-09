import axios from 'axios';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN, SERVER, TOKEN } from '@env';

const Axios = axios.create({
  baseURL: PRODUCTIONSERVER,
});

Axios.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${PRODUCTIONTOKEN}`;
  return req;
});

Axios.interceptors.response.use(
  (res) => res,
  (err) => err
);

export default Axios;
