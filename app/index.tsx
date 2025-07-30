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
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/auth/Login");
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

 return (
  <Animated.View
    style={[styles.animatedView, { opacity: fadeAnim }]}
    className="flex-1 bg-white"
  >
    <Image
      source={images.logo}
      resizeMode="contain"
      style={styles.image}
    />
  </Animated.View>


);
}

export default SplashScreen;