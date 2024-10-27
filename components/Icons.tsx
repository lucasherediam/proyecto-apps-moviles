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

export const SubwayStationIcon = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <SubwayIcon />
            </View>
            <View style={styles.stick} />
        </View>
    );
};

export const SubwayIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="18px"
        height="18px"
        viewBox="0 0 64 64"
        {...props}
    >
        <Path
            d="M32 2C19.192 2 9 12.192 9 25v21c0 4.57 2.336 8.602 5.846 11.032L11 61h2.414l3.25-3h30.672l3.25 3H53l-3.846-3.968C52.664 54.602 55 50.57 55 46V25C55 12.192 44.808 2 32 2zm0 2c10.493 0 19 8.507 19 19v21c0 4.178-2.5 7.823-6.25 9.732H19.25C15.5 51.823 13 48.178 13 44V25c0-10.493 8.507-19 19-19zm-8 9a2 2 0 100 4h16a2 2 0 100-4H24zm-4 12v14h24V25H20zm5 17a3 3 0 110 6 3 3 0 010-6zm14 0a3 3 0 110 6 3 3 0 010-6z"
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
