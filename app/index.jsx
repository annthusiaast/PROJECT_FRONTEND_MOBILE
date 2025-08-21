import { useEffect, useRef } from "react";
import { Image, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";
import { styles } from "@/constants/styles/index_styles";
import { useAuth } from "@/context/auth-context";

const SplashScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width, height } = Dimensions.get("window");
  const { isAuthenticated, isPendingVerification, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait for auth rehydration

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (isPendingVerification) {
          router.replace("/auth/verification");
        } else if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/auth/login");
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router, loading, isAuthenticated, isPendingVerification]);

  return (
    <Animated.View style={[styles.animatedView, { opacity: fadeAnim, flex: 1}]}>
      <Image source={images.logo} resizeMode="contain" style={styles.image} />
    </Animated.View>
  );
};

export default SplashScreen;
