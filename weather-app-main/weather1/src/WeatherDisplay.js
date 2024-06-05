import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

const WeatherDisplay = ({ weatherData }) => {
    const { t } = useTranslation();
    const weather = weatherData.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 style={{ marginRight: 10 }}>
                    {weather.main} {t('in')} {weatherData.name}
                </h1>
                <img src={iconUrl} alt={weather.description} className="weather-icon" style={{ marginRight: 10 }} />
                <Link to="/weather-details" state={{ weatherData: weatherData }}>
                    <Button variant="primary">{t('detailsButton')}</Button>
                </Link>
            </div>
            <p className="weather-info">{t('temperature')}: {weatherData.main.temp}°C</p>
            <p className="weather-info">{t('feelsLike')}: {weatherData.main.feels_like}°C</p>
            <p className="weather-info">{t('high')}: {weatherData.main.temp_max}°C</p>
            <p className="weather-info">{t('low')}: {weatherData.main.temp_min}°C</p>
            <p className="weather-info">{t('humidity')}: {weatherData.main.humidity}%</p>
            <p className="weather-info">{t('chanceOfPrecipitation')}: {weatherData.clouds.all}%</p>
        </div>
    );
};

export default WeatherDisplay;
