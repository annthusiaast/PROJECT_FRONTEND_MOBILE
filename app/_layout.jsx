import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/Verification" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" />

    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />       
      <Stack.Screen name="auth/Login" />  
    </Stack>

  )
}
