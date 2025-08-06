import { Bell, Phone, MapPin, Edit2, Settings, Building, Mail } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { today, initialProfile } from "@/constants/sample_data";
import images from "@/constants/images";
import { styles } from "@/constants/styles/(tabs)/profile_styles";

function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const [editData, setEditData] = useState({
    email: initialProfile.email,
    phone: initialProfile.phone,
    address: initialProfile.address,
    department: initialProfile.department,
  });

  // Load profile data from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      const stored = await AsyncStorage.getItem("userProfile");
      if (stored) setProfile(JSON.parse(stored));
    };
    loadProfile();
  }, []);

  const saveProfileToStorage = async (updatedProfile) => {
    await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const validateInputs = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(editData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(editData.phone)) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    const updated = { ...profile, ...editData };
    setProfile(updated);
    await saveProfileToStorage(updated);
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile changes have been saved.");
  };

  const handleCancel = () => {
    setEditData({
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      department: profile.department,
    });
    setIsEditing(false);
  };

  const confirmSignOut = async () => {
    setShowSignOutModal(false);
    await AsyncStorage.removeItem("authToken");
    router.replace("/auth/Login");
  };

  const handleAccountSettings = () => router.push("/account-settings");
  const handleNotificationSettings = () => router.push("/notifications");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}>

        {/* Header Date */}
        <Text style={[styles.headerDate, { paddingLeft: 2 }]}>{today}</Text>

        {/* Header */}
        <View style={styles.headerWrapper}>
          <Text style={[styles.headerContainer, { fontFamily: Platform.OS === "ios" ? "System" : "sans-serif" }]}>
            Profile
          </Text>
            <TouchableOpacity onPress={() => alert("Notifications Clicked!")} style={{ marginTop: 15 }}>
            <Bell size={26} color="#0B3D91" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={images.JosephPic} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.role}</Text>

          {!isEditing ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Edit2 size={14} color="#0B3D91" />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#0B3D91" }]} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#ccc" }]} onPress={handleCancel}>
                <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          {/* Email */}
          <View style={styles.infoRow}>
            <Mail size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput style={styles.inputInline} value={editData.email} onChangeText={(text) => setEditData({ ...editData, email: text })} />
            ) : (
              <View><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{profile.email}</Text></View>
            )}
          </View>

          {/* Phone */}
          <View style={styles.infoRow}>
            <Phone size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput style={styles.inputInline} value={editData.phone} onChangeText={(text) => setEditData({ ...editData, phone: text })} keyboardType="phone-pad" />
            ) : (
              <View><Text style={styles.infoLabel}>Phone</Text><Text style={styles.infoValue}>{profile.phone}</Text></View>
            )}
          </View>

          {/* Address */}
          <View style={styles.infoRow}>
            <MapPin size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput style={styles.inputInline} value={editData.address} onChangeText={(text) => setEditData({ ...editData, address: text })} />
            ) : (
              <View><Text style={styles.infoLabel}>Address</Text><Text style={styles.infoValue}>{profile.address}</Text></View>
            )}
          </View>

          {/* Department */}
          <View style={styles.infoRow}>
            <Building size={18} color="#0B3D91" />
            {isEditing ? (
              <TextInput style={styles.inputInline} value={editData.department} onChangeText={(text) => setEditData({ ...editData, department: text })} />
            ) : (
              <View><Text style={styles.infoLabel}>Department</Text><Text style={styles.infoValue}>{profile.department}</Text></View>
            )}
          </View>
        </View>

        {/* Account Settings */}
        {!isEditing && (
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem} onPress={handleAccountSettings}>
              <Settings size={20} color="#0B3D91" />
              <Text style={styles.settingsText}>Activity Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem} onPress={handleNotificationSettings}>
              <Bell size={20} color="#0B3D91" />
              <Text style={styles.settingsText}>Notification Preference</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign Out Button */}
        {!isEditing && (
          <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowSignOutModal(true)}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <Modal transparent visible={showSignOutModal} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 280 }}>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>Are you sure you want to sign out?</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => setShowSignOutModal(false)} style={{ padding: 10 }}>
                <Text style={{ color: "#555", fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSignOut} style={{ padding: 10 }}>
                <Text style={{ color: "#E53935", fontWeight: "bold" }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default Profile;
