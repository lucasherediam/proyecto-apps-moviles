import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Screen } from '@/components/Screen';
import colors from '@/constants/Colors';

const Stations = () => {
  return (
    <Screen>
      <Text style={{color: colors.textPrimary}}>Stations</Text>
    </Screen>
  );
};

export default Stations;

const styles = StyleSheet.create({});
