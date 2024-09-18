import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { BusStopIcon } from '@components/Icons';
import { Link } from 'expo-router';
import debounce from 'lodash.debounce'; // Asegúrate de instalar lodash.debounce
const busStopsData: BusStop[] = require('@data/feed-gtfs/stops.json');

// Tipos para los datos de las paradas de autobús
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

    const maxZoomLevelToShowStops = 0.01;
    const minZoomLevelToShowStops = 0.001;

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
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            setLoading(false); // Solo paramos de cargar cuando tenemos la ubicación
        })();
    }, []);

    // Filtrado de paradas de autobús de forma optimizada
    const filterBusStops = useCallback(
        debounce((currentRegion: Region) => {
            const { latitudeDelta, longitude, latitude, longitudeDelta } =
                currentRegion;

            if (
                latitudeDelta <= maxZoomLevelToShowStops &&
                latitudeDelta >= minZoomLevelToShowStops
            ) {
                // Limitar el cálculo solo a las paradas más cercanas a la región actual
                const stopsInView = busStopsData.filter((stop: BusStop) => {
                    return (
                        stop.latitude >= latitude - latitudeDelta / 2 &&
                        stop.latitude <= latitude + latitudeDelta / 2 &&
                        stop.longitude >= longitude - longitudeDelta / 2 &&
                        stop.longitude <= longitude + longitudeDelta / 2
                    );
                });
                setVisibleStops(stopsInView);
            } else {
                setVisibleStops([]); // Vaciar cuando el zoom no es suficiente
            }
        }, 500), // Debounce de 500ms para limitar la frecuencia del cálculo
        [],
    );

    // Solo cargar las paradas de autobús cuando la región está definida
    useEffect(() => {
        if (region) {
            filterBusStops(region);
        }
    }, [region]);

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
                    >
                        <Link href={`/stop/${stop.stop_id}`}>
                            <BusStopIcon />
                        </Link>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}
