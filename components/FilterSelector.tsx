import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/Colors';

type Filter = 'all' | 'bus' | 'subte' | 'favorites' | 'alerts';

type FilterSelectorProps = {
    activeFilter: string;
    onFilterChange: (filter: Filter) => void;
};

const FilterSelector = React.memo(
    ({ activeFilter, onFilterChange }: FilterSelectorProps) => {
        const filters = [
            { id: 'alerts', icon: 'bell-outline' },
            { id: 'favorites', icon: 'heart-outline' },
            { id: 'all', icon: 'view-dashboard-outline' },
            { id: 'bus', icon: 'bus' },
            { id: 'subte', icon: 'subway-variant' },
        ];

        return (
            <View style={styles.selectorContainer}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterButton,
                            activeFilter === filter.id && styles.filterButtonActive,
                        ]}
                        onPress={() => onFilterChange(filter.id as Filter)}
                    >
                        <Icon
                            name={filter.icon}
                            size={24}
                            color={Colors.textPrimary}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    },
);

FilterSelector.displayName = 'FilterSelector';

const styles = StyleSheet.create({
    selectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    filterButton: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.background,
    },
    filterButtonActive: {
        backgroundColor: Colors.primary, // Color para el filtro activo
    },
});

export default FilterSelector;
