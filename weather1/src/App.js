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
import HourlyForecastChart from './HourlyForecastChart'; // Импорт компонента HourlyForecastChart
import WeatherDisplay from './WeatherDisplay'; // Импорт компонента WeatherDisplay
import ForecastTabs from './ForecastTabs'; // Импорт компонента ForecastTabs

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
            console.error('Ошибка при обработке поиска:', error);
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
                            {/* Группировка ввода и кнопки вместе с помощью flexbox */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                                <Form.Group controlId="formSearchCity">
                                    <Form.Control
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleSearch} className="search-button" style={{ marginLeft: 10 }}>
                                    {t('searchButton')}
                                </Button>
                            </div>
                            {searchResult && (
                                <div className="result-container">
                                    <WeatherDisplay weatherData={searchResult} />
                                    {forecast && <ForecastTabs forecastData={forecast} />}
                                    {/* Добавляем ссылку на детали погоды */}
                                    <Link to="/weather-details">{t('detailsButton')}</Link>
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

export default App;
