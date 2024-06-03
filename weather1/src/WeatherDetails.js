import React from 'react';
import { useParams } from 'react-router-dom';

const WeatherDetails = () => {
    // Получаем параметры из URL
    const { cityName } = useParams();

    return (
        <div>
            {/* Вывод подробной информации о погоде */}
            <h2>Подробная информация о погоде в городе {cityName}</h2>
            {/* Здесь можно добавить дополнительную информацию о погоде */}
        </div>
    );
};

export default WeatherDetails;
