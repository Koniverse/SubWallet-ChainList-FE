import axios from 'axios';

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
