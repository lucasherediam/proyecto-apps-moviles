import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@components/navigation/TabBar';

export default function TabsLayout() {
    return (
        <Tabs tabBar={(props) => <TabBar {...props} />}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="lines"
                options={{
                    title: 'Lineas',
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
