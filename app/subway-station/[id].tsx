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

export default function StationDetails() {
    const { id, name, userLatitude, userLongitude } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-stations/${id}`,
                );
                const data = await response.json();
                setStation(data);
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
                title: `${name}`,
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
                <Text style={styles.errorText}>Estacion no encontrada</Text>
            </Screen>
        );
    }

    return (
        <Screen stack>
            <View style={[styles.headerContainer, { backgroundColor: station.color || Colors.primary }]}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.subHeader}>Próximas llegadas</Text>
            </View>
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
