import paths from '@/src/routes/path';
import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { get } from 'lodash';

export const noTokenApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const hasTokenApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getCookie('access_token')}`,
  },
});

hasTokenApi.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

hasTokenApi.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (get(error, 'response.status') === 401) {
      try {
        const refreshToken = getCookie('refresh_token');
        const res = await noTokenApi.post('/token', {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        const newAccessToken = res?.data?.AccessToken || '';
        setCookie('access_token', newAccessToken);
      } catch (err) {
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        window.location.href = paths.login;
      }
    }
    return Promise.reject(error);
  }
);
