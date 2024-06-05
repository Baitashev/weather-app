import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/journal/bootstrap.css";
import { Navbar, Nav, Row, Col, Container, Form, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import WeatherMap from './MapComponent';
import i18n from './i18n';
import { fetchWeather, fetchForecast } from './api';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
import WeatherDetails from './WeatherDetails';
import ForecastTabs from './ForecastTabs';
import WeatherDisplay from './WeatherDisplay';

const App = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [forecast, setForecast] = useState(null);
    const location = useLocation();

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
        <div>
            <Navbar className="navbar" style={{ backgroundColor: '#4169E1' }}>
                <Link to="/" className="brand-text">{t('WeatherPoint')}</Link>
                <Nav className="ml-auto">
                    <Nav.Link className="nav-link" onClick={() => i18n.changeLanguage('ru')}>{t('ru')}</Nav.Link>
                    <Nav.Link className="nav-link" onClick={() => i18n.changeLanguage('en')}>{t('en')}</Nav.Link>
                </Nav>
            </Navbar>
            <Container>
                <div className="content-container">
                    <Row>
                        <Col md={12} className="search-container">
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
                        </Col>
                    </Row>
                    <Routes>
                        <Route path="/" element={
                            <Row>
                                <Col md={6}>
                                    {searchResult && (
                                        <div className="result-container">
                                            <WeatherDisplay weatherData={searchResult} />
                                            {forecast && (
                                                <ForecastTabs
                                                    forecastData={forecast}
                                                    todayClassName="today-tab"
                                                    tomorrowClassName="tomorrow-tab"
                                                    threeDaysClassName="three-days-tab"
                                                    sevenDaysClassName="seven-days-tab"
                                                />
                                            )}
                                        </div>
                                    )}
                                </Col>
                                <Col md={6} className="map-container">
                                    {searchResult && (
                                        <WeatherMap weatherData={searchResult} />
                                    )}
                                </Col>
                            </Row>
                        } />
                        <Route path="/weather-details" element={<WeatherDetails />} />
                    </Routes>
                </div>
            </Container>
        </div>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;