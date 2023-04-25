import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/';

export default axios;
<<<<<<< Updated upstream:frontend/src/api.ts
=======
=======
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('access_token');
  console.log(accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});


const post = async (url: string, data: any): Promise<Response> => {
  const response = await api.request({
    url,
    method: 'POST',
    data,
  });

  const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const getUserDetails = async (): Promise<Response> => {
  const response = await api.get('/core/me/');
  const headers = new Headers();
  for (const [key, value] of Object.entries(response.headers)) {
    headers.append(key, value);
  }
  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
const get = async (url: string, options?: any): Promise<Response> => {
  const response = await api.get(url, options);

  const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const patch = async (url: string, data: any): Promise<Response> => {
  const response = await api.request({
    url,
    method: 'PATCH',
    data,
  });

  const headers: HeadersInit = Object.entries(response.headers).reduce(
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const remove = async (url: string): Promise<Response> => {
  const response = await api.delete(url);

  const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export default {
  post,
  get,
  getUserDetails,
  patch,
  remove
};
<<<<<<< HEAD
>>>>>>> 67afe1c (Now we have login system in react!)
>>>>>>> Stashed changes:frontend/src/utils/api.ts
=======

>>>>>>> d0724f7 (moreChanges to the login, create delete,)
