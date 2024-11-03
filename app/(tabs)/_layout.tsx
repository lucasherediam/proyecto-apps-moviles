import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="home" size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="lines"
                options={{
                    tabBarLabel: 'Lines',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons
                            name="map-marker-distance"
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
