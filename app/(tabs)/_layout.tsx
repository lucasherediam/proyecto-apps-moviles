import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home',
        tabBarIcon: () => (
            <MaterialCommunityIcons name="home" size={24} />
          ),
       }} />
      <Tabs.Screen
        name="stations"
        options={{
          tabBarLabel: 'Stations',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="map-marker-path" size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
