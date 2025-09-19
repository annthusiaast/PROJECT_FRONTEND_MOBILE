import { Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "@/context/auth-context";
import API_CONFIG from "@/constants/api-config";

export default function RootLayout() {
  // Quick debug: log resolved API base URL on app startup (dev only)
  useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[API_CONFIG] BASE_URL:", API_CONFIG.BASE_URL);
    }
  }, []);

  return (
    <AuthProvider>
      <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/verification" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-pass" options={{ headerShown: false }} />
        <Stack.Screen name="auth/changepass" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(lawyer)" options={{ headerShown: false }} />
        <Stack.Screen name="(paralegal)" options={{ headerShown: false }} />
        <Stack.Screen name="(staff)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="userlogs" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>

  )
}