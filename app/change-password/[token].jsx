import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert 
} from 'react-native';

import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';
import { getEndpoint } from '@/constants/api-config';

const ChangePasswordFromDeepLink = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token;

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Invalid Link',
        'This password reset link is invalid or has expired. Please request a new one.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/forgot-pass'),
          },
        ]
      );
    }
  }, [token]);

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleChangePassword = async () => {
    // Reset previous messages
    setMessage('');
    setError('');

    // Validate inputs
    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (!confirmPassword.trim()) {
      setError('Please confirm your password');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getEndpoint('/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          newPassword: newPassword.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
        
        // Show success alert and navigate to login
        Alert.alert(
          'Success',
          'Your password has been changed successfully. Please log in with your new password.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login'),
            },
          ]
        );
      } else {
        if (response.status === 401 || response.status === 403) {
          setError('This reset link has expired. Please request a new password reset.');
        } else {
          setError(data.error || 'Failed to change password');
        }
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.forgotContainer}>
            {/* Logo */}
            <Image
              source={images.legalVaultLogo}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Form */}
            <View style={[styles.formContainer, { alignItems: "flex-start" }]}>
              <Text style={{ paddingBottom: 30, fontSize: 16, fontWeight: 'bold' }}>
                Reset Password
              </Text>

              {/* Success Message */}
              {message ? (
                <View style={{ 
                  backgroundColor: '#d4edda', 
                  borderColor: '#c3e6cb', 
                  borderWidth: 1, 
                  borderRadius: 8, 
                  padding: 12, 
                  marginBottom: 15,
                  width: '100%'
                }}>
                  <Text style={{ color: '#155724', fontSize: 14 }}>
                    {message}
                  </Text>
                </View>
              ) : null}

              {/* Error Message */}
              {error ? (
                <View style={{ 
                  backgroundColor: '#f8d7da', 
                  borderColor: '#f5c6cb', 
                  borderWidth: 1, 
                  borderRadius: 8, 
                  padding: 12, 
                  marginBottom: 15,
                  width: '100%'
                }}>
                  <Text style={{ color: '#721c24', fontSize: 14 }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Password Requirements */}
              <View style={{ 
                backgroundColor: '#e7f3ff', 
                borderColor: '#b3d9ff', 
                borderWidth: 1, 
                borderRadius: 8, 
                padding: 12, 
                marginBottom: 15,
                width: '100%'
              }}>
                <Text style={{ color: '#0066cc', fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
                  Password Requirements:
                </Text>
                <Text style={{ color: '#0066cc', fontSize: 12 }}>
                  • At least 8 characters long{'\n'}
                  • Contains uppercase and lowercase letters{'\n'}
                  • Contains at least one number
                </Text>
              </View>

              {/* New Password Field */}
              <View style={[styles.inputContainer, { marginLeft: 18 }]}>
                <TextInput
                  style={[
                    styles.TextInputWithIcon,
                    error && newPassword ? { borderColor: '#dc3545', borderWidth: 1 } : {}
                  ]}
                  autoCapitalize="none"
                  value={newPassword}
                  placeholder="New Password"
                  placeholderTextColor="#9A8478"
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setError(''); // Clear error when user starts typing
                    setMessage(''); // Clear message when user starts typing
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 15, top: 15 }}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Text style={{ color: '#173B7E', fontSize: 12 }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Confirm Password Field */}
              <View style={[styles.inputContainer, { marginLeft: 18, marginTop: 15 }]}>
                <TextInput
                  style={[
                    styles.TextInputWithIcon,
                    error && confirmPassword ? { borderColor: '#dc3545', borderWidth: 1 } : {}
                  ]}
                  autoCapitalize="none"
                  value={confirmPassword}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#9A8478"
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError(''); // Clear error when user starts typing
                    setMessage(''); // Clear message when user starts typing
                  }}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 15, top: 15 }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Text style={{ color: '#173B7E', fontSize: 12 }}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View>
              {/* Change Password Button */}
              <TouchableOpacity 
                onPress={handleChangePassword}
                style={[
                  styles.sendEmailButton,
                  loading && { opacity: 0.6 }
                ]}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#173B7E', '#1A4C9D']}
                  style={styles.sendEmailButtonGradient}
                >
                  {loading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={[styles.loginButtonText, { marginLeft: 8 }]}>
                        Changing...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Reset Password</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity 
                onPress={() => router.replace('/auth/login')} 
                style={{ marginTop: 15, alignSelf: 'center' }}
                disabled={loading}
              >
                <Text style={{
                  color: loading ? '#9A8478' : '#173B7E',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textDecorationLine: 'underline',
                }}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordFromDeepLink;
