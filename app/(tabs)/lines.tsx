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

type Filter = 'all' | 'bus' | 'subte' | 'favorites' | 'alerts';

const Lines: React.FC = () => {
    const { useFetchAgencies } = useAPI();
    const { data: agencies = [], isLoading, isError } = useFetchAgencies();
    const [expandedLines, setExpandedLines] = useState<Record<string, boolean>>(
        {},
    );
    const [selectedFilter, setSelectedFilter] = useState<Filter>('all');

    const toggleExpandLine = useCallback((lineNumber: string) => {
        setExpandedLines((prev) => ({
            ...prev,
            [lineNumber]: !prev[lineNumber],
        }));
    }, []);

    const handleFilterChange = useCallback((filter: Filter) => {
        setSelectedFilter(filter);
    }, []);

    // Filtrar agencias de acuerdo al filtro seleccionado
    const filteredAgencies = useMemo(() => {
        return agencies.filter((agency) => {
            if (selectedFilter === 'bus') return agency.agency_type === 'bus';
            if (selectedFilter === 'subte')
                return agency.agency_type === 'subte';
            return true;
        });
    }, [agencies, selectedFilter]);

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
            {content}
        </Screen>
    );
};

const LoadingIndicator: React.FC = () => (
    <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
    </SafeAreaView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});

export default Lines;
