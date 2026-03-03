import axios from 'axios';

/**
 * JWT Bearer 토큰을 자동으로 헤더에 첨부하는 Axios 인스턴스
 *
 * 사용 예시:
 *   import api from '../api';
 *   api.get('/api/user/profile/1')
 *   api.post('/api/product', { ... })
 */
const api = axios.create({
    baseURL: '/',
});

// 요청 인터셉터: localStorage의 토큰을 Authorization 헤더에 자동 첨부
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 응답 인터셉터: 401 응답 시 토큰 만료 처리
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export const uploadProductImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/api/upload/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
};

export const uploadUserImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/api/upload/user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
};

export default api;
