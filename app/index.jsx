import { useEffect, useRef } from "react";
import { Image, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";
import { styles } from "@/constants/styles/index_styles";

const SplashScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/auth/Login");
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <Animated.View style={[styles.animatedView, { opacity: fadeAnim, flex: 1}]}>
      <Image source={images.logo} resizeMode="contain" style={styles.image} />
    </Animated.View>
  );
};

export default SplashScreen;
