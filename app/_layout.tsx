import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteProvider } from '@/context/FavoriteContext';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getPersistentFingerprint } from '@/utils/getFingerprint';

const queryClient = new QueryClient();

export default function RootLayout() {
    useEffect(() => {
        const initializeUserId = async () => {
            const userId = await SecureStore.getItemAsync('deviceFingerprint');
            if (!userId) {
                await getPersistentFingerprint();
            }
        };
        initializeUserId();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <FavoriteProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </FavoriteProvider>
        </QueryClientProvider>
    );
}
