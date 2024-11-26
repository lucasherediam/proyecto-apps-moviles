import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type SearchBarProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder,
    value,
    onChangeText,
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cardBackground,
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    input: {
        backgroundColor: Colors.background,
        padding: 10,
        borderRadius: 10,
        color: Colors.textPrimary,
    },
});

export default SearchBar;
