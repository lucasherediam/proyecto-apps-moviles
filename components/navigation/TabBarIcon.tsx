import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';

const iconSize = 26;

export interface IconProps {
    color?: string;
}

export const HomeIcon: React.FC<IconProps> = (props) => (
    <MaterialCommunityIcons
        name="home"
        size={iconSize}
        color="white"
        {...props}
    />
);

export const LineIcon: React.FC<IconProps> = (props) => (
    <MaterialCommunityIcons
        name="map-marker-distance"
        size={iconSize}
        color="white"
        {...props}
    />
);

export const TabNavigatorsIcons: Record<string, React.FC<IconProps>> = {
    index: (props) => <HomeIcon {...props} />,
    lines: (props) => <LineIcon {...props} />,
};
