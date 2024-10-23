import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import BusNumberBadge from '@components/BusNumberBadge';

export default function StopDetails() {
    const { id, name, userLatitude, userLongitude } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    const [stop, setStop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/bus-stops/${id}/buses`,
                );
                const data = await response.json();
                setStop(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bus stops:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useLayoutEffect(() => {
        if (stop) {
            navigation.setOptions({
                title: `${name}`,
            });
        }
    }, [stop, navigation]);

    if (loading) {
        return (
            <Screen>
                <ActivityIndicator size="large" color={Colors.textPrimary} />
            </Screen>
        );
    }

    if (!stop) {
        return (
            <Screen>
                <Text style={styles.errorText}>Parada no encontrada</Text>
            </Screen>
        );
    }

    const handleItemPress = async (item) => {
        router.push({
            pathname: '/route/route-details',
            params: {
                routeId: item.route_id,
                routeName: item.route_short_name,
                userLatitude: userLatitude,
                userLongitude: userLongitude,
            },
        });
    };

    const renderSeparator = () => {
        return <View style={styles.separator} />;
    };

    return (
        <Screen stack>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.subHeader}>Próximas llegadas</Text>
            </View>
            <FlatList
                data={stop}
                keyExtractor={(item) => item.route_id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <View style={styles.itemContainer}>
                            <BusNumberBadge
                                routeNumber={item.route_short_name}
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
                ItemSeparatorComponent={renderSeparator}
                ListFooterComponent={renderSeparator}
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
