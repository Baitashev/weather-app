// MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapEffect = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (map) {
            map.setView(coords, 10);
        }
    }, [coords, map]);

    return null;
};

const WeatherMap = ({ weatherData }) => {
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

export default WeatherMap;
