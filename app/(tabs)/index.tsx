import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewCluster from 'react-native-map-clustering';
import { BusStopIcon, SubwayStationIcon } from '@components/Icons';
import { router } from 'expo-router';
import useCurrentLocation from '@hooks/useCurrentLocation';
import useNearbyTransit from '@hooks/useNearbyTransit';
import { debounce } from 'lodash';
import { Colors, darkMapStyle } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';

const MemoizedBusStopIcon = React.memo(BusStopIcon);
const MemoizedSubwayStationIcon = React.memo(SubwayStationIcon);

export default function Home() {
    const mapRef = useRef<MapView>(null);
    const { location, loading } = useCurrentLocation();
    const [region, setRegion] = useState<Region | null>(null);
    const [markersReady, setMarkersReady] = useState(false);
    const minZoomLevelToShowStops = 0.01;

    // Obtén paradas y estaciones visibles en segundo plano
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

    useEffect(() => {
        // Cuando los datos de paradas y estaciones estén listos, activa los marcadores
        if (visibleStops.length || visibleStations.length) {
            setMarkersReady(true);
        }
    }, [visibleStops, visibleStations]);

    const handleRegionChangeComplete = useCallback(
        debounce((newRegion) => setRegion(newRegion), 100), // Ajusta debounce para mayor rapidez
        [],
    );

    // Función para volver a la ubicación del usuario con animación
    const goToUserLocation = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                },
                1000,
            );
        }
    };

    // Si la ubicación está cargando, muestra un indicador
    if (loading || !location) {
        return (
            <Screen phauto pt={0}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            </Screen>
        );
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
                radius={60}
                minPoints={3}
                showsPointsOfInterest={false}
                customMapStyle={darkMapStyle}
                showsMyLocationButton={false}
            >
                {/* Renderiza los marcadores solo cuando los datos estén listos */}
                {markersReady &&
                    visibleStops.map((stop) => (
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
                {markersReady &&
                    visibleStations.map((station) => (
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    loadingText: {
        fontSize: 18,
        color: Colors.textPrimary,
        marginTop: 10,
        textAlign: 'center',
    },
});
