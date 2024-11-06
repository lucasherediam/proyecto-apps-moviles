import { useState, useEffect } from 'react';

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

type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const useNearbyTransit = (
    region: Region | null,
    minZoomLevelToShowStops: number,
) => {
    const [visibleStops, setVisibleStops] = useState<BusStop[]>([]);
    const [visibleStations, setVisibleStations] = useState<SubwayStation[]>([]);

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
    }, [region, minZoomLevelToShowStops]);

    return { visibleStops, visibleStations };
};

export default useNearbyTransit;
