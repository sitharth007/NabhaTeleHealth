import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="health" />
      <Stack.Screen name="medicines" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="patients" />
      <Stack.Screen name="doctors" />
      <Stack.Screen name="stock" />
      <Stack.Screen name="orders" />
    </Stack>
  );
}