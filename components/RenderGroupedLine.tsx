import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BusNumberBadge from '@components/BusNumberBadge';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { useFavorites } from '@/context/FavoriteContext';

type RenderGroupedLineProps = {
    line: {
        lineNumber: string;
        routes?: { lineName: string; lineNumber: string; mainPath: string }[];
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
    const { favoriteLines, toggleFavorite } = useFavorites();

    const isFavorite = favoriteLines.includes(line.lineNumber);

    const handleFavoriteToggle = useCallback(() => {
        toggleFavorite(line.lineNumber);
    }, [line.lineNumber, toggleFavorite]);

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
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleFavoriteToggle}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={24}
                            color={
                                isFavorite ? colors.primary : colors.textPrimary
                            }
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.expandedContainer}>
                    {line.routes?.map((route, index) => (
                        <View
                            key={`${route.lineName}-${index}`}
                            style={styles.routeContainer}
                        >
                            <BusNumberBadge
                                routeNumber={route.lineNumber}
                                agencyColor={agencyColor}
                            />
                            <Text style={styles.routeDesc}>
                                {route.mainPath}
                            </Text>
                        </View>
                    ))}
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
