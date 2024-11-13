import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/Colors';
import BusNumberBadge from '@components/BusNumberBadge';
import useAPI, { fetchRealTimePosition } from '@/hooks/useApi';
import { Ionicons } from '@expo/vector-icons';

export default function StopDetails() {
    const { id, name, userLatitude, userLongitude } = useLocalSearchParams();
    const [sections, setSections] = useState([]);
    const router = useRouter();
    const navigation = useNavigation();
    const { useFetchRoutesForStop } = useAPI();
    const { data: stopRoutes, isLoading } = useFetchRoutesForStop(id as string);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
        });
    }, [name, navigation]);

    useEffect(() => {
        if (stopRoutes && stopRoutes.length > 0) {
            const fetchPositions = async () => {
                try {
                    const routeIds = stopRoutes.map((route) => route.route_id);

                    const vehicles = (
                        await Promise.all(
                            routeIds.map((id) => fetchRealTimePosition(id)),
                        )
                    ).flat();

                    const vehiclesByRouteId = vehicles.reduce(
                        (acc, vehicle) => {
                            if (!acc[vehicle.route_id])
                                acc[vehicle.route_id] = [];
                            acc[vehicle.route_id].push({
                                latitude: vehicle.latitude,
                                longitude: vehicle.longitude,
                            });
                            return acc;
                        },
                        {},
                    );

                    const availableRoutes = [];
                    const inactiveRoutes = [];

                    stopRoutes.forEach((route) => {
                        const routeWithPositions = {
                            ...route,
                            positions: vehiclesByRouteId[route.route_id] || [],
                        };
                        if (routeWithPositions.positions.length > 0) {
                            availableRoutes.push(routeWithPositions);
                        } else {
                            inactiveRoutes.push(routeWithPositions);
                        }
                    });

                    setSections([
                        { title: 'Disponibles', data: availableRoutes },
                        {
                            title: 'Sin vehículos activos',
                            data: inactiveRoutes,
                        },
                    ]);
                } catch (error) {
                    console.error('Error fetching vehicle positions:', error);
                }
            };

            fetchPositions();

            const intervalId = setInterval(fetchPositions, 30000);

            return () => clearInterval(intervalId);
        }
    }, [stopRoutes]);

    const handleItemPress = (item) => {
        // Verifica si el número de colectivos activos es cero
        if (item.positions.length === 0) {
            // Muestra una alerta si no hay colectivos activos
            Alert.alert(
                'Sin colectivos activos',
                'No hay colectivos activos en este ramal en este momento.',
                [{ text: 'OK' }],
            );
        } else {
            // Si hay colectivos, navega a la pantalla de detalles de la ruta
            router.push({
                pathname: '/route/route-details',
                params: {
                    routeId: item.route_id,
                    vehiclesPosition: JSON.stringify(item.positions),
                    userLatitude: userLatitude,
                    userLongitude: userLongitude,
                },
            });
        }
    };

    const renderRouteItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.itemContainer}>
                <BusNumberBadge
                    routeNumber={item.route_short_name}
                    agencyColor={item.agency_color}
                    details={true}
                />
                <Text style={styles.routeDesc}>{item.trip_headsigns}</Text>
                <View style={styles.vehicleCountContainer}>
                    <Ionicons
                        name="bus"
                        size={20}
                        color={item.positions.length > 0 ? 'lightgreen' : 'red'}
                    />
                    <Text style={styles.vehicleCountText}>
                        {item.positions.length}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <Screen phauto pt={0}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            </Screen>
        );
    }

    if (!stopRoutes || stopRoutes.length === 0) {
        return (
            <Screen pt={0}>
                <View style={styles.notFoundContainer}>
                    <Ionicons
                        name="alert-circle"
                        size={50}
                        color={Colors.warning}
                    />
                    <Text style={styles.notFoundText}>
                        Parada no encontrada
                    </Text>
                    <Text style={styles.notFoundSubtext}>
                        No pudimos encontrar la información para esta parada.
                        Intenta nuevamente más tarde.
                    </Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen phauto pt={0}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Próximas llegadas</Text>
            </View>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.route_id}-${index}`}
                renderItem={renderRouteItem}
                renderSectionHeader={renderSectionHeader}
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
        borderRadius: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    sectionHeaderContainer: {
        paddingTop: 10,
        backgroundColor: Colors.background,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textSecondary,
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
    vehicleCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    vehicleCountText: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginLeft: 4,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.border,
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    notFoundText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.warning,
        marginTop: 10,
        textAlign: 'center',
    },
    notFoundSubtext: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    loadingText: {
        fontSize: 18,
        color: Colors.textPrimary,
        marginTop: 10,
        textAlign: 'center',
    },
});
