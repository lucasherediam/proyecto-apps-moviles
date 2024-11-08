import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
} from 'react';
import { Text } from 'react-native';
import useAPI from '@/hooks/useApi';

type FavoriteContextType = {
    favoriteRoutes: string[]; // Cambiado a favoriteRoutes para reflejar que ahora son ramales
    toggleFavorite: (lineRouteId: string) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
    undefined,
);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteRoutes, setFavoriteRoutes] = useState<string[]>([]); // Cambia el estado a favoriteRoutes
    const { useFetchFavorites, toggleFavoriteStatus } = useAPI(); // Cambia updateFavorite por toggleFavoriteStatus

    const { data: fetchedFavorites, isLoading, error } = useFetchFavorites();

    // Cargar favoritos obtenidos del API en el estado local cuando estén disponibles
    useEffect(() => {
        if (fetchedFavorites) {
            setFavoriteRoutes(fetchedFavorites);
        }
    }, [fetchedFavorites]);

    // Función para alternar el estado de favorito de un ramal individual
    const toggleFavorite = useCallback(
        async (lineRouteId: string) => {
            const isCurrentlyFavorite = favoriteRoutes.includes(lineRouteId);
            const updatedFavorites = isCurrentlyFavorite
                ? favoriteRoutes.filter((fav) => fav !== lineRouteId)
                : [...favoriteRoutes, lineRouteId];

            // Actualizar el estado local de favoritos
            setFavoriteRoutes(updatedFavorites);

            try {
                // Actualizar el estado de favorito en el servidor
                await toggleFavoriteStatus(lineRouteId, isCurrentlyFavorite);
            } catch (error) {
                console.error('Error updating favorite status:', error);

                // Revertir el cambio local en caso de error en el servidor
                setFavoriteRoutes(favoriteRoutes);
            }
        },
        [favoriteRoutes, toggleFavoriteStatus],
    );

    // Mostrar un mensaje de carga o error si ocurre durante la carga de favoritos
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
