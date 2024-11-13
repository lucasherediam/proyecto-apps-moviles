import React, { useEffect } from 'react';
import { StyleSheet, Pressable, TextStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { TabNavigatorsIcons } from './TabBarIcon';

interface TabBarButtonProps {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    color: string;
    label: string;
    textColor: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    color,
    label,
    textColor,
}) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
    }, [scale, isFocused]);

    const animatedTextStyle = useAnimatedStyle<TextStyle>(() => ({
        opacity: interpolate(scale.value, [0, 1], [1, 0]),
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.2]) }],
        top: interpolate(scale.value, [0, 1], [0, 9]),
    }));

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            <Animated.View style={animatedIconStyle}>
                {TabNavigatorsIcons[routeName]({ color })}
            </Animated.View>
            <Animated.Text
                style={[{ color: textColor, fontSize: 12 }, animatedTextStyle]}
            >
                {label}
            </Animated.Text>
        </Pressable>
    );
};

export default TabBarButton;

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
});
