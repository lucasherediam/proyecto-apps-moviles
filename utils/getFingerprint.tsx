import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export async function getPersistentFingerprint() {
    try {
        // Intentar obtener el fingerprint almacenado en SecureStore
        const storedFingerprint =
            await SecureStore.getItemAsync('deviceFingerprint');

        // Si ya existe, lo retornamos
        if (storedFingerprint) {
            return storedFingerprint;
        }

        // Si no existe, generamos un nuevo UUID único
        const newFingerprint = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            Math.random().toString(),
        );

        // Guardar el nuevo fingerprint en SecureStore
        await SecureStore.setItemAsync('deviceFingerprint', newFingerprint);

        return newFingerprint;
    } catch (error) {
        console.error('Error generating or retrieving the fingerprint:', error);
        throw new Error('Failed to generate or retrieve device fingerprint');
    }
}
