import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type SubwayLineBadgeProps = {
    line: string;
    agencyColor: string;
    details?: boolean;
};

const SubwayLineBadge = ({
    line,
    agencyColor,
    details,
}: SubwayLineBadgeProps) => {
    // Define formattedRouteNumber con el valor adecuado según expanded
    const routeShortNames: { [key: string]: string } = {
        'LineaA': 'Linea A',
        'LineaB': 'Linea B',
        'LineaC': 'Linea C',
        'LineaD': 'Linea D',
        'LineaE': 'Linea E',
        'LineaH': 'Linea H',
        'PM-Civico': 'PM Centro Civico', 
        "PM-Savio": 'PM General Savio',
    };

    let formattedRouteNumber = details
        ? line
        : line.match(/^\d+/)?.[0] || line;

    

    return (
        <View style={styles.badgeContainer}>
            <View style={styles.iconAndText}>
                <MaterialCommunityIcons
                    name="subway-variant"
                    size={18}
                    color="#FFFFFF"
                    style={styles.icon}
                />
                <Text style={styles.routeNumberText}>
                    {routeShortNames[line as keyof typeof routeShortNames] || line}
                </Text>
            </View>
            {/* Aplica el color solo a la barra inferior */}
            <View style={[styles.colorBar, { backgroundColor: agencyColor }]} />
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
        alignSelf: 'flex-start',
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 4,
    },
    routeNumberText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    colorBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
});

export default SubwayLineBadge;
