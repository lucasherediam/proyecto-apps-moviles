/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import useAPI from '@/hooks/useApi';
import colors from '@/constants/Colors';

const FavoritesScreen = () => {
    const { useFetchFavorites } = useAPI();
    const { data: favoriteLines, isLoading, error } = useFetchFavorites();

    // Manejo de error al cargar las líneas favoritas
    if (error) {
        Alert.alert('Error', 'Hubo un problema al conectar con la API.');
    }

    // Renderizar cada línea favorita
    const renderFavoriteItem = ({ item }: { item: string }) => (
        <View style={styles.favoriteItem}>
            <Text style={styles.text}>Línea {item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Favoritos</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : favoriteLines && favoriteLines.length > 0 ? (
                <FlatList
                    data={favoriteLines}
                    keyExtractor={(item) => item}
                    renderItem={renderFavoriteItem}
                />
            ) : (
                <Text style={styles.noFavoritesText}>
                    No tienes líneas favoritas.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.textPrimary,
    },
    text: {
        padding: 10,
        backgroundColor: colors.cardBackground,
        marginBottom: 5,
        color: colors.textPrimary,
    },
    favoriteItem: {
        padding: 10,
        backgroundColor: colors.cardBackground,
        borderRadius: 5,
        marginBottom: 10,
    },
    noFavoritesText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FavoritesScreen;
