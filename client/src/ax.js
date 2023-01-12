import axios from 'axios';
// import Cookies from 'js-cookie';

const api = axios.create();

api.interceptors.request.use(config => {
    // const token = Cookies.get('jwt');
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
