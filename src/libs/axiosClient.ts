import axios from 'axios';

interface ApiResponse {
  data?: any;
  error: boolean;
  message?: string;
  field?: string;
}

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_STRAPI_API_URL,
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_TOKEN}`
  }
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      const { error, message, field } = response.data as ApiResponse;
      if (error && field === 'wrong_authentication_token') {
        localStorage.removeItem('user');
        window.location.reload();
      }
      return response.data;
    }

    return response;
  },
  (error) => {
    console.log(error);
    throw error;
  }
);

export default axiosClient;
