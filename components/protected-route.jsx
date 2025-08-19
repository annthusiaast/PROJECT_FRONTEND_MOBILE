import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { View, ActivityIndicator } from 'react-native';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isPendingVerification } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isPendingVerification) {
        router.replace('/auth/verification');
      } else if (!isAuthenticated) {
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, loading, isPendingVerification]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#173B7E" />
      </View>
    );
  }

  if (!isAuthenticated && !isPendingVerification) {
    return null; // Will redirect to login
  }

  if (isPendingVerification) {
    return null; // Will redirect to verification
  }

  return children;
};

export default ProtectedRoute;