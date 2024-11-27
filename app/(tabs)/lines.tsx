import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import useAPI from '@/hooks/useApi';
import FilterSelector from '@components/FilterSelector';
import RenderGroupedLine from '@components/RenderGroupedLine';
import Favorites from '@components/screens/FavoritesScreen';
import AlertsScreen from '@components/screens/AlertsScreen';
import { Colors } from '@constants/Colors';
import RenderSubwayLine from '@components/RenderSubwayLine';
import { Screen } from '@/components/Screen';
import SearchBar from '@components/SearchBar'; // Asegúrate de tener el componente

type Line = {
  lineNumber: string;
  lineName: string;
  lineRouteId: string;
  mainPath: string;
};

type Agency = {
  agency_id: number;
  agency_name: string;
  agency_color: string;
  agency_type: 'bus' | 'subte';
  routes: Line[];
};

type Filter = 'bus' | 'subte' | 'favorites' | 'alerts';

const Lines: React.FC = () => {
  const { useFetchAgencies } = useAPI();
  const { data: agencies = [], isLoading, isError } = useFetchAgencies();
  const [expandedLines, setExpandedLines] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedFilter, setSelectedFilter] = useState<Filter>('bus');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpandLine = useCallback((lineNumber: string) => {
    setExpandedLines((prev) => ({
      ...prev,
      [lineNumber]: !prev[lineNumber],
    }));
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setSelectedFilter(filter);
    setSearchQuery(''); 
  }, []);

  const filteredAgencies = useMemo(() => {
    let agenciesFilteredByVehicle = agencies.filter((agency) => {
      if (selectedFilter === 'bus') return agency.agency_type === 'bus';
      if (selectedFilter === 'subte') return agency.agency_type === 'subte';
      return true;
    });
  
    if (searchQuery.trim() !== '') {
        agenciesFilteredByVehicle = agenciesFilteredByVehicle
        .map((agency) => ({
          ...agency,
          routes: agency.routes.filter((route) =>
            route.lineNumber
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase().trim()),
          ),
        }))
        .filter((agency) => agency.routes.length > 0); 
    }
    return agenciesFilteredByVehicle;
  }, [agencies, selectedFilter, searchQuery]);

  const renderAgency: ListRenderItem<Agency> = useCallback(
    ({ item }) => (
      <View style={styles.agencyContainer}>
        <Text style={styles.agencyTitle}>{item.agency_name}</Text>
        {item.routes.map((line, index) => (
          <RenderGroupedLine
            key={`${line.lineNumber}-${index}`}
            line={line}
            agencyColor={item.agency_color}
            toggleExpandLine={toggleExpandLine}
            isExpanded={expandedLines[line.lineNumber]}
          />
        ))}
      </View>
    ),
    [expandedLines, toggleExpandLine],
  );

  const renderSubwayAgency: ListRenderItem<Agency> = useCallback(
    ({ item }) => (
      <View>
        <RenderSubwayLine
          key={`${item.agency_name}`}
          agencyName={item.agency_name}
          route={item.routes[0]}
          agencyColor={item.agency_color}
        />
      </View>
    ),
    [expandedLines, toggleExpandLine],
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <ErrorDisplay message={isError || 'Error loading agencies'} />;
  }

  let content;
  if (selectedFilter === 'favorites') {
    content = <Favorites />;
  } else if (selectedFilter === 'alerts') {
    content = <AlertsScreen />;
  } else if (selectedFilter === 'subte') {
    content = (
      <FlatList
        data={filteredAgencies}
        renderItem={renderSubwayAgency}
        keyExtractor={(item) => item.agency_id.toString()}
        ListEmptyComponent={<Text>No subways available.</Text>}
      />
    );
  } else {
    content = (
      <FlatList
        data={filteredAgencies}
        renderItem={renderAgency}
        keyExtractor={(item) => item.agency_id.toString()}
        ListEmptyComponent={<Text>No agencies available.</Text>}
      />
    );
  }

  return (
    <Screen>
      <FilterSelector
        activeFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
      {(selectedFilter === 'bus') && (
        <SearchBar
          placeholder="Buscar línea por nombre..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      )}
      {content}
    </Screen>
  );
};

const LoadingIndicator: React.FC = () => (
  <Screen phauto pt={0}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  </Screen>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <SafeAreaView style={styles.errorContainer}>
    <Text style={styles.errorText}>Error: {message}</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
  agencyContainer: {
    marginBottom: 15,
  },
  agencyTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.cardBackground,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Lines;
