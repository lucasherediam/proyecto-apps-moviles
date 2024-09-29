import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Agregar useRouter para la navegación
import busStopsData from '@data/feed-gtfs/stops_routes.json';
import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';

export default function StopDetails() {
    const { id, userLatitude, userLongitude } = useLocalSearchParams(); // Obtener el id de la parada desde la URL
    const router = useRouter(); // Usar el hook useRouter para navegar
    // Buscar la información de la parada en los datos
    const stop = busStopsData[id];
    // console.log(stop);

    if (!stop) {
        return (
            <Screen>
                <Text style={styles.errorText}>Parada no encontrada</Text>
            </Screen>
        );
    }

    // Función para manejar la selección del ítem y navegar
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

    return (
        <Screen stack>
            <View style={styles.container}>
                <FlatList
                    data={stop} // El array de colectivos
                    keyExtractor={(item) => item.route_id} // Usar el route_id como clave única
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleItemPress(item)}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.routeShortName}>
                                    {item.route_short_name}
                                </Text>
                                <Text style={styles.routeDesc}>
                                    {item.route_desc_simplified}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: Colors.cardBackground,
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeShortName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginRight: 5,
    },
    routeDesc: {
        fontSize: 16,
        color: Colors.textSecondary,
        flex: 1,
        flexWrap: 'wrap',
    },
    errorText: {
        fontSize: 20,
        color: 'red',
    },
});
