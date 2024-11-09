import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BusNumberBadge from '@components/BusNumberBadge';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { useFavorites } from '@/context/FavoriteContext';

type RenderGroupedLineProps = {
    line: {
        lineNumber: string;
        routes?: {
            lineName: string;
            lineNumber: string;
            lineRouteId: string;
            mainPath: string;
        }[];
    };
    agencyColor: string;
    toggleExpandLine: (lineNumber: string) => void;
    isExpanded: boolean;
};

const RenderGroupedLine: React.FC<RenderGroupedLineProps> = ({
    line,
    agencyColor,
    toggleExpandLine,
    isExpanded,
}) => {
    const { favoriteRoutes, toggleFavorite } = useFavorites();

    return (
        <View style={styles.lineContainer}>
            <TouchableOpacity onPress={() => toggleExpandLine(line.lineNumber)}>
                <View style={styles.lineHeader}>
                    <BusNumberBadge
                        routeNumber={line.lineNumber}
                        agencyColor={agencyColor}
                    />
                    <Text style={styles.lineTitle}>
                        Línea {line.lineNumber}
                    </Text>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.expandedContainer}>
                    {line.routes?.map((route, index) => {
                        const isFavorite = favoriteRoutes.includes(
                            route.lineRouteId,
                        );

                        return (
                            <View
                                key={`${route.lineName}-${index}`}
                                style={styles.routeContainer}
                            >
                                <BusNumberBadge
                                    routeNumber={route.lineName}
                                    agencyColor={agencyColor}
                                    details={true}
                                />
                                <Text style={styles.routeDesc}>
                                    {route.mainPath}
                                </Text>
                                <TouchableOpacity
                                    style={styles.favoriteButton}
                                    onPress={() =>
                                        toggleFavorite(route.lineRouteId)
                                    }
                                >
                                    <Ionicons
                                        name={
                                            isFavorite
                                                ? 'heart'
                                                : 'heart-outline'
                                        }
                                        size={24}
                                        color={
                                            isFavorite
                                                ? colors.primary
                                                : colors.textPrimary
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    lineContainer: {
        marginHorizontal: Spacing.margin.base,
        marginVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    lineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    lineTitle: {
        fontSize: 14,
        color: colors.textPrimary,
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
    },
    routeDesc: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
        flex: 1,
    },
});

export default RenderGroupedLine;
