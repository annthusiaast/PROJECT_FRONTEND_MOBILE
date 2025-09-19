import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';
import images from '@/constants/images';
import { useAuth } from '@/context/auth-context';
import { roleToGroup } from '@/constants/role-tabs';

const Verify = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const inputs = useRef([]);
  const { verifyOTP, resendOTP, isPendingVerification, user } = useAuth();

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = [...code];

      if (code[index] === '') {
        if (index > 0) inputs.current[index - 1]?.focus();
      } else {
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  //Submit OTP
  const handleVerify = async () => {
    const otpCode = code.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyOTP(otpCode);
      const group = roleToGroup(result?.user?.user_role || user?.user_role);
      // Navigate immediately to the correct role group home
      if (group) {
        router.replace(`/${`(${group})`}/home`);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      await resendOTP();
      Alert.alert('Success', 'A new code has been sent to your email');
      // Clear current code inputs
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.forgotContainer}>
          
          {/* Logo */}
          <Image
            source={images.legalVaultLogo}
            style={[styles.logo, { alignSelf: 'center', marginBottom: 20 }]}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2756afff', marginBottom: 10, textAlign: 'center' }}>
            Two-Factor Authentication
          </Text>

          {/* Subtitle */}
          <Text style={{ fontSize: 14, color: '#2756afff', marginBottom: 25, textAlign: 'center' }}>
            Enter the 6-digit code sent to your email
          </Text>

          {/* Code Inputs */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                style={{
                  backgroundColor: '#fff',
                  width: 45,
                  height: 50,
                  textAlign: 'center',
                  fontSize: 20,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  borderWidth: 1,
                  borderColor: '#2756afff',
                }}
              />
            ))}
          </View>

          {/* Resend Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
            <Text style={{ color: '#2756afff' }}>Didn't receive a code? </Text>
            <TouchableOpacity 
              onPress={handleResendOTP}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color="#0582ff" />
              ) : (
                <Text style={{ color: '#0582ff', textDecorationLine: 'underline' }}>Resend</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            onPress={handleVerify} 
            style={{ alignSelf: 'center', width: '90%' }}
            disabled={loading}
          >
            <LinearGradient colors={['#173B7E', '#1A4C9D']} style={styles.loginButtonGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Verify</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Verify;
