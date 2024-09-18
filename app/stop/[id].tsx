import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Cambiado a useLocalSearchParams
import busStopsData from '@data/feed-gtfs/stops.json';
import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';

export default function StopDetails() {
  const { id } = useLocalSearchParams(); // Obtener el id de la parada desde la URL

  // Buscar la información de la parada en los datos
  const stop = busStopsData.find((stop) => stop.stop_id === id);

  if (!stop) {
    return (
      <Screen>
        <Text style={styles.errorText}>Parada no encontrada</Text>
      </Screen>
    );
  }

  return (
    <Screen>
        <View style={styles.container}>
            <Text style={styles.title}>Detalles de la parada</Text>
            <Text style={styles.info}>ID: {stop.stop_id}</Text>
            <Text style={styles.info}>Nombre: {stop.stop_name}</Text>
            <Text style={styles.info}>Latitud: {stop.latitude}</Text>
            <Text style={styles.info}>Longitud: {stop.longitude}</Text>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.textPrimary
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.textPrimary
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
});
