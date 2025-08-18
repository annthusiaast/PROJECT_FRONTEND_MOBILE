import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';

const Login = () => {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
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
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
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
              onPress={() => router.push('/auth/unauthorized')}
              style={styles.loginButton}
            >
              <LinearGradient
                colors={['#173B7E', '#1A4C9D']}
                style={styles.loginButtonGradient}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
