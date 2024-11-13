/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewCluster from 'react-native-map-clustering';
import { BusStopIcon, SubwayStationIcon } from '@components/Icons';
import { router } from 'expo-router';
import useCurrentLocation from '@hooks/useCurrentLocation';
import useNearbyTransit from '@hooks/useNearbyTransit';
import { debounce } from 'lodash';
import { Colors, darkMapStyle } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
const MemoizedBusStopIcon = React.memo(BusStopIcon);
const MemoizedSubwayStationIcon = React.memo(SubwayStationIcon);

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

    const handleRegionChangeComplete = useCallback(
        debounce((newRegion) => setRegion(newRegion), 200),
        [],
    );

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
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                clusterColor="#007AFF"
                radius={60} // Ajuste para el radio de agrupamiento, puede aumentarse para clusters mayores
                minPoints={3} // Establece un tamaño mínimo de puntos para formar un clúster
                showsPointsOfInterest={false} // Para iOS
                customMapStyle={darkMapStyle} // Para Android
                showsMyLocationButton={false}
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
                        <MemoizedBusStopIcon />
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
                        <MemoizedSubwayStationIcon />
                    </Marker>
                ))}
            </MapViewCluster>

            {/* Botón para volver a la ubicación del usuario */}
            <TouchableOpacity
                style={styles.locationButton}
                onPress={goToUserLocation}
            >
                <MaterialIcons name="my-location" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    locationButton: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        backgroundColor: Colors.cardBackground,
        padding: 10,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    buttonText: {
        fontSize: 20,
    },
});
