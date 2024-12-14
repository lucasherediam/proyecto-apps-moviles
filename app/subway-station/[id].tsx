import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { FontAwesome } from '@expo/vector-icons';
import StationHeader from '@/components/StationHeader';
import ArrivalItem from '@/components/ArrivalItem';

type SubwayStation = {
    station_id: string;
    station_name: string;
    latitude: number;
    longitude: number;
    route_short_name: string;
    color: string;
};

type SubwayArrivalItem = {
    destination: string;
    station_name: string;
    arrival: Arrival;
    departure: Departure;
};

type Arrival = {
    time: string;
    remainingTime: string;
};

type Departure = {
    time: string;
    remainingTime: string;
};

export default function StationDetails() {
    const { id, name, userLatitude, userLongitude } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    const [station, setStation] = useState<SubwayStation | null>(null);
    const [arrivals, setArrivals] = useState<SubwayArrivalItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const responseSubwayStation = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-stations/${id}`,
                );
                const dataSubwayStation = await responseSubwayStation.json();
                setStation(dataSubwayStation);
                const responseArrivals = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-stations/${id}/arrival`,
                );
                const dataArrivals = await responseArrivals.json();
                setArrivals(dataArrivals);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subway station:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useLayoutEffect(() => {
        if (station) {
            navigation.setOptions({
                title: `Volver`,
            });
        }
    }, [station, navigation]);

    if (loading) {
        return (
            <Screen>
                <ActivityIndicator size="large" color={Colors.textPrimary} />
            </Screen>
        );
    }

    if (!station) {
        return (
            <Screen>
                <Text style={styles.errorText}>Estación no encontrada</Text>
            </Screen>
        );
    }

    const handleItemPress = async (station: SubwayStation) => {
        router.push({
            pathname: '/subway-line/line-details',
            params: {
                station_id: station.station_id,
                station_name: station.station_name,
                latitude: station.latitude,
                longitude: station.longitude,
                route_short_name: station.route_short_name,
                color: station.color,
                userLatitude: userLatitude,
                userLongitude: userLongitude,
            },
        });
    };

    const renderSeparator = () => {
        return <View style={styles.separator} />;
    };

    const noArrivalsFound = () => {
        return (
            <View>
                <Text style={styles.errorText}>No se encontraron llegadas</Text>
            </View>
        );
    };

    const arrivalsFound = () => {
        return (
            <FlatList
                data={arrivals}
                keyExtractor={(item) => item.destination}
                renderItem={({ item }) => (
                    <ArrivalItem
                        destination={item.destination}
                        remainingTime={item.departure.remainingTime}
                    />
                )}
                ItemSeparatorComponent={renderSeparator}
                ListFooterComponent={renderSeparator}
            />
        );
    };

    return (
        <Screen phauto pt={0}>
            {station && (
                <StationHeader
                    name={station.station_name}
                    color={station.color}
                    onPress={() => handleItemPress(station)}
                />
            )}
            {arrivals.length === 0 ? noArrivalsFound() : arrivalsFound()}
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
        backgroundColor: Colors.primary,
        marginBottom: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    subHeader: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 16,
    },
    itemContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        backgroundColor: Colors.cardBackground,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    routeDesc: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    timeInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    timeText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginLeft: 8,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.border,
    },
    errorText: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
