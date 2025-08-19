import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/verification" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-pass" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" />
      </Stack>
    </AuthProvider>
  )
}