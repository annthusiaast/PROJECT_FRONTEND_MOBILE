import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { initialProfile } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/profile_styles";

// profile image
import myProfilePic from "@/assets/images/Joseph_prof.png";

function Profile() {
  const router = useRouter();

  // State for user info
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Only allow editing of contact info, not name or role
  const [editData, setEditData] = useState({
    email: initialProfile.email,
    phone: initialProfile.phone,
    address: initialProfile.address,
    department: initialProfile.department,
  });

  const handleSave = () => {
    // Merge updated contact info back into profile, keep name & role untouched
    const updatedProfile = { 
      ...profile, 
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
      department: editData.department
    };
    setProfile(updatedProfile);
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile changes have been saved.");
  };

  const handleCancel = () => {
    // Reset edit data to current profile info
    setEditData({
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      department: profile.department
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Date & Notification */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>Friday, March 21</Text>
          <Text style={styles.profileContainer}>Profile</Text>
        </View>
        <Feather
          name="bell"
          size={24}
          color="#0B3D91"
          onPress={handleNotificationSettings}
        />
      </View>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        {/* Profile Picture */}
        <Image source={myProfilePic} style={styles.avatar} />

        {/* Name (Locked) */}
        <Text style={styles.name}>{profile.name}</Text>

        {/* Role (Locked) */}
        <Text style={styles.role}>{profile.role}</Text>

        {!isEditing ? (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Feather name="edit-2" size={14} color="#0B3D91" />
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

      {/* Contact Information (Editable) */}
      <View style={styles.infoCard}>
        {/* Email */}
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#0B3D91" />
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
          <Feather name="phone" size={20} color="#0B3D91" />
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
          <Feather name="map-pin" size={20} color="#0B3D91" />
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
          <FontAwesome5 name="building" size={18} color="#0B3D91" />
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
            <Feather name="settings" size={20} color="#0B3D91" />
            <Text style={styles.settingsText}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem} onPress={handleNotificationSettings}>
            <Feather name="bell" size={20} color="#0B3D91" />
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
  );
}

export default Profile;
