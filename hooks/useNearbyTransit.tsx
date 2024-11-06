/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

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
            setVisibleStops((prevStops) => {
                const newStops = data.filter(
                    (stop: BusStop) =>
                        !prevStops.some(
                            (prevStop) => prevStop.stop_id === stop.stop_id,
                        ),
                );
                return [...prevStops, ...newStops];
            });
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
            setVisibleStations((prevStations) => {
                const newStations = data.filter(
                    (station: SubwayStation) =>
                        !prevStations.some(
                            (prevStation) =>
                                prevStation.station_id === station.station_id,
                        ),
                );
                return [...prevStations, ...newStations];
            });
        } catch (error) {
            console.error('Error fetching subway stations:', error);
        }
    };

    // Debounced fetch function to avoid too many API calls
    const debouncedFetchTransitData = debounce(
        (latitude, longitude, radius) => {
            fetchBusStops(latitude, longitude, radius);
            fetchSubwayStations(latitude, longitude, radius);
        },
        500,
    );

    useEffect(() => {
        if (region) {
            const { latitude, longitude, latitudeDelta } = region;

            // Limita el radio a 300 metros (EXPERIMENTAL)
            const radius = Math.min(latitudeDelta * 111000, 300);

            if (latitudeDelta <= minZoomLevelToShowStops) {
                debouncedFetchTransitData(latitude, longitude, radius);
            } else {
                setVisibleStops([]);
                setVisibleStations([]);
            }
        }

        return () => {
            debouncedFetchTransitData.cancel();
        };
    }, [region, minZoomLevelToShowStops]);

    return { visibleStops, visibleStations };
};

export default useNearbyTransit;
