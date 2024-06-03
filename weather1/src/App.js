// App.js

import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/journal/bootstrap.css";
import { Navbar, Nav, Row, Col, Container, Form, Button, Tabs, Tab } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import WeatherMap from './MapComponent';
import i18n from './i18n';
import { fetchWeather, fetchForecast } from './api';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import WeatherDetails from './WeatherDetails';
import HourlyForecastChart from './HourlyForecastChart'; // Import HourlyForecastChart component

const App = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [forecast, setForecast] = useState(null);

    const handleSearch = async () => {
        try {
            const weatherData = await fetchWeather(searchQuery);
            setSearchResult(weatherData);

            const forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);
            setForecast(forecastData);
        } catch (error) {
            console.error('Error handling search:', error);
        }
    };

    return (
        <Router>
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
                            <Button variant="primary" onClick={handleSearch} className="search-button">
                                {t('searchButton')}
                            </Button>
                            {searchResult && (
                                <div className="result-container">
                                    <WeatherDisplay weatherData={searchResult} />
                                    {forecast && <ForecastTabs forecastData={forecast} />}
                                </div>
                            )}
                        </Col>
                        <Col md={6} className="map-container">
                            {searchResult && (
                                <WeatherMap weatherData={searchResult} />
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {forecast && forecast.hourly && <HourlyForecastChart hourlyData={forecast.hourly} />}
                        </Col>
                    </Row>
                </Container>
                <Routes>
                    <Route path="/weather-details" element={<WeatherDetails />} />
                </Routes>
            </div>
        </Router>
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
                <img src={iconUrl} alt={weather.description} className="weather-icon" />
            </h1>
            <p className="weather-info">{t('temperature')}: {weatherData.main.temp}°C</p>
            <p className="weather-info">{t('feelsLike')}: {weatherData.main.feels_like}°C</p>
            <p className="weather-info">{t('high')}: {weatherData.main.temp_max}°C</p>
            <p className="weather-info">{t('low')}: {weatherData.main.temp_min}°C</p>
            <p className="weather-info">{t('humidity')}: {weatherData.main.humidity}%</p>
            <p className="weather-info">{t('chanceOfPrecipitation')}: {weatherData.clouds.all}%</p>
        </div>
    );
};

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
        }, 500); // Reset animation after 500ms
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

export default App;
