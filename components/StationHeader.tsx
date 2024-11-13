import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type StationHeaderProps = {
    name: string;
    color: string;
    onPress: () => void;
};

const StationHeader: React.FC<StationHeaderProps> = ({
    name,
    color,
    onPress,
}) => {
    return (
        <Pressable onPress={onPress}>
            <View
                style={[
                    styles.headerContainer,
                    { backgroundColor: color || Colors.primary },
                ]}
            >
                <Text style={styles.headerTitle}>Próximas llegadas</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
        backgroundColor: Colors.primary,
        marginBottom: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    subHeader: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 16,
    },
});

export default StationHeader;
