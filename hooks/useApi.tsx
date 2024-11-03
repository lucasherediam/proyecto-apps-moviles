import { useQuery, UseQueryResult } from '@tanstack/react-query';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const userId = '1';

type Line = {
    lineNumber: string;
    lineName: string;
    mainPath: string;
};

type Route = {
    route_short_name: string;
    route_desc?: string;
};

type Agency = {
    agency_id: number;
    agency_name: string;
    agency_color: string;
    agency_type: 'bus' | 'subte';
    routes: Line[];
};

// Funcion para agrupar rutas por mainPath
const groupRoutesByMainPath = (routes: Route[]) => {
    const grouped: Record<string, Record<string, Line>> = {};

    routes.forEach((route) => {
        if (typeof route.route_short_name !== 'string') return;

        const lineNumberMatch = route.route_short_name.match(/^\d+/);
        if (lineNumberMatch) {
            const lineNumber = lineNumberMatch[0];
            const mainPath = route.route_desc?.split(':')[0].trim() || '';

            if (!grouped[lineNumber]) {
                grouped[lineNumber] = {};
            }

            if (!grouped[lineNumber][mainPath]) {
                grouped[lineNumber][mainPath] = {
                    lineNumber,
                    lineName: route.route_short_name,
                    mainPath,
                };
            }
        }
    });
    return Object.keys(grouped).map((lineNumber) => ({
        lineNumber,
        routes: Object.values(grouped[lineNumber]),
    }));
};

// Funcion para obtener la lista inicial de favoritos
const fetchFavorites = async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/api/user/${userId}/favorites`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    const { favorites } = await response.json();
    return favorites;
};

// Funcion para actualizar el estado de favorito de una linea
const updateFavoriteStatus = async (
    lineNumber: string,
    isFavorite: boolean,
): Promise<void> => {
    const method = isFavorite ? 'DELETE' : 'POST';
    const response = await fetch(`${BASE_URL}/api/user/${userId}/favorite`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineNumber }),
    });

    if (!response.ok) throw new Error('Failed to update favorite status');
};

// Funcion para obtener agencias
const fetchAgencies = async (): Promise<Agency[]> => {
    const response = await fetch(`${BASE_URL}/api/bus-agencies/`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0)
        throw new Error('Invalid or empty API response.');

    return data.map((agency: any) => ({
        ...agency,
        routes: groupRoutesByMainPath(agency.routes || []),
    }));
};

const useAPI = () => {
    // Hook para obtener agencias
    const useFetchAgencies = (): UseQueryResult<Agency[], Error> =>
        useQuery({
            queryKey: ['agencies'],
            queryFn: fetchAgencies,
        });

    // Hook para obtener favoritos
    const useFetchFavorites = (): UseQueryResult<string[], Error> =>
        useQuery({
            queryKey: ['favorites', userId],
            queryFn: fetchFavorites,
        });

    return { useFetchAgencies, useFetchFavorites, updateFavoriteStatus };
};

export default useAPI;
