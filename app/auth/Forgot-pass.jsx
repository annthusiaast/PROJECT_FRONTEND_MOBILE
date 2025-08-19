import { View, Text, Image, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import Checkbox from 'expo-checkbox';

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
  TouchableWithoutFeedback 
} from 'react-native';

import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.forgotContainer}>
        {/* Logo */}
        <Image
          source={images.legalVaultLogo}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Email Input */}
        <View style={[styles.formContainer, { alignItems: "flex-start" }]}>
          <Text style={{ paddingBottom: 30, fontSize: 16, fontWeight: 'bold' }}>Forgot Password</Text>

          {/* Email Field */}
          <View style={[styles.inputContainer, { marginLeft: 18 }]}>
            <TextInput
              style={styles.TextInputWithIcon}
              autoCapitalize="none"
              value={email}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View>
          {/* Send Email Button */}
          <TouchableOpacity onPress={() => alert('Reset Email Sent')} style={styles.sendEmailButton}>
            <LinearGradient
              colors={['#173B7E', '#1A4C9D']}
              style={styles.sendEmailButtonGradient}
            >
              <Text style={styles.loginButtonText}>Send Email</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login Button */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 15, alignSelf: 'center' }}>
            <Text style={{ color: '#173B7E', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline', }}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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

              {/* Email Field */}
              <View style={[styles.inputContainer, { marginLeft: 18 }]}>
                <TextInput
                  style={styles.TextInputWithIcon}
                  autoCapitalize="none"
                  value={email}
                  placeholder="Enter email"
                  placeholderTextColor="#9A8478"
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Buttons */}
            <View>
              {/* Send Email Button */}
              <TouchableOpacity 
                onPress={() => alert('Reset Email Sent')} 
                style={styles.sendEmailButton}
              >
                <LinearGradient
                  colors={['#173B7E', '#1A4C9D']}
                  style={styles.sendEmailButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Send Email</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={{ marginTop: 15, alignSelf: 'center' }}
              >
                <Text style={{
                  color: '#173B7E',
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
