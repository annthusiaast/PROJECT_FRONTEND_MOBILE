// API Configuration with environment-aware BASE_URL resolution
// - In dev: attempts to auto-detect your machine's IP from the JS bundle URL
// - In emulator/simulator: falls back to 10.0.2.2 (Android) or localhost (iOS)
// - In prod or custom envs: supports override via Expo extra config (app.json -> expo.extra.API_BASE_URL)

import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';

function resolveFromExpoExtra() {
  // Try multiple locations for compatibility across Expo SDKs
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
  return extra.API_BASE_URL || extra.apiBaseUrl || extra.api_base_url || null;
}

function resolveFromScriptURL() {
  // RN provides the packager/bundle host via SourceCode.scriptURL in dev
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (!scriptURL) return null;
    const url = new URL(scriptURL);
    const host = url.hostname; // e.g., 192.168.1.5, localhost, 10.0.2.2
    if (!host) return null;
    // If host is localhost on a physical device, fallback to hostUri
    if ((host === 'localhost' || host === '127.0.0.1') && Platform.OS === 'android') {
      return null;
    }
    return `http://${host}:3000/api`;
  } catch {
    return null;
  }
}

function resolveFromHostUri() {
  try {
    const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.hostUri || Constants?.manifest?.debuggerHost;
    if (!hostUri) return null;
    // hostUri examples: "192.168.1.5:19000", "192.168.1.5:8081"
    const host = hostUri.split(':')[0];
    if (!host) return null;
    return `http://${host}:3000/api`;
  } catch {
    return null;
  }
}

function resolveDevFallback() {
  if (Platform.OS === 'android') {
    // Android emulator maps host loopback to 10.0.2.2
    return 'http://10.0.2.2:3000/api';
  }
  // iOS simulator can use localhost
  return 'http://localhost:3000/api';
}

function resolveBaseUrl() {
  // Highest priority: explicit override from Expo extra
  const fromExtra = resolveFromExpoExtra();
  if (fromExtra) return fromExtra;

  if (__DEV__) {
    // Try to infer host from bundle URL (works for physical devices over LAN and simulators)
    const fromScript = resolveFromScriptURL();
    if (fromScript) return fromScript;
    // Fallback to Expo hostUri (reliable in Expo Go on device)
    const fromHostUri = resolveFromHostUri();
    if (fromHostUri) return fromHostUri;
    // Fall back to platform defaults
    return resolveDevFallback();
  }

  // Production fallback: if not provided via extra, keep previous default or set to your prod API
  // Tip: set expo.extra.API_BASE_URL in app.json for production/staging builds.
  return 'http://192.168.1.10:3000/api';
}

const BASE_URL = resolveBaseUrl();

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 10000, // 10 seconds timeout
};

// Helper function to get the full endpoint URL
export const getEndpoint = (path) => `${API_CONFIG.BASE_URL}${path}`;

export default API_CONFIG;
