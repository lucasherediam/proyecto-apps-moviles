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
    favoriteLines: string[];
    toggleFavorite: (lineNumber: string) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
    undefined,
);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteLines, setFavoriteLines] = useState<string[]>([]);
    const { useFetchFavorites, updateFavoriteStatus } = useAPI();

    const { data: fetchedFavorites, isLoading, error } = useFetchFavorites();

    useEffect(() => {
        if (fetchedFavorites) {
            setFavoriteLines(fetchedFavorites);
        }
    }, [fetchedFavorites]);

    const toggleFavorite = useCallback(
        async (lineNumber: string) => {
            const isCurrentlyFavorite = favoriteLines.includes(lineNumber);
            const updatedFavorites = isCurrentlyFavorite
                ? favoriteLines.filter((fav) => fav !== lineNumber)
                : [...favoriteLines, lineNumber];

            setFavoriteLines(updatedFavorites);

            try {
                await updateFavoriteStatus(lineNumber, isCurrentlyFavorite);
            } catch (error) {
                console.error('Error updating favorite status:', error);

                // Revertir el cambio local en caso de error
                setFavoriteLines(favoriteLines);
            }
        },
        [favoriteLines, updateFavoriteStatus],
    );

    if (isLoading) return <Text>Loading favorites...</Text>;
    if (error) console.error('Error fetching favorites:', error);

    return (
        <FavoriteContext.Provider value={{ favoriteLines, toggleFavorite }}>
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
