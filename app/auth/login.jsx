import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform, 
  KeyboardAvoidingView, 
} from 'react-native';

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

  // Error messages
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const validateFields = () => {
    let valid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      await login(email, password);

      router.push('/auth/verification');
    } catch (error) {
      if (error.message?.toLowerCase().includes('user') || error.message?.toLowerCase().includes('email')) {
        setEmailError('Username/Email is incorrect');
      } else if (error.message?.toLowerCase().includes('password')) {
        setPasswordError('Password is incorrect');
      } else {
        setPasswordError('Something went wrong. Please try again.');
      }
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
              keyboardType="email-address"
              value={email}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
            />
          </View>
          {emailError ? <Text style={{ color: 'red', marginLeft: 5 }}>{emailError}</Text> : null}

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#9A8478" style={styles.leftIcon} />
            <TextInput
              style={styles.TextInputWithIcon}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry={!showPassword}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? (
                <EyeOff size={20} color="#9A8478" />
              ) : (
                <Eye size={20} color="#9A8478" />
              )}
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={{ color: 'red', marginLeft: 5 }}>{passwordError}</Text> : null}

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
