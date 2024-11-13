import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import TabBarButton from './TabBarButton';
import { Colors } from '@constants/Colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type Dimensions = {
    height: number;
    width: number;
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [dimensions, setDimensions] = useState<Dimensions>({
        height: 20,
        width: 100,
    });

    const buttonWidth = dimensions.width / state.routes.length;

    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tabPositionX.value }],
    }));

    return (
        <View onLayout={onTabbarLayout} style={styles.tabbar}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        backgroundColor: Colors.buttonPrimary,
                        borderRadius: 30,
                        marginHorizontal: 12,
                        height: dimensions.height - 15,
                        width: buttonWidth - 25,
                    },
                ]}
            />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    tabPositionX.value = withSpring(buttonWidth * index, {
                        duration: 1500,
                    });
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarButton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name}
                        color={
                            isFocused
                                ? Colors.iconWithActiveBackground
                                : Colors.iconInactive
                        }
                        label={label as string}
                        textColor={
                            isFocused
                                ? Colors.buttonTextPrimary
                                : Colors.textSecondary
                        }
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        marginHorizontal: 100,
        paddingVertical: 8,
        borderRadius: 35,
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 10,
        shadowOpacity: 0.5,
    },
});
