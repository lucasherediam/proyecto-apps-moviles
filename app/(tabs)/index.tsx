import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { BusStopIcon, SubwayStationIcon } from '@components/Icons';
import { router } from 'expo-router';

type BusStop = {
    stop_id: string;
    stop_name: string;
    latitude: number;
    longitude: number;
};

type SubwayStation = {
    station_id: string;
    station_name: string;
    latitude: number;
    longitude: number;
    route_short_name: string;
};

type LocationCoords = {
    latitude: number;
    longitude: number;
};

export default function Home() {
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [visibleStops, setVisibleStops] = useState<BusStop[]>([]);
    const [visibleStations, setVisibleStations] = useState<SubwayStation[]>([]);
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
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bus-stops/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
            );
            const data = await response.json();
            setVisibleStops(data);
        } catch (error) {
            console.error('Error fetching bus stops:', error);
        }
    };

    const fetchSubwayStations = async (
        latitude: number,
        longitude: number,
        radius: number,
    ) => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-stations/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
            );
            const data = await response.json();
            setVisibleStations(data);
        } catch (error) {
            console.error('Error fetching subway stations:', error);
        }
    };

    useEffect(() => {
        if (region) {
            const { latitude, longitude, latitudeDelta } = region;
            if (latitudeDelta <= minZoomLevelToShowStops) {
                const radius = latitudeDelta * 111000;
                fetchBusStops(latitude, longitude, radius);
                fetchSubwayStations(latitude, longitude, radius);
            } else {
                setVisibleStops([]);
                setVisibleStations([]);
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
            </MapView>
        </View>
    );
}
