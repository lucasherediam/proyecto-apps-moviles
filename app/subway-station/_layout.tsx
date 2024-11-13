import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Colors } from '@constants/Colors';
export default function WorkoutLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors.background,
                },
                headerTitleStyle: {
                    color: Colors.textPrimary,
                },
            }}
        >
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Estacion',
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <MaterialIcons
                                name="arrow-back-ios-new"
                                size={24}
                                color={Colors.white}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}
