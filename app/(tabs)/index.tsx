import React, { useEffect, useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { BusStopIcon } from '@components/Icons';
import { router } from 'expo-router';
const busStopsData: BusStop[] = require('@data/feed-gtfs/stops.json');

type BusStop = {
    stop_id: string;
    latitude: number;
    longitude: number;
};

type LocationCoords = {
    latitude: number;
    longitude: number;
};

export default function Home() {
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [visibleStops, setVisibleStops] = useState<BusStop[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [region, setRegion] = useState<Region | null>(null);

    const minZoomLevelToShowStops = 0.015;

    // Obtener la ubicación actual
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            setLoading(false); // Solo paramos de cargar cuando tenemos la ubicación
        })();
    }, []);

    // Memoizar el cálculo de las paradas visibles para no re-renderizar el mapa innecesariamente
    const filteredBusStops = useMemo(() => {
        if (!region) return [];

        const { latitudeDelta, longitude, latitude, longitudeDelta } = region;
        console.log(
            'latitudeDelta:' +
                latitudeDelta +
                ' min:' +
                minZoomLevelToShowStops,
        );
        if (latitudeDelta <= minZoomLevelToShowStops) {
            return busStopsData.filter((stop: BusStop) => {
                return (
                    stop.latitude >= latitude - latitudeDelta / 2 &&
                    stop.latitude <= latitude + latitudeDelta / 2 &&
                    stop.longitude >= longitude - longitudeDelta / 2 &&
                    stop.longitude <= longitude + longitudeDelta / 2
                );
            });
        } else {
            return [];
        }
    }, [region]);

    // Actualizar las paradas visibles cuando cambia el resultado filtrado
    useEffect(() => {
        setVisibleStops(filteredBusStops);
    }, [filteredBusStops]);

    if (loading || !location) {
        return <Text>Loading map...</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                region={region as Region}
                onRegionChangeComplete={(newRegion) => {
                    setRegion(newRegion);
                }}
                showsUserLocation={true}
                customMapStyle={[
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                    },
                    {
                        featureType: 'transit',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'off' }],
                    },
                ]}
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
                                pathname: `/stop/${stop.stop_id}`,
                            });
                        }}
                    >
                        <BusStopIcon />
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}
