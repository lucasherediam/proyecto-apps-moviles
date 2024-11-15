import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Animated,
    TouchableOpacity,
    Text,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { darkMapStyle } from '@/constants/Colors';
import { fetchRealTimePosition } from '@/hooks/useApi';
const busAnimation = require('@assets/busAnimation.json');
type Coordinate = {
    latitude: number;
    longitude: number;
};

export default function RouteDetails() {
    const { routeId, vehiclesPosition, userLatitude, userLongitude } =
        useLocalSearchParams<{
            routeId?: string;
            vehiclesPosition?: any;
            userLatitude?: string;
            userLongitude?: string;
        }>();

    const [routeShape, setRouteShape] = useState<Coordinate[]>([]);
    const [stops, setStops] = useState<Coordinate[]>([]);
    const [vehiclePositions, setVehiclePositions] = useState(
        JSON.parse(vehiclesPosition),
    );
    const [midPoint, setMidPoint] = useState<Coordinate | null>(null);
    const mapRef = useRef<MapView | null>(null);

    // Animation setup for bus marker blinking
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (routeId) {
            fetchRouteShapeAndStops(routeId);
            const interval = setInterval(updateVehiclePositions, 30000);
            return () => clearInterval(interval); // Clear interval on unmount
        }
    }, [routeId]);

    useEffect(() => {
        startBlinkingAnimation();
    }, []);

    const fetchRouteShapeAndStops = async (routeId: string) => {
        try {
            const shapeResponse = await axios.get(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bus-route/${routeId}/shape`,
            );
            const stopsResponse = await axios.get(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bus-route/${routeId}/stops`,
            );

            const shapeCoords: Coordinate[] = shapeResponse.data[0].points.map(
                (point: any) => ({
                    latitude: point.shape_pt_lat,
                    longitude: point.shape_pt_lon,
                }),
            );
            const stopCoords: Coordinate[] = stopsResponse.data.map(
                (stop: any) => ({
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                }),
            );

            setRouteShape(shapeCoords);
            setStops(stopCoords);

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

    const updateVehiclePositions = async () => {
        try {
            console.log(routeId);
            const response = await fetchRealTimePosition(routeId);
            setVehiclePositions(response);
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo actualizar la posición de los vehículos.',
            );
            console.error(error);
        }
    };

    const startBlinkingAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    };

    if (
        !midPoint ||
        !routeShape.length ||
        !stops.length ||
        !vehiclePositions.length
    ) {
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
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsPointsOfInterest={false}
                customMapStyle={darkMapStyle}
            >
                <Polyline
                    coordinates={routeShape}
                    strokeColor="blue"
                    strokeWidth={4}
                />

                {stops.map((stop, index) => (
                    <Marker key={index} coordinate={stop}>
                        <View style={styles.stopMarker}>
                            <View style={styles.innerStopMarker} />
                        </View>
                    </Marker>
                ))}

                {vehiclePositions.map((vehicle: any, index: number) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: vehicle.latitude,
                            longitude: vehicle.longitude,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <Animated.View
                            style={{ transform: [{ scale: scaleAnim }] }}
                        >
                            <LottieView
                                source={busAnimation}
                                autoPlay
                                loop
                                style={styles.lottieBus}
                            />
                        </Animated.View>
                    </Marker>
                ))}
            </MapView>

            <TouchableOpacity
                style={styles.reloadButton}
                onPress={updateVehiclePositions}
            >
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.reloadButtonText}>Recargar</Text>
            </TouchableOpacity>
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
        backgroundColor: '#f0f0f0',
    },
    map: {
        flex: 1,
    },
    stopMarker: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    innerStopMarker: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#007AFF',
    },
    lottieBus: {
        width: 60,
        height: 60,
    },
    reloadButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    reloadButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
});
