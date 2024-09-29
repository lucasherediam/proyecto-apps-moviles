import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import routeData from '@data/feed-gtfs/routes_stops.json';

export default function RouteDetails() {
    const { routeId, userLatitude, userLongitude } = useLocalSearchParams(); // Obtener el routeId desde los parámetros
    const [routeShape, setRouteShape] = useState([]); // Estado para el recorrido de la ruta (array con todas las coordenadas de las paradas)
    const [midPoint, setMidPoint] = useState({ latitude: 0, longitude: 0 }); // Estado para el punto medio
    const mapRef = useRef(null); // Referencia al mapa

    useEffect(() => {
        if (routeId && routeData[routeId]) {
            // Convertir coordenadas de las paradas de la ruta
            const stops = routeData[routeId].stops
                .map((stop) => {
                    const latitude = parseFloat(stop.stop_lat);
                    const longitude = parseFloat(stop.stop_lon);
                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        return {
                            latitude,
                            longitude,
                        };
                    }
                    return null; // Filtrar valores nulos o no válidos
                })
                .filter((coord) => coord !== null); // Filtrar los valores nulos

            setRouteShape(stops);

            // Calcular el punto medio de la ruta
            if (stops.length > 0) {
                const midLatitude =
                    (stops[0].latitude + stops[stops.length - 1].latitude) / 2;
                const midLongitude =
                    (stops[0].longitude + stops[stops.length - 1].longitude) /
                    2;
                setMidPoint({ latitude: midLatitude, longitude: midLongitude });
            }
        }
    }, [routeId]);

    useEffect(() => {
        // Ajustar el zoom para que se vea toda la ruta y la ubicación del usuario
        if (
            mapRef.current &&
            routeShape.length > 0 &&
            userLatitude &&
            userLongitude
        ) {
            const coordinates = [
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

    if (!routeShape.length) {
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
                {/* Mostrar la polilínea del recorrido */}
                <Polyline
                    coordinates={routeShape}
                    strokeColor="blue" // Color de la línea
                    strokeWidth={8} // Grosor de la línea
                />
                {/* Mostrar marcadores para cada parada */}
                {routeShape.map((stop, index) => (
                    <Marker
                        key={index}
                        coordinate={stop}
                        title={`Parada ${index + 1}`}
                    >
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
        backgroundColor: 'blue',
        borderRadius: 5,
    },
});
