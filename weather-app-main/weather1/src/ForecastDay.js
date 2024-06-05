import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ForecastDay = ({ data }) => {
    const { t } = useTranslation();
    const weather = data.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;
    const date = new Date(data.dt * 1000).toLocaleDateString();

    const [isAnimated, setIsAnimated] = useState(false);

    const handleIconClick = () => {
        setIsAnimated(!isAnimated);
        setTimeout(() => {
            setIsAnimated(false);
        }, 500); // Сброс анимации после 500мс
    };

    return (
        <div className="forecast-day">
            <h3 className="date-text">{date}</h3>
            <p>
                <img
                    src={iconUrl}
                    alt={weather.description}
                    className={`weather-icon ${isAnimated ? 'animated' : ''}`}
                    onClick={handleIconClick}
                />
                {weather.main}
            </p>
            <p className="weather-info">{t('temperature')}: {data.temp.day}°C</p>
            <p className="weather-info">{t('feelsLike')}: {data.feels_like.day}°C</p>
            <p className="weather-info">{t('high')}: {data.temp.max}°C</p>
            <p className="weather-info">{t('low')}: {data.temp.min}°C</p>
            <p className="weather-info">{t('humidity')}: {data.humidity}%</p>
            <p className="weather-info">{t('chanceOfPrecipitation')}: {data.clouds}%</p>
        </div>
    );
};

export default ForecastDay;
