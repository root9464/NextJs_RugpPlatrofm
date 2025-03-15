import axios from 'axios';

export const tonApiInstance = axios.create({
  baseURL: 'https://tonapi.io/v2',
});

export const tonCenterInstance = axios.create({
  baseURL: 'https://toncenter.com/api/',
  headers: {
    'X-API-Key': process.env.NEXT_PUBLIC_TON_CENTER_KEY,
  },
});
