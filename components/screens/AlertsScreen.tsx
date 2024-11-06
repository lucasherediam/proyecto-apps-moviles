import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/Colors';

const AlertsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Alertas</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 10,
    },
    text: {
        padding: 10,
        backgroundColor: colors.cardBackground,
        marginBottom: 5,
        color: colors.textPrimary,
    },
});

export default AlertsScreen;
