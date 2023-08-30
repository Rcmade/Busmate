import axios from 'axios';

const api = axios.create({
  baseURL: 'https://busmets.azurewebsites.net/api',
  // baseURL: 'http://localhost:4444/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  if (config.url === '/signup') {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

export const addNewLocation = async location =>
  api.post('/addnewlocation', location);

export const asignContributor = async data =>
  api.post('/asignContributor', data);
export const changeContributor = async data =>
  api.post('/changecontributor', data);

export const getLocation = async location => api.get('/get', location);
export const getAvailableTime = async () => api.get('/get-available-services');
export const sendOtp = async data => api.post('/otp-send', data);
export const varifyOtp = async data => api.post('/otp-varify', data);
export const signUpRoute = async data => api.post('/signup', data);
export const loginRoute = async data => api.post('/login', data);
export const userInitialRoute = async data => api.get('/user-initial', data);
export const logout = async () => api.get('/logout');
export const updateUser = async data => api.post('/user-update', data);
export const forgotPassword = async data => api.post('/forgot-password', data);
export const getNewLocationRoute = async data =>
  api.get(`/getnewlocation`, {
    params: {
      date: data.date,
      busNumber: data.busNumber,
    },
  });

export const testapi = async data => api.post('/get', data);
export default api;
