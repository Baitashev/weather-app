import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ForecastDay from './ForecastDay'; // Импорт компонента ForecastDay

const ForecastTabs = ({ forecastData }) => {
    const { t } = useTranslation();
    return (
        <Tabs defaultActiveKey="today" id="forecast-tabs" className="weather-tabs">
            <Tab eventKey="today" title={t('today')}>
                <ForecastDay data={forecastData.daily[0]} />
            </Tab>
            <Tab eventKey="tomorrow" title={t('tomorrow')}>
                <ForecastDay data={forecastData.daily[1]} />
            </Tab>
            <Tab eventKey="3days" title={t('3days')}>
                <div className="forecast-container">
                    {forecastData.daily.slice(0, 3).map((day, index) => (
                        <ForecastDay key={index} data={day} />
                    ))}
                </div>
            </Tab>
            <Tab eventKey="7days" title={t('7days')}>
                <div className="forecast-container">
                    {forecastData.daily.slice(0, 7).map((day, index) => (
                        <ForecastDay key={index} data={day} />
                    ))}
                </div>
            </Tab>
        </Tabs>
    );
};

export default ForecastTabs;
