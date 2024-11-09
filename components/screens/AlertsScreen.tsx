import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import colors from '@/constants/Colors';
import Colors from '@/constants/Colors';
import AnimatedAlert from '@/components/AnimatedAlert';

type SubwayAlert = {
    route_id: string;
    route_short_name: string;
    message: string;
};

const AlertsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [subwayAlerts, setSubwayAlerts] = useState<SubwayAlert[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const responseSubwayAlerts = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/subway-alerts/`,
                );
                const dataSubwayAlerts = await responseSubwayAlerts.json();
                setSubwayAlerts(dataSubwayAlerts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching alerts:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderSeparator = () => <View style={styles.separator} />;

    const noAlertsFound = () => (
        <View>
            <Text style={styles.errorText}>No se encontraron llegadas</Text>
        </View>
    );

    const alertsFound = () => (
        <FlatList
            data={subwayAlerts}
            keyExtractor={(item) => item.route_short_name}
            renderItem={({ item }) => <AnimatedAlert {...item} />}
            ItemSeparatorComponent={renderSeparator}
            ListFooterComponent={renderSeparator}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alertas</Text>
            {subwayAlerts.length === 0 ? noAlertsFound() : alertsFound()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 10,
    },
    title: {
        fontSize: 24,
        color: colors.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
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

export default AlertsScreen;
