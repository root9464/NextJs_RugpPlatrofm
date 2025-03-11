import axios from 'axios';

export const tonApiInstance = axios.create({
  baseURL: 'https://tonapi.io/v2',
});

export const tonCenterInstance = axios.create({
  baseURL: 'https://toncenter.com/api/v2',
});
