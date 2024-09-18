import { View, StyleSheet } from 'react-native';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const BusStopIcon = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <BusIcon />
            </View>
            {/* Agregamos el "palito" debajo del icono */}
            <View style={styles.stick} />
        </View>
    );
};

export const BusIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="18px"
        height="18px"
        viewBox="0 0 88 88"
        {...props}
    >
        <Path
            d="M14.667 58.667c0 3.226 1.43 6.123 3.666 8.14v6.526A3.677 3.677 0 0022 77h3.667a3.677 3.677 0 003.666-3.667v-3.666h29.334v3.666A3.677 3.677 0 0062.333 77H66a3.677 3.677 0 003.667-3.667v-6.526c2.236-2.017 3.666-4.914 3.666-8.14V22C73.333 9.167 60.207 7.333 44 7.333S14.667 9.167 14.667 22v36.667zM27.5 62.333a5.493 5.493 0 01-5.5-5.5c0-3.043 2.457-5.5 5.5-5.5s5.5 2.457 5.5 5.5c0 3.044-2.457 5.5-5.5 5.5zm33 0a5.493 5.493 0 01-5.5-5.5c0-3.043 2.457-5.5 5.5-5.5s5.5 2.457 5.5 5.5c0 3.044-2.457 5.5-5.5 5.5zm5.5-22H22V22h44v18.333z"
            fill="#fff"
        />
    </Svg>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 24,
        height: 24,
        backgroundColor: '#1065c0',
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        // Agregamos una pequeña sombra arriba del palito (debajo del ícono)
    },
    stick: {
        width: 2, // Ajusta el ancho del "palito"
        height: 10, // Ajusta la altura del "palito"
        backgroundColor: 'gray', // Color del palito
        borderRadius: 2, // Le da un borde redondeado al "palito"

        // Sombras para el "palito"
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, // Sombra ligera debajo del ícono
        shadowOpacity: 0.2,
        shadowRadius: 1,

        // Sombra para hacer parecer que está clavado
        elevation: 4, // Mayor elevación para la sombra en Android
        // marginTop: -2, // Mover ligeramente hacia arriba para que parezca unido al icono
    },
});
