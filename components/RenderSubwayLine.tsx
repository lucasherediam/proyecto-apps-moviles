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
            {
                <View style={styles.expandedContainer}>
                    {
                        <View
                            key={`${agencyName}`}
                            style={styles.routeContainer}
                        >
                            <SubwayLineBadge
                                line={agencyName}
                                agencyColor={agencyColor}
                                details={true}
                            />
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => {}}
                            >
                                <Ionicons
                                    name={
                                        isFavorite ? 'heart' : 'heart-outline'
                                    }
                                    size={24}
                                    color={
                                        isFavorite
                                            ? Colors.primary
                                            : Colors.textPrimary
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    lineContainer: {
        marginHorizontal: Spacing.margin.base,
        marginVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    lineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    lineTitle: {
        fontSize: 14,
        color: Colors.textPrimary,
        marginLeft: 8,
        flex: 1,
    },
    favoriteButton: {
        padding: 4,
    },
    expandedContainer: {
        paddingLeft: 16,
        paddingVertical: 6,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        justifyContent: 'space-between',
    },
    routeDesc: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginLeft: 8,
        flex: 1,
    },
});

export default RenderSubwayLine;
