import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteProvider } from '@/context/FavoriteContext';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <FavoriteProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </FavoriteProvider>
        </QueryClientProvider>
    );
}
