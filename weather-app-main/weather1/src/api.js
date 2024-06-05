
import axios from 'axios';
import i18n from './i18n';

const API_KEY = 'b1b35bba8b434a28a0be2a3e1071ae5b';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
        units: 'metric',
        lang: i18n.language
    }
});

const fetchWeather = async (query) => {
    try {
        const response = await api.get('/weather', {
            params: {
                q: query
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

const fetchForecast = async (lat, lon) => {
    try {
        const response = await api.get('/onecall', {
            params: {
                lat: lat,
                lon: lon,
                exclude: 'hourly,minutely'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
};

export { fetchWeather, fetchForecast };
