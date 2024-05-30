import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/journal/bootstrap.css";
import { Navbar, Nav, Row, Col, Container, Form, Button, Tabs, Tab } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import WeatherMap from './MapComponent';
import i18n from './i18n';

const App = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [forecast, setForecast] = useState(null);

    const handleSearch = async () => {
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric&lang=${i18n.language}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=hourly,minutely&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric&lang=${i18n.language}`;

        try {
            const response = await fetch(URL);
            const data = await response.json();
            setSearchResult(data);

            const forecastResponse = await fetch(forecastURL.replace('{lat}', data.coord.lat).replace('{lon}', data.coord.lon));
            const forecastData = await forecastResponse.json();
            setForecast(forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div>
            <Navbar bg="light">
                <Navbar.Brand>{t('weather')} App</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link onClick={() => i18n.changeLanguage('ru')}>{t('ru')}</Nav.Link>
                    <Nav.Link onClick={() => i18n.changeLanguage('en')}>{t('en')}</Nav.Link>
                </Nav>
            </Navbar>
            <Container>
                <Row>
                    <Col md={6}>
                        <h3>{t('searchPlaceholder')}</h3>
                        <Form.Group controlId="formSearchCity">
                            <Form.Control
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSearch}>
                            {t('searchButton')}
                        </Button>
                        {searchResult && (
                            <div>
                                <WeatherDisplay weatherData={searchResult} />
                                {forecast && <ForecastTabs forecastData={forecast} />}
                            </div>
                        )}
                    </Col>
                    <Col md={6} style={{ height: '500px' }}>
                        {searchResult && (
                            <WeatherMap weatherData={searchResult} />
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const WeatherDisplay = ({ weatherData }) => {
    const { t } = useTranslation();
    const weather = weatherData.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

    return (
        <div>
            <h1>
                {weather.main} {t('in')} {weatherData.name}
                <img src={iconUrl} alt={weather.description} />
            </h1>
            <p>{t('temperature')}: {weatherData.main.temp}°C</p>
            <p>{t('feelsLike')}: {weatherData.main.feels_like}°C</p>
            <p>{t('high')}: {weatherData.main.temp_max}°C</p>
            <p>{t('low')}: {weatherData.main.temp_min}°C</p>
            <p>{t('humidity')}: {weatherData.main.humidity}%</p>
            <p>{t('chanceOfPrecipitation')}: {weatherData.clouds.all}%</p>
        </div>
    );
};

const ForecastTabs = ({ forecastData }) => {
    const { t } = useTranslation();
    return (
        <Tabs defaultActiveKey="today" id="forecast-tabs">
            <Tab eventKey="today" title={t('today')}>
                <ForecastDay data={forecastData.daily[0]} />
            </Tab>
            <Tab eventKey="tomorrow" title={t('tomorrow')}>
                <ForecastDay data={forecastData.daily[1]} />
            </Tab>
            <Tab eventKey="3days" title={t('3days')}>
                {forecastData.daily.slice(0, 3).map((day, index) => (
                    <ForecastDay key={index} data={day} />
                ))}
            </Tab>
            <Tab eventKey="7days" title={t('7days')}>
                {forecastData.daily.slice(0, 7).map((day, index) => (
                    <ForecastDay key={index} data={day} />
                ))}
            </Tab>
        </Tabs>
    );
};

const ForecastDay = ({ data }) => {
    const { t } = useTranslation();
    const weather = data.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;
    const date = new Date(data.dt * 1000).toLocaleDateString();

    return (
        <div>
            <h3>{date}</h3>
            <p>
                {weather.main} <img src={iconUrl} alt={weather.description} />
            </p>
            <p>{t('temperature')}: {data.temp.day}°C</p>
            <p>{t('feelsLike')}: {data.feels_like.day}°C</p>
            <p>{t('high')}: {data.temp.max}°C</p>
            <p>{t('low')}: {data.temp.min}°C</p>
            <p>{t('humidity')}: {data.humidity}%</p>
            <p>{t('chanceOfPrecipitation')}: {data.clouds}%</p>
        </div>
    );
};

export default App;
