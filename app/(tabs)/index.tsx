import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { BusStopIcon } from '@components/Icons';
import { router } from 'expo-router';

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
            setLoading(false);
        })();
    }, []);

    const fetchBusStops = async (
        latitude: number,
        longitude: number,
        radius: number,
    ) => {
        try {
            const response = await fetch(
                `http://localhost:3000/bus-stops/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
            );
            const data = await response.json();
            setVisibleStops(data);
        } catch (error) {
            console.error('Error fetching bus stops:', error);
        }
    };

    useEffect(() => {
        if (region) {
            const { latitude, longitude, latitudeDelta } = region;
            if (latitudeDelta <= minZoomLevelToShowStops) {
                const radius = latitudeDelta * 111000;
                fetchBusStops(latitude, longitude, radius);
            } else {
                setVisibleStops([]);
            }
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
                        onPress={() => {
                            router.push({
                                pathname: `/stop/[id]`,
                                params: { id: stop.stop_id },
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
