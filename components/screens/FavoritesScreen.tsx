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
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { useFavorites } from '@/context/FavoriteContext';

type Line = {
  route_id: string;
  route_short_name: string;
  route_desc: string;
};

const FavoritesScreen = () => {
  const { useFetchFavorites } = useAPI();
  const { data: favoriteLines, isLoading, error } = useFetchFavorites();
  const { favoriteRoutes, toggleFavorite } = useFavorites();

  // Manejo de error al cargar las líneas favoritas
  if (error) {
    Alert.alert('Error', 'Hubo un problema al conectar con la API.');
  }

  const renderLeftActions = (lineRouteId: string) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => toggleFavorite(lineRouteId)}
    >
      <Text style={styles.deleteButtonText}>Eliminar</Text>
    </RectButton>
  );

  // Renderizar cada línea favorita con los datos del backend
  const renderFavoriteItem = ({ item }: { item: Line }) => (
    <View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Swipeable renderLeftActions={() => renderLeftActions(item.route_id)}>
          <View style={styles.favoriteItem}>
            <Text style={styles.routeName}>
              {item.route_short_name.includes('Linea')
                ? item.route_short_name
                : `Linea ${item.route_short_name}`}
            </Text>
            <Text style={styles.routeDesc}>
              {item.route_desc || 'Sin descripción'}
            </Text>
          </View>
        </Swipeable>
      </GestureHandlerRootView>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favoritos</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : favoriteLines && favoriteLines.length > 0 ? (
        <FlatList
          data={favoriteLines}
          keyExtractor={(item) => item.route_id}
          renderItem={renderFavoriteItem}
        />
      ) : (
        <Text style={styles.noFavoritesText}>No tienes líneas favoritas.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  routeDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  favoriteItem: {
    padding: 10,
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    marginBottom: 10,
  },
  noFavoritesText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
