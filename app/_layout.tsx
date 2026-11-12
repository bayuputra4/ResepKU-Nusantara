// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'ResepKu Nusantara' }} />
      {/* Ini untuk halaman detail nanti */}
      <Stack.Screen name="recipe/[id]" options={{ title: 'Detail Resep' }} />
    </Stack>
  );
}