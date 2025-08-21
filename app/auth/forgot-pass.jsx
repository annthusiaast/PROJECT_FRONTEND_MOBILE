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

import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';
import { getEndpoint } from '@/constants/api-config';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle forgot password submission
  const handleForgotPassword = async () => {
    // Reset previous messages
    setMessage('');
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getEndpoint('/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          client_type: 'mobile'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link has been sent to your email address');
        setEmail(''); // Clear email field on success
        
        // Show success alert
        Alert.alert(
          'Email Sent',
          'Please check your email for the password reset link.',
          [
            {
              text: 'OK',
              onPress: () => router.back(), // Navigate back to login
            },
          ]
        );
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
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
                Forgot Password
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

              {/* Email Field */}
              <View style={[styles.inputContainer, { marginLeft: 18 }]}>
                <TextInput
                  style={[
                    styles.TextInputWithIcon,
                    error && email ? { borderColor: '#dc3545', borderWidth: 1 } : {}
                  ]}
                  autoCapitalize="none"
                  value={email}
                  placeholder="Enter email"
                  placeholderTextColor="#9A8478"
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(''); // Clear error when user starts typing
                    setMessage(''); // Clear message when user starts typing
                  }}
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Buttons */}
            <View>
              {/* Send Email Button */}
              <TouchableOpacity 
                onPress={handleForgotPassword}
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
                        Sending...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Send Email</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity 
                onPress={() => router.back()} 
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

export default ForgotPass;
