import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WeatherDetails = () => {
    const { state } = useLocation();
    const { weatherData } = state || { weather: [], main: {}, clouds: {}, wind: {}, hourly: [] }; // на случай отсутствия данных
    const { t } = useTranslation();

    if (!weatherData || !weatherData.weather.length) {
        return <p>{t('noData')}</p>;
    }

    const weather = weatherData.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

    // Пример почасовых данных
    const hourlyData = weatherData.hourly || [
        { dt: 1628323200, temp: 22 },
        { dt: 1628326800, temp: 23 },
        { dt: 1628330400, temp: 21 },
        { dt: 1628334000, temp: 20 },
    ];

    const labels = hourlyData.map((data) => new Date(data.dt * 1000).toLocaleTimeString('ru-RU'));
    const temperatures = hourlyData.map((data) => data.temp);

    const data = {
        labels,
        datasets: [
            {
                label: t('temperature'),
                data: temperatures,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: t('hourlyForecast'),
            },
        },
    };

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

            <div>
                <h2>{t('hourlyForecast')}</h2>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default WeatherDetails;
