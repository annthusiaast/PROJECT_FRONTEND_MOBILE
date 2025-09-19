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

// Normalize host extraction from a variety of inputs (URLs, host:port, IPv6)
function extractHost(input) {
  try {
    const value = String(input);
    const url = value.includes('://') ? new URL(value) : new URL(`http://${value}`);
    return url.hostname.replace(/^[\[]|[\]]$/g, '');
  } catch {
    // Fallback: naive cleanup
    return String(input)
      .replace(/^[a-z]+:\/\//i, '')
      .replace(/:\d+$/, '')
      .replace(/^[\[]|[\]]$/g, '');
  }
}

function resolveFromScriptURL() {
  // RN provides the packager/bundle host via SourceCode.scriptURL in dev
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (!scriptURL) return null;
    const host = extractHost(scriptURL); // e.g., 192.168.1.5, localhost, 10.0.2.2, ::1
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
    // hostUri examples: "exp://192.168.1.5:19000", "192.168.1.5:8081", "[::1]:19000"
    const host = extractHost(hostUri);
    if (!host) return null;
    return `http://${host}:3000/api`;
  } catch {
    return null;
  }
}

// Some Expo SDKs expose the device link via Constants.linkingUri (e.g., exp://192.168.1.15:8081)
function resolveFromLinkingUri() {
  try {
    const linkingUri = Constants?.linkingUri;
    if (!linkingUri) return null;
    const host = extractHost(linkingUri);
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
    // Additional fallback: Expo linkingUri (often matches Metro's exp://... output)
    const fromLinking = resolveFromLinkingUri();
    if (fromLinking) return fromLinking;
    // Fall back to platform defaults
    return resolveDevFallback();
  }

  // Production fallback: if not provided via extra, keep previous default or set to your prod API
  // Tip: set expo.extra.API_BASE_URL in app.json for production/staging builds.
  // Warn and return a safe default placeholder so crashes don't occur silently.
  // Update this to your real production API or configure via expo.extra.API_BASE_URL.
  // eslint-disable-next-line no-console
  console.warn('[api-config] Missing expo.extra.API_BASE_URL. Configure it in app.json/app.config.* for prod/staging builds.');
  return 'https://your-api.example.com/api';
}

const BASE_URL = resolveBaseUrl();

export const API_CONFIG = {
  // Single source of truth. Update via expo.extra.API_BASE_URL in app.json
  // or let resolveBaseUrl() infer it in development.
  BASE_URL,
  TIMEOUT: 10000, // 10 seconds timeout
};

// Helper function to get the full endpoint URL
export const getEndpoint = (path = '') => {
  const base = String(API_CONFIG.BASE_URL || '').replace(/\/+$/, '');
  const suffix = String(path || '');
  const normalized = suffix.startsWith('/') ? suffix : `/${suffix}`;
  return `${base}${normalized}`;
};

export default API_CONFIG;
