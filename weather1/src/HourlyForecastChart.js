// HourlyForecastChart.js

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';

const HourlyForecastChart = ({ hourlyData }) => {
    const { t } = useTranslation();

     if (!hourlyData || hourlyData.length === 0) {
        return null;
    }

    const chartData = {
        labels: hourlyData.map(hour => new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        datasets: [
            {
                label: t('temperature'),
                data: hourlyData.map(hour => hour.temp),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('time'),
                },
            },
            y: {
                title: {
                    display: true,
                    text: t('temperature') + ' (°C)',
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <h3>{t('hourlyForecast')}</h3>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default HourlyForecastChart;
