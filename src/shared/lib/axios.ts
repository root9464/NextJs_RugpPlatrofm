import axios from 'axios';

export const tonApiInstance = axios.create({
  baseURL: 'https://tonapi.io/v2',
});
