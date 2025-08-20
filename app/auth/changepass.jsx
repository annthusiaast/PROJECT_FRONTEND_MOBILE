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

//
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import { styles } from '@/constants/styles/auth_styles';

const ChangePass = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in both fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Add your password change logic here
    alert('Password changed successfully!');
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
                Change Password
              </Text>

              {/* New Password Field */}
              <View style={[styles.inputContainer, { marginLeft: 18 }]}>
                <TextInput
                  style={styles.TextInputWithIcon}
                  autoCapitalize="none"
                  value={newPassword}
                  placeholder="New Password"
                  placeholderTextColor="#9A8478"
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              {/* Confirm Password Field */}
              <View style={[styles.inputContainer, { marginLeft: 18, marginTop: 15 }]}>
                <TextInput
                  style={styles.TextInputWithIcon}
                  autoCapitalize="none"
                  value={confirmPassword}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#9A8478"
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Buttons */}
            <View>
              {/* Change Password Button */}
              <TouchableOpacity 
                onPress={handleChangePassword} 
                style={styles.sendEmailButton}
              >
                <LinearGradient
                  colors={['#173B7E', '#1A4C9D']}
                  style={styles.sendEmailButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Change Password</Text>
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

export default ChangePass;