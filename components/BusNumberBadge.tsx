import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BusNumberBadge = ({ routeNumber }) => {
    // Extrae solo la parte numérica del número de ruta
    const formattedRouteNumber = routeNumber.match(/^\d+/)?.[0] || routeNumber;

    return (
        <View style={styles.badgeContainer}>
            <View style={styles.iconAndText}>
                <MaterialCommunityIcons
                    name="bus"
                    size={18}
                    color="#FFFFFF"
                    style={styles.icon}
                />
                <Text style={styles.routeNumberText}>
                    {formattedRouteNumber}
                </Text>
            </View>
            <View style={styles.redBar} />
        </View>
    );
};

const styles = StyleSheet.create({
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 4,
        padding: 4,
        position: 'relative',
        marginVertical: 4,
        height: 30,
        overflow: 'hidden',
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 4,
    },
    routeNumberText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    redBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#FF0000',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
});

export default BusNumberBadge;
