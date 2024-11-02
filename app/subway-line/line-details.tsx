import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

type Coordinate = {
    latitude: number;
    longitude: number;
};

export default function LineDetails() {
    const { route_short_name, userLatitude, userLongitude, color } = useLocalSearchParams<{
        route_short_name?: string;
        userLatitude?: string;
        userLongitude?: string;
        color?: string;
    }>();

    const [routeShape, setRouteShape] = useState<Coordinate[]>([]);
    const [stops, setStops] = useState<Coordinate[]>([]);
    const [midPoint, setMidPoint] = useState<Coordinate | null>(null);
    const mapRef = useRef<MapView | null>(null);

    useEffect(() => {
        if (route_short_name) {
            fetchRouteShapeAndStops(route_short_name);
        }
    }, [route_short_name]);

    const fetchRouteShapeAndStops = async (route_short_name: string) => {
        try {
            console.log(`Fetching route shape for route ${route_short_name}`);
            const shapeResponse = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-route/${route_short_name}/shape`,
            );
            const shapeData = await shapeResponse.json();
            console.log("shapeData: ",shapeData);

            const stationsResponse = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-route/${route_short_name}/stations`,
            );
            const stationsData = await stationsResponse.json();
            console.log("stationsData: ",stationsData);

            if (!shapeData || !stationsData
            ) {
                Alert.alert(
                    'Error',
                    'No se encontró la trayectoria o las paradas para esta línea.',
                );
                return;
            }

            // Procesar las coordenadas de la shape
            const shapeCoords: Coordinate[] = shapeData.map(
                (point: any) => ({
                    latitude: point.shape_pt_lat,
                    longitude: point.shape_pt_lon,
                }),
            );

            // Procesar las coordenadas de las paradas
            const stationCoords: Coordinate[] = stationsData.map(
                (stop: any) => ({
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                }),
            );

            if (shapeCoords.length === 0 || stationCoords.length === 0) {
                Alert.alert(
                    'Error',
                    'No se encontraron puntos válidos para esta ruta.',
                );
                return;
            }

            setRouteShape(shapeCoords);
            setStops(stationCoords);
            // Calcular el punto medio para centrar el mapa
            const midLatitude =
                (shapeCoords[0].latitude +
                    shapeCoords[shapeCoords.length - 1].latitude) /
                2;
            const midLongitude =
                (shapeCoords[0].longitude +
                    shapeCoords[shapeCoords.length - 1].longitude) /
                2;

            setMidPoint({ latitude: midLatitude, longitude: midLongitude });
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo obtener la trayectoria de la línea.',
            );
            console.error(error);
        }
    };

    useEffect(() => {
        if (
            mapRef.current &&
            routeShape.length > 0 &&
            userLatitude &&
            userLongitude
        ) {
            const coordinates: Coordinate[] = [
                ...routeShape,
                {
                    latitude: parseFloat(userLatitude),
                    longitude: parseFloat(userLongitude),
                },
            ];

            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeShape, userLatitude, userLongitude]);

    if (!midPoint || !routeShape.length || !stops.length) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsMyLocationButton={true}
                showsUserLocation={true}
                initialRegion={{
                    latitude: midPoint.latitude,
                    longitude: midPoint.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {/* Mostrar la shape completa */}
                <Polyline
                    coordinates={routeShape}
                    strokeColor={color}
                    strokeWidth={8}
                />

                {/* Mostrar solo los puntos de las paradas */}
                {stops.map((stop, index) => (
                    <Marker key={index} coordinate={stop}>
                        <View style={styles.marker}>
                            <View style={styles.markerContent} />
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
    },
    marker: {
        backgroundColor: 'lightgray',
        padding: 2,
        borderRadius: 5,
    },
    markerContent: {
        width: 7,
        height: 7,
        backgroundColor: '#f2a71b',
        borderRadius: 5,
    },
});
