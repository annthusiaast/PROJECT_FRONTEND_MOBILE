import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/unauthorized" options={{ headerShown: false }} />
      <Stack.Screen name="auth/verification" options={{ headerShown: false }} />
      <Stack.Screen name="auth/forgot-pass" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" />

    </Stack>

  )
}