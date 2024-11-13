import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type Line = {
    lineNumber: string;
    lineName: string;
    mainPath: string;
    lineRouteId: string;
};

type Agency = {
    agency_id: number;
    agency_name: string;
    agency_color: string;
    agency_type: 'bus' | 'subte';
    routes: Line[];
};

// Función para agrupar rutas por mainPath
const groupRoutesByMainPath = (
    routes: { route_short_name: string; route_desc?: string }[],
) => {
    const grouped: Record<string, Record<string, Line>> = {};
    routes.forEach((route) => {
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
                    lineRouteId: route.route_id,
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

// Función para obtener la lista inicial de favoritos
const fetchFavorites = async (userId: string): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/api/user/${userId}/favorites`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    const { favorites } = await response.json();
    return favorites;
};

// Función para actualizar el estado de favorito de una línea
const updateFavorite = async (
    lineRouteId: string,
    isFavorite: boolean,
    userId: string,
): Promise<void> => {
    const method = isFavorite ? 'DELETE' : 'POST';
    const response = await fetch(`${BASE_URL}/api/user/${userId}/favorite`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineRouteId }), // Cambiar a lineRouteId
    });

    if (!response.ok) throw new Error('Failed to update favorite status');
};

// Función para obtener agencias
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

// Función para obtener la posición en tiempo real de un vehículo
export const fetchRealTimePosition = async (
    routeId: string,
): Promise<Agency[]> => {
    const response = await fetch(
        `${BASE_URL}/api/bus-route/${routeId}/position`,
    );
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    return data;
};

// Función para obtener las rutas de un parada
const fetchRoutesForStop = async (stopId: string): Promise<Agency[]> => {
    const response = await fetch(`${BASE_URL}/api/bus-stops/${stopId}/buses`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    // console.log('data', data);
    if (!Array.isArray(data) || data.length === 0)
        throw new Error('Invalid or empty API response.');
    return data;
};

const useAPI = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await SecureStore.getItemAsync('deviceFingerprint');
            setUserId(id);
        };
        fetchUserId();
    }, []);

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
            queryFn: () => fetchFavorites(userId as string),
            enabled: !!userId, // Solo ejecuta la consulta si userId está disponible
        });

    // Modificación en toggleFavoriteStatus para usar userId directamente desde el estado
    const toggleFavoriteStatus = async (
        lineNumber: string,
        isFavorite: boolean,
    ) => {
        if (!userId) return;
        return updateFavorite(lineNumber, isFavorite, userId);
    };

    // Hook para obtener favoritos
    const useFetchRoutesForStop = (
        stopId: string,
    ): UseQueryResult<string[], Error> =>
        useQuery({
            queryKey: ['routeIdForStop', stopId],
            queryFn: () => fetchRoutesForStop(stopId as string),
            enabled: !!stopId, // Solo ejecuta la consulta si userId está disponible
        });

    return {
        useFetchAgencies,
        useFetchFavorites,
        toggleFavoriteStatus,
        useFetchRoutesForStop,
    };
};

export default useAPI;
