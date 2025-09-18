import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AIAssistant } from '@/components/AIAssistant';

export default function AIAssistantScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AIAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});