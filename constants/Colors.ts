const Colors = {
    primary: '#9b45e4', // Ajustado
    background: '#121212',
    textPrimary: '#ffffff',
    textSecondary: '#e0e0e0',
    buttonPrimary: '#9b45e4', // Ajustado
    buttonTextPrimary: '#ffffff',
    buttonSecondary: '#3b3b3b', // Ajustado
    buttonTextSecondary: '#e0e0e0', // Ajustado
    border: '#4a4a4a', // Ajustado
    inactive: '#808080', // Ajustado
    iconActive: '#9b45e4', // Ajustado
    iconInactive: '#808080', // Ajustado
    iconWithActiveBackground: '#ffffff',
    success: '#4caf50',
    warning: '#FFA726',
    error: '#f44336',
    info: '#2196f3',
    cardBackground: '#2a2a2a', // Ajustado
    inputBackground: '#3b3b3b', // Ajustado
    inputText: '#ffffff',
    placeholder: '#bdbdbd',
    shadow: 'rgba(0, 0, 0, 0.5)',
    hover: '#6200ea', // Ajustado
    link: '#82b1ff',
    white: '#ffffff',
    danger: '#FF4D4D',

    // Social Media Colors
    google: '#db4437',
    facebook: '#4267B2',
    twitter: '#1DA1F2',
    instagram: '#C13584',
    linkedin: '#0077B5',
    pinterest: '#E60023',
};

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#2b2b2b' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#9a9a9a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#2b2b2b' }] },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ color: '#4e4e4e' }],
    },
    {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#b3b3b3' }],
    },
    {
        featureType: 'administrative.land_parcel',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#a5a5a5' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#333333' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b6b6b' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#2b2b2b' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#3d3d3d' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#a1a1a1' }],
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#4a4a4a' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#5b5b5b' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#cfcfcf' }],
    },
    {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#a3a3a3' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#1e1e1e' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#5a5a5a' }],
    },
];

export { Colors, darkMapStyle };
