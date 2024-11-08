import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

type ArrivalItemProps = {
    destination: string;
    remainingTime: string;
};

const ArrivalItem: React.FC<ArrivalItemProps> = ({ destination, remainingTime }) => {
    return (
        <TouchableOpacity>
            <View style={styles.itemContainer}>
                <Text style={styles.routeDesc}>{destination}</Text>
                <View style={styles.timeInfoContainer}>
                    <FontAwesome name="clock-o" size={16} color={Colors.textSecondary} />
                    <Text style={styles.timeText}>Salida en: {remainingTime}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});

export default ArrivalItem;
