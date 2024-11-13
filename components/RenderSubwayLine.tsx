import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BusNumberBadge from '@components/BusNumberBadge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { useFavorites } from '@/context/FavoriteContext';
import SubwayLineBadge from './SubwayLineBadge';

type RenderGroupedLineProps = {
    agencyName: string;
    agencyColor: string;
};

const RenderSubwayLine: React.FC<RenderGroupedLineProps> = ({
    agencyName,
    agencyColor,
}) => {
    const { favoriteRoutes, toggleFavorite } = useFavorites();
    const isFavorite = favoriteRoutes.includes(agencyName);
    return (
        <View style={styles.lineContainer}>
            <View key={`${agencyName}`} style={styles.routeContainer}>
                <View>
                    <SubwayLineBadge
                        line={agencyName}
                        agencyColor={agencyColor}
                        details={true}
                    />
                </View>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => {}}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? Colors.primary : Colors.textPrimary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    lineContainer: {
        marginHorizontal: Spacing.margin.base,
        borderBottomWidth: 1,
        paddingVertical: 8,
        borderBottomColor: Colors.border,
    },
    favoriteButton: {
        padding: 4,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        justifyContent: 'space-between',
    },
});

export default RenderSubwayLine;
