import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';
import { useAuth } from '@/context/auth-context';

const Login = () => {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      Alert.alert('Success', 'OTP sent to your email', [
        { text: 'OK', onPress: () => router.push('/auth/verification') }
      ]);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={images.legalVaultLogo}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Username & Password Input */}
        <View style={styles.formContainer}>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <User size={20} color="#9A8478" style={styles.leftIcon} />
            <TextInput
              style={styles.TextInputWithIcon}
              autoCapitalize="none"
              value={email}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={setEmail}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#9A8478" style={styles.leftIcon} />
            <TextInput
              style={styles.TextInputWithIcon}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? (
                <EyeOff size={20} color="#9A8478" />
              ) : (
                <Eye size={20} color="#9A8478" />
              )}
            </TouchableOpacity>
          </View>

          {/* Remember Me + Forgot Password */}
          <View style={styles.Remember_Forgot_View}>
            <View style={styles.checkbox}>
              <Checkbox
                value={remember}
                onValueChange={setRemember}
                color={remember ? '#173B7E' : undefined}
              />
              <Text style={styles.textRemember}>Remember Me</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/auth/forgot-pass')}>
              <Text style={styles.textForgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          >
            <LinearGradient
              colors={['#173B7E', '#1A4C9D']}
              style={styles.loginButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
