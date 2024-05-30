import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/journal/bootstrap.css";
import { Navbar, Nav, Row, Col, Container, Form, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const locales = {
    ru: {
        weather: 'Погода',cd 
        searchPlaceholder: 'Поиск города',
        searchButton: 'Поиск',
        ru: 'RU',
        en: 'EN',
    },
    en: {
        weather: 'Weather',
        searchPlaceholder: 'Search city',
        searchButton: 'Search',
        ru: 'RU',
        en: 'EN',
    }
};

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
    const [locale, setLocale] = useState('ru');

    return (
        <LocalizationContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => useContext(LocalizationContext);

const App = () => {
    const { locale, setLocale } = useLocalization();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async () => {
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric&lang=${locale}`;

        try {
            const response = await fetch(URL);
            const data = await response.json();
            setSearchResult(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div>
            <Navbar bg="light">
                <Navbar.Brand>{locales[locale].weather} App</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link onClick={() => setLocale('ru')}>{locales[locale].ru}</Nav.Link>
                    <Nav.Link onClick={() => setLocale('en')}>{locales[locale].en}</Nav.Link>
                </Nav>
            </Navbar>
            <Container>
                <Row>
                    <Col md={6}>
                        <h3>{locales[locale].searchPlaceholder}</h3>
                        <Form.Group controlId="formSearchCity">
                            <Form.Control
                                type="text"
                                placeholder={locales[locale].searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSearch}>
                            {locales[locale].searchButton}
                        </Button>
                        {searchResult && (
                            <WeatherDisplay weatherData={searchResult} />
                        )}
                    </Col>
                    <Col md={6}>
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
    const weather = weatherData.weather[0];
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

    return (
        <div>
            <h1>
                {weather.main} in {weatherData.name}
                <img src={iconUrl} alt={weather.description} />
            </h1>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels Like: {weatherData.main.feels_like}°C</p>
            <p>High: {weatherData.main.temp_max}°C</p>
            <p>Low: {weatherData.main.temp_min}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Chance of Precipitation: {weatherData.clouds.all}%</p>
        </div>
    );
};

const WeatherMap = ({ weatherData }) => {
    return (
        <MapContainer center={[weatherData.coord.lat, weatherData.coord.lon]} zoom={10} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
                <Popup>
                    {weatherData.name}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

const AppWrapper = () => {
    return (
        <LocalizationProvider>
            <App />
        </LocalizationProvider>
    );
};

export default AppWrapper;
