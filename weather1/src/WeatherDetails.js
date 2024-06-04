import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WeatherDetails = () => {
    const { state } = useLocation();
    const { weatherData } = state;
    const { t } = useTranslation();

    if (!weatherData) {
        return <p>{t('noData')}</p>;
    }

    const weather = weatherData.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

    return (
        <div>
            <h1>
                {weather.main} {t('in')} {weatherData.name}
                <img src={iconUrl} alt={weather.description} className="weather-icon" />
            </h1>
            <p>{t('temperature')}: {weatherData.main.temp}°C</p>
            <p>{t('feelsLike')}: {weatherData.main.feels_like}°C</p>
            <p>{t('high')}: {weatherData.main.temp_max}°C</p>
            <p>{t('low')}: {weatherData.main.temp_min}°C</p>
            <p>{t('humidity')}: {weatherData.main.humidity}%</p>
            <p>{t('chanceOfPrecipitation')}: {weatherData.clouds.all}%</p>
            <p>{t('windSpeed')}: {weatherData.wind.speed} м/с</p>
        </div>
    );
};

export default WeatherDetails;
