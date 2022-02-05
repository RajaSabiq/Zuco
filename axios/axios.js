import axios from 'axios';
import { PRODUCTIONSERVER, PRODUCTIONTOKEN, SERVER, TOKEN } from '@env';

const Axios = axios.create({
  baseURL: SERVER,
});

Axios.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${TOKEN}`;
  return req;
});

Axios.interceptors.response.use(
  (res) => res,
  (err) => err
);

export default Axios;
