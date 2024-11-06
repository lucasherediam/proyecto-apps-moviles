/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewCluster from 'react-native-map-clustering';
import { BusStopIcon, SubwayStationIcon } from '@components/Icons';
import { router } from 'expo-router';
import useCurrentLocation from '@hooks/useCurrentLocation';
import useNearbyTransit from '@hooks/useNearbyTransit';

export default function Home() {
    const mapRef = useRef<MapView>(null);
    const { location, loading } = useCurrentLocation();
    const [region, setRegion] = useState<Region | null>(null);
    const minZoomLevelToShowStops = 0.01;

    // Hook para obtener paradas y estaciones visibles
    const { visibleStops, visibleStations } = useNearbyTransit(
        region,
        minZoomLevelToShowStops,
    );

    // Establece la región inicial cuando la ubicación está disponible
    useEffect(() => {
        if (location && !region) {
            setRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
            });
        }
    }, [location]);

    // Función para volver a la ubicación del usuario con animacion
    const goToUserLocation = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                },
                1000, // Duración de la animación en milisegundos
            );
        }
    };

    if (loading || !location) {
        return <Text>Loading map...</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <MapViewCluster
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={region as Region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                showsUserLocation={true}
                showsPointsOfInterest={false}
                clusterColor="#007AFF"
            >
                {visibleStops.map((stop) => (
                    <Marker
                        key={stop.stop_id}
                        coordinate={{
                            latitude: stop.latitude,
                            longitude: stop.longitude,
                        }}
                        onPress={() => {
                            router.push({
                                pathname: `/stop/[id]`,
                                params: {
                                    id: stop.stop_id,
                                    name: stop.stop_name,
                                },
                            });
                        }}
                    >
                        <BusStopIcon />
                    </Marker>
                ))}
                {visibleStations.map((station) => (
                    <Marker
                        key={station.station_id}
                        coordinate={{
                            latitude: station.latitude,
                            longitude: station.longitude,
                        }}
                        onPress={() => {
                            router.push({
                                pathname: `/subway-station/[id]`,
                                params: {
                                    id: station.station_id,
                                    name: station.station_name,
                                    route: station.route_short_name,
                                },
                            });
                        }}
                    >
                        <SubwayStationIcon />
                    </Marker>
                ))}
            </MapViewCluster>

            {/* Botón para volver a la ubicación del usuario */}
            <TouchableOpacity
                style={styles.locationButton}
                onPress={goToUserLocation}
            >
                <Text style={styles.buttonText}>📍</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    locationButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    buttonText: {
        fontSize: 20,
    },
});
