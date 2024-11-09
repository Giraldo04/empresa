import axios from 'axios'; // Cambia require por import

const api = axios.create({
    baseURL: 'http://localhost:3000', // URL de tu servidor backend
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization; // Asegúrate de eliminar el encabezado si no hay token.
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api; // Cambia module.exports por export default
