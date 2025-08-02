import { Bell, Phone, MapPin, Edit2, Settings, Building, Mail } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initialProfile, today } from "@/constants/sample_data";
import images from "@/constants/images";
import { styles } from "@/constants/styles/(tabs)/profile_styles";

function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    email: initialProfile.email,
    phone: initialProfile.phone,
    address: initialProfile.address,
    department: initialProfile.department,
  });

  const handleSave = () => {
    setProfile({
      ...profile,
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
      department: editData.department,
    });
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

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("authToken");
    router.replace("/auth/Login");
  };

  const handleAccountSettings = () => {
    router.push("/account-settings");
  };

  const handleNotificationSettings = () => {
    router.push("/notifications");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}>

        {/* Header Date */}
        <Text style={[styles.headerDate, { paddingLeft: 2 }]}>{today}</Text>

        {/* Header Row */}
        <View style={styles.headerWrapper}>
          <Text
            style={[
              styles.headerContainer,
              { fontFamily: Platform.OS === "ios" ? "System" : "sans-serif" }
            ]}
          >
            Profile
          </Text>
          <TouchableOpacity
            onPress={handleNotificationSettings}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
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
              <TextInput
                style={styles.inputInline}
                value={editData.email}
                onChangeText={(text) => setEditData({ ...editData, email: text })}
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            )}
          </View>

          {/* Phone */}
          <View style={styles.infoRow}>
            <Phone size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput
                style={styles.inputInline}
                value={editData.phone}
                onChangeText={(text) => setEditData({ ...editData, phone: text })}
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            )}
          </View>

          {/* Address */}
          <View style={styles.infoRow}>
            <MapPin size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput
                style={styles.inputInline}
                value={editData.address}
                onChangeText={(text) => setEditData({ ...editData, address: text })}
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{profile.address}</Text>
              </View>
            )}
          </View>

          {/* Department */}
          <View style={styles.infoRow}>
            <Building size={18} color="#0B3D91" />
            {isEditing ? (
              <TextInput
                style={styles.inputInline}
                value={editData.department}
                onChangeText={(text) => setEditData({ ...editData, department: text })}
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{profile.department}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Account Settings */}
        {!isEditing && (
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem} onPress={handleAccountSettings}>
              <Settings size={20} color="#0B3D91" />
              <Text style={styles.settingsText}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem} onPress={handleNotificationSettings}>
              <Bell size={20} color="#0B3D91" />
              <Text style={styles.settingsText}>Notification Preference</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign Out */}
        {!isEditing && (
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;
