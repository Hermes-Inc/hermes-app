import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

const client = axios.create({
  baseURL: API_URL,
  timeout: 100000,
  headers: { 'content-type': 'application/json' },
});

// Custom middleware for requests (this one just logs the error).
client.interceptors.request.use(config => config, (error) => {
  console.log('Failed to make request with error:');
  console.log(error);
  return Promise.reject(error);
});

// Custom middleware for responses (this one just logs the error).
client.interceptors.response.use(response => response, (error) => {
  console.log('Request got response with error:');
  console.log(error);
  return Promise.reject(error);
});

// Error middleware. Makes the back end error message consistent with front-end fabricated errors.
client.interceptors.response.use(response => response, (error) => {
  const errorMsg = error.response.data.error;
  return Promise.reject(new Error(errorMsg));
});

export default client;
