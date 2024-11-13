/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/Colors';
import BusNumberBadge from '@components/BusNumberBadge';
import useAPI, { fetchRealTimePosition } from '@/hooks/useApi';

type BusRouteItem = {
    route_id: string;
    route_short_name: string;
    agency_color: string;
    trip_headsigns: string;
};

export default function StopDetails() {
    const { id, name, userLatitude, userLongitude } = useLocalSearchParams();
    const [vehiclesAvailable, setVehicleAvailability] = useState([]);
    const router = useRouter();
    const navigation = useNavigation();
    const { useFetchRoutesForStop } = useAPI();
    const { data: stopRoutes, isLoading } = useFetchRoutesForStop(id as string);

    useLayoutEffect(() => {
        if (!stopRoutes) return;

        const fetchPositions = async () => {
            try {
                const routeIds = stopRoutes.map((route) => route.route_id);

                // Fetch vehicle positions for all route IDs in parallel
                const vehicles = (
                    await Promise.all(
                        routeIds.map((id) => fetchRealTimePosition(id)),
                    )
                ).flat();

                // Group vehicles by route_id for easy access
                const vehiclesByRouteId = vehicles.reduce((acc, vehicle) => {
                    if (!acc[vehicle.route_id]) acc[vehicle.route_id] = [];
                    acc[vehicle.route_id].push({
                        latitude: vehicle.latitude,
                        longitude: vehicle.longitude,
                    });
                    return acc;
                }, {});

                // Extract route IDs with available vehicles
                const activeRouteIds = new Set(
                    vehicles.map((vehicle) => vehicle.route_id),
                );

                // Filter stopRoutes and add vehicle positions if available
                const availableRoutes = stopRoutes
                    .filter((route) => activeRouteIds.has(route.route_id))
                    .map((route) => ({
                        ...route,
                        positions: vehiclesByRouteId[route.route_id] || [],
                    }));
                setVehicleAvailability(availableRoutes);
            } catch (error) {
                console.error('Error fetching vehicle positions:', error);
            }
        };

        fetchPositions();

        navigation.setOptions({
            title: name,
        });
    }, [stopRoutes, name, navigation]);

    if (!stopRoutes && isLoading) {
        return (
            <Screen>
                <Text style={styles.errorText}>Parada no encontrada</Text>
            </Screen>
        );
    }

    const handleItemPress = async (item: BusRouteItem) => {
        router.push({
            pathname: '/route/route-details',
            params: {
                routeId: item.route_id,
                vehiclesPosition: JSON.stringify(item.positions),
                userLatitude: userLatitude,
                userLongitude: userLongitude,
            },
        });
    };
    return (
        <Screen phauto pt={0}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.subHeader}>Próximas llegadas</Text>
            </View>
            <FlatList
                data={vehiclesAvailable}
                keyExtractor={(item, index) => `${item.route_id}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <View style={styles.itemContainer}>
                            <BusNumberBadge
                                routeNumber={item.route_short_name}
                                agencyColor={item.agency_color}
                                details={true}
                            />
                            <Text style={styles.routeDesc}>
                                {item.trip_headsigns}
                            </Text>
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>
                                    {item.scheduled_time}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => <View style={styles.separator} />}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
        backgroundColor: Colors.primary,
        marginBottom: 20,
        alignItems: 'center',
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
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeDesc: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginLeft: 10,
        flex: 1,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginLeft: 4,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.border,
    },
    errorText: {
        fontSize: 20,
        color: 'red',
    },
});
