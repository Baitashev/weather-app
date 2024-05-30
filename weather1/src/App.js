import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/journal/bootstrap.css";
import { Navbar, Nav, Row, Col, Container, Form, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const locales = {
    ru: {
        weather: 'Погода',
        searchPlaceholder: 'Поиск города',
        searchButton: 'Поиск',
        temperature: 'Температура',
        feelsLike: 'Ощущается как',
        high: 'Максимум',
        low: 'Минимум',
        humidity: 'Влажность',
        chanceOfPrecipitation: 'Вероятность осадков',
        windSpeed: 'Скорость ветра',
        pressure: 'Давление',
        uvIndex: 'УФ-индекс',
        dewPoint: 'Точка росы',
        visibility: 'Видимость',
        in: 'в',
        ru: 'RU',
        en: 'EN'
    },
    en: {
        weather: 'Weather',
        searchPlaceholder: 'Search city',
        searchButton: 'Search',
        temperature: 'Temperature',
        feelsLike: 'Feels Like',
        high: 'High',
        low: 'Low',
        humidity: 'Humidity',
        chanceOfPrecipitation: 'Chance of Precipitation',
        windSpeed: 'Wind Speed',
        pressure: 'Pressure',
        uvIndex: 'UV Index',
        dewPoint: 'Dew Point',
        visibility: 'Visibility',
        in: 'in',
        ru: 'RU',
        en: 'EN'
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
                            <WeatherDisplay weatherData={searchResult} locale={locale} />
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

const WeatherDisplay = ({ weatherData, locale }) => {
    const weather = weatherData.weather ? weatherData.weather[0] : {};
    const iconUrl = weather.icon ? `http://openweathermap.org/img/w/${weather.icon}.png` : '';

    return (
        <div>
            <h1>
                {weather.main} {locales[locale].in} {weatherData.name}
                {iconUrl && <img src={iconUrl} alt={weather.description} />}
            </h1>
            <p>{locales[locale].temperature}: {weatherData.main?.temp}°C</p>
            <p>{locales[locale].feelsLike}: {weatherData.main?.feels_like}°C</p>
            <p>{locales[locale].high}: {weatherData.main?.temp_max}°C</p>
            <p>{locales[locale].low}: {weatherData.main?.temp_min}°C</p>
            <p>{locales[locale].humidity}: {weatherData.main?.humidity}%</p>
            <p>{locales[locale].chanceOfPrecipitation}: {weatherData.clouds?.all}%</p>
            <p>{locales[locale].windSpeed}: {weatherData.wind?.speed} m/s</p>
            <p>{locales[locale].pressure}: {weatherData.main?.pressure} hPa</p>
            <p>{locales[locale].uvIndex}: {weatherData.uvi || 'N/A'}</p>
            <p>{locales[locale].dewPoint}: {weatherData.main?.dew_point || 'N/A'}°C</p>
            <p>{locales[locale].visibility}: {weatherData.visibility ? weatherData.visibility / 1000 : 'N/A'} km</p>
        </div>
    );
};

const WeatherMap = ({ weatherData }) => {
    const MapEffect = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(coords, 10);
        }, [coords, map]);

        return null;
    };

    if (!weatherData.coord) return null;

    return (
        <MapContainer
            center={[weatherData.coord.lat, weatherData.coord.lon]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
                <Popup>
                    {weatherData.name}
                </Popup>
            </Marker>
            <MapEffect coords={[weatherData.coord.lat, weatherData.coord.lon]} />
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
