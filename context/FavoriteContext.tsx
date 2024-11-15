import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
} from 'react';
import { Text } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import useAPI from '@/hooks/useApi';

type FavoriteContextType = {
    favoriteRoutes: string[]; // Ahora es un array solo de `lineRouteId`
    toggleFavorite: (lineRouteId: string) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
    undefined,
);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteRoutes, setFavoriteRoutes] = useState<string[]>([]);
    const { useFetchFavorites, toggleFavoriteStatus } = useAPI();
    const queryClient = useQueryClient();

    const { data: fetchedFavorites, isLoading, error } = useFetchFavorites();

    // Cargar favoritos desde la API en el estado local cuando estén disponibles
    useEffect(() => {
        if (fetchedFavorites) {
            setFavoriteRoutes(
                fetchedFavorites.map((fav) => fav.lineRouteId || fav.route_id),
            );
        }
    }, [fetchedFavorites]);

    // Función para alternar el estado de favorito
    const toggleFavorite = useCallback(
        async (lineRouteId: string) => {
            const isCurrentlyFavorite = favoriteRoutes.includes(lineRouteId);
            const updatedFavorites = isCurrentlyFavorite
                ? favoriteRoutes.filter((fav) => fav !== lineRouteId)
                : [...favoriteRoutes, lineRouteId];

            // Actualiza el estado local de inmediato para reflejar el cambio en la UI
            setFavoriteRoutes(updatedFavorites);

            try {
                // Realiza la actualización en el servidor
                await toggleFavoriteStatus(lineRouteId, isCurrentlyFavorite);

                // Invalida y actualiza la consulta de favoritos para sincronizar con el servidor
                queryClient.invalidateQueries(['favorites']);
            } catch (error) {
                console.error('Error updating favorite status:', error);

                // Revertir el cambio local si hay un error en el servidor
                setFavoriteRoutes(favoriteRoutes);
            }
        },
        [favoriteRoutes, toggleFavoriteStatus, queryClient],
    );

    if (isLoading) return <Text>Loading favorites...</Text>;
    if (error) console.error('Error fetching favorites:', error);

    return (
        <FavoriteContext.Provider value={{ favoriteRoutes, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoriteProvider');
    }
    return context;
};
