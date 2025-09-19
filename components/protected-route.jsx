import { useEffect, useRef, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { View, ActivityIndicator } from 'react-native';

/**
 * ProtectedRoute (allowedTabs variant)
 * Props:
 *  - allowedTabs: string[] (e.g. ['home','tasks','profile']) representing the *top-level tab route names*
 *  - children: ReactNode to render if authorized
 * Behavior:
 *  - Waits for auth state (loading) to settle
 *  - Redirects unauthenticated users to /auth/login
 *  - Redirects pending 2FA users to /auth/verification
 *  - If current tab (derived from segments) is not in allowedTabs, silently router.replace to first allowed
 *  - Prevents flicker by not rendering children until final state is known
 *  - Graceful fallback: if allowedTabs is empty or undefined, permits rendering after auth (assumes external control)
 */
const ProtectedRoute = ({ allowedTabs, allowedGroups, children }) => {
  const { isAuthenticated, loading, isPendingVerification } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const redirectingRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Derive current logical tab (exclude group markers like (tabs))
  const currentTab = (() => {
    const flat = segments.filter(seg => !seg.startsWith('(') && seg.length > 0);
    if (flat.length === 0) return 'home';
    return flat[flat.length - 1];
  })();

  // Derive current route group: the first segment that looks like (group)
  const currentGroup = (() => {
    const grp = segments.find(seg => seg.startsWith('('));
    if (!grp) return null;
    // strip parentheses, e.g., '(lawyer)' -> 'lawyer'
    return grp.slice(1, -1);
  })();

  const tabsArray = Array.isArray(allowedTabs) ? allowedTabs : [];
  const hasTabConstraint = tabsArray.length > 0; // if none passed, skip tab enforcement
  const tabAllowed = !hasTabConstraint || tabsArray.includes(currentTab);

  useEffect(() => {
    if (loading) return; // wait until auth known

    // Auth gate
    if (isPendingVerification) {
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        router.replace('/auth/verification');
      }
      return;
    }

    if (!isAuthenticated) {
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        router.replace('/auth/login');
      }
      return;
    }

    // Authorized user; enforce group constraint first (if provided)
    const groupsArray = Array.isArray(allowedGroups) ? allowedGroups : [];
    const hasGroupConstraint = groupsArray.length > 0;
    const groupAllowed = !hasGroupConstraint || (currentGroup && groupsArray.includes(currentGroup));

    if (isAuthenticated && hasGroupConstraint && !groupAllowed) {
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        const targetGroup = groupsArray[0];
        router.replace(`/${`(${targetGroup})`}/home`);
      }
      return;
    }

    // Enforce tab constraint (if provided)
    if (isAuthenticated && hasTabConstraint && !tabAllowed) {
      if (!redirectingRef.current) {
        redirectingRef.current = true;
        const target = tabsArray[0];
        // If we know the current group, stay within it; otherwise fallback to (tabs)
        if (currentGroup) {
          router.replace(`/${`(${currentGroup})`}/${target}`);
        } else {
          router.replace(`/(tabs)/${target}`);
        }
      }
      return;
    }

    // All checks passed; allow render
    redirectingRef.current = false;
    setReady(true);
  }, [loading, isPendingVerification, isAuthenticated, hasTabConstraint, tabAllowed, tabsArray, currentTab, allowedGroups, router, currentGroup]);

  // Show spinner while loading auth or while deciding redirect / applying redirect
  if (loading || !ready || redirectingRef.current) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#173B7E" />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;