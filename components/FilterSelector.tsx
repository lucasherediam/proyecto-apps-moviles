import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type Filter = 'all' | 'bus' | 'subte' | 'favorites' | 'alerts';

type FilterSelectorProps = {
    activeFilter: string;
    onFilterChange: (filter: Filter) => void;
};

const FilterSelector = React.memo(
    ({ activeFilter, onFilterChange }: FilterSelectorProps) => {
        const filtersHeader = [
            'Alertas',
            'Favoritos',
            'Todo',
            'Colectivos',
            'Subtes',
        ];
        const filters = ['alerts', 'favorites', 'all', 'bus', 'subte'];

        return (
            <View style={styles.selectorContainer}>
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            activeFilter === filter &&
                                styles.filterButtonActive,
                        ]}
                        onPress={() => onFilterChange(filter as Filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === filter &&
                                    styles.filterTextActive,
                            ]}
                        >
                            {filtersHeader[index]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    },
);
// Añadir displayName al componente para evitar la advertencia de ESLint
FilterSelector.displayName = 'FilterSelector';

const styles = StyleSheet.create({
    selectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: Colors.background,
    },
    filterButtonActive: {
        backgroundColor: Colors.primary, // Color para el filtro activo
    },
    filterTextActive: {
        color: Colors.textSecondary, // Color para el texto del filtro activo
    },
    filterText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
    },
});

export default FilterSelector;
