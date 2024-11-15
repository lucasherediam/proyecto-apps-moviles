import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

type LocationCoords = {
    latitude: number;
    longitude: number;
};

export default function useCurrentLocation() {
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setLoading(false);
        };

        getLocation();
    }, []);

    return { location, loading };
}
