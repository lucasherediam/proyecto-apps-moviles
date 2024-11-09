// AnimatedAlert.tsx
import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import colors from '@/constants/Colors';

type SubwayAlertProps = {
    route_short_name: string;
    message: string;
};

const { width } = Dimensions.get('window');

const AnimatedAlert: React.FC<SubwayAlertProps> = ({ route_short_name, message }) => {
    const translateX = useRef(new Animated.Value(width)).current;
    const alertText = `${route_short_name}: ${message}`;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: -width * 2,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [translateX]);

    return (
        <Animated.View style={[styles.alertContainer, { transform: [{ translateX }] }]}>
            <Text style={styles.animatedText}>{alertText}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    alertContainer: {
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 8,
        width: width * 2, // Hace el contenedor suficientemente ancho para desplazarse
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Para la sombra en Android
    },
    animatedText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AnimatedAlert;
