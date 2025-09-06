import {
  Bell, Phone, MapPin, Edit2, Settings, Building, Mail, ArrowLeft,
  Clock, User2Icon, AlertCircle, Lock
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert, Image, ScrollView, Text, TextInput, TouchableOpacity,
  View, Platform, Modal, Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { today, initialProfile } from "@/constants/sample_data";
import images from "@/constants/images";
import { styles } from "@/constants/styles/(tabs)/profile_styles";
import { useAuth } from "@/context/auth-context";
import { API_CONFIG, getEndpoint } from "@/constants/api-config";
import * as ImagePicker from 'expo-image-picker';

function Profile() {
  const router = useRouter();
  const { user, logout, setUser } = useAuth();

  const [profile, setProfile] = useState(user || initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const [editData, setEditData] = useState({
    user_id: initialProfile.user_id,
    user_date_created: initialProfile.dateCreated,
    user_email: initialProfile.email,
    // Leave password blank; only send when user explicitly sets a new one
    user_password: "",
    user_phonenum: initialProfile.phone,
    user_status: initialProfile.status,
    branch_id: initialProfile.branch,
    user_fname: initialProfile.user_fname || "",
    user_mname: initialProfile.user_mname || "",
    user_lname: initialProfile.user_lname || "",
    user_role: initialProfile.user_role || "",
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [prefs, setPrefs] = useState({
    push: true,
    email: false,
    sms: false,
  });

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [newImage, setNewImage] = useState(null); // holds { uri, type, name }

  const [searchText, setSearchText] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchText.toLowerCase()) ||
      log.time.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user) {
          const userProfile = {
            user_id: user.user_id,
            name: `${user.user_fname} ${user.user_mname || ""} ${user.user_lname}`.trim(),
            user_email: user.user_email,
            user_password: user.user_password,
            user_phonenum: user.user_phonenum,
            user_status: user.user_status,
            user_role: user.user_role,
            user_date_created: user.user_date_created,
            branch_id: user.branch_id,
            user_fname: user.user_fname,
            user_mname: user.user_mname || "",
            user_lname: user.user_lname,
            user_role: user.user_role,
          };
          setProfile(userProfile);
          setEditData({
            user_id: userProfile.user_id,
            user_date_created: userProfile.user_date_created,
            user_email: userProfile.user_email,
            // do not preload (likely hashed) password
            user_password: "",
            user_phonenum: userProfile.user_phonenum,
            user_status: userProfile.user_status,
            branch_id: userProfile.branch_id,
            user_fname: userProfile.user_fname,
            user_mname: userProfile.user_mname,
            user_lname: userProfile.user_lname,
            user_role: userProfile.user_role,
          });
        } else {
          const stored = await AsyncStorage.getItem("userProfile");
          if (stored) setProfile(JSON.parse(stored));
        }

        const storedPrefs = await AsyncStorage.getItem("notificationPrefs");
        if (storedPrefs) setPrefs(JSON.parse(storedPrefs));
      } catch (e) {
        console.warn("Failed loading profile from storage", e);
      }
    };
    loadProfile();
  }, [user]);

  // Fetch logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.user_id) return;
      setLoadingLogs(true);
      try {
        const res = await fetch(getEndpoint(`/user-logs/${user.user_id}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        // Expecting array; map to {id, action, time}
        const mapped = Array.isArray(data) ? data.map((l, idx) => ({
          id: l.log_id || idx,
          action: l.action || l.user_action || l.description || 'Activity',
          time: l.timestamp || l.created_at || l.time || new Date().toISOString(),
        })) : [];
        setLogs(mapped);
      } catch (err) {
        console.warn('Error fetching logs', err.message);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [user?.user_id]);

  const saveProfileToStorage = async (updatedProfile) => {
    await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const savePrefs = async (updatedPrefs) => {
    setPrefs(updatedPrefs);
    await AsyncStorage.setItem(
      "notificationPrefs",
      JSON.stringify(updatedPrefs)
    );
  };

  const validateInputs = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!emailRegex.test(editData.user_email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(editData.user_phonenum)) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number.");
      return false;
    }
    if (!editData.user_fname?.trim()) {
      Alert.alert("First Name Required", "First name cannot be empty.");
      return false;
    }
    if (!editData.user_lname?.trim()) {
      Alert.alert("Last Name Required", "Last name cannot be empty.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    setSaving(true);
    try {
      const payload = {
        user_email: editData.user_email,
        user_phonenum: editData.user_phonenum,
        user_status: editData.user_status,
        branch_id: editData.branch_id,
        user_fname: editData.user_fname,
        user_mname: editData.user_mname,
        user_lname: editData.user_lname,
        user_role: editData.user_role || profile.user_role || user?.user_role || 'User',
      };

      // Only include password if user entered a new non-empty one
      if (editData.user_password && editData.user_password.trim().length > 0) {
        payload.user_password = editData.user_password.trim();
      }

      let res;
      if (newImage) {
        const form = new FormData();
        Object.entries(payload).forEach(([k, v]) => form.append(k, v));
        form.append('user_profile', newImage);
        res = await fetch(getEndpoint(`/users/${editData.user_id}`), {
          method: 'PUT',
          body: form,
          credentials: 'include',
        });
      } else {
        res = await fetch(getEndpoint(`/users/${editData.user_id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update');
      }

      // Re-verify / fetch updated user
      const verifyRes = await fetch(getEndpoint(`/verify`), { method: 'GET', credentials: 'include' });
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData.user) {
          await AsyncStorage.setItem('user', JSON.stringify(verifyData.user));
          setUser(verifyData.user);
        }
      }

      const updated = { ...profile, ...editData };
      updated.name = `${updated.user_fname} ${updated.user_mname || ""} ${updated.user_lname}`.trim();
      setProfile(updated);
      await saveProfileToStorage(updated);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err) {
      console.error('Update failed', err);
      Alert.alert('Error', err.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      user_id: profile.user_id,
      user_date_created: profile.user_date_created,
      user_email: profile.user_email,
      // keep blank so we don't resend unchanged hashed password
      user_password: "",
      user_phonenum: profile.user_phonenum,
      user_status: profile.user_status,
      branch_id: profile.branch_id,
      user_fname: profile.user_fname || "",
      user_mname: profile.user_mname || "",
      user_lname: profile.user_lname || "",
      user_role: profile.user_role || "",
    });
    setIsEditing(false);
  };

  const confirmSignOut = async () => {
    try {
      setShowSignOutModal(false);
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const togglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    savePrefs(updated);
  };

  const pickImage = async () => {
    try {
      setPickingImage(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Media library permission is required to pick an image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        const uri = asset.uri;
        // Derive filename & type
        const name = uri.split('/').pop() || 'profile.jpg';
        const extensionMatch = name.match(/\.(jpg|jpeg|png)$/i);
        const type = extensionMatch ? `image/${extensionMatch[1].toLowerCase() === 'jpg' ? 'jpeg' : extensionMatch[1].toLowerCase()}` : 'image/jpeg';
        setNewImage({ uri, name, type });
      }
    } catch (e) {
      console.warn('Image pick failed', e);
      Alert.alert('Error', 'Failed to pick image.');
    } finally {
      setPickingImage(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}>
        <View style={styles.profileCard}>
          <View style={{ position: 'relative' }}>
            <Image source={newImage ? { uri: newImage.uri } : (user?.user_profile ? { uri: `${API_CONFIG.BASE_URL.replace('/api', '')}${user.user_profile}` } : images.avatar)} style={styles.avatar} />
            {isEditing && (
              <TouchableOpacity onPress={pickImage} disabled={pickingImage} style={{ position: 'absolute', bottom: 4, right: 4, backgroundColor: '#0B3D91', padding: 6, borderRadius: 20 }}>
                <Edit2 size={14} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.user_role}</Text>

          {!isEditing ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)} disabled={saving}>
              <Edit2 size={14} color="#0B3D91" />
              <Text style={styles.editBtnText}>{saving ? 'Saving...' : 'Edit Profile'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: saving ? '#5a7bbf' : "#0B3D91" }]} onPress={handleSave} disabled={saving || pickingImage}>
                <Text style={styles.saveText}>{saving ? 'Saving...' : (pickingImage ? 'Image...' : 'Save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#ccc" }]} onPress={handleCancel}>
                <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          {/* User ID */}
          <View style={styles.infoRow}>
            <User2Icon size={20} color="#0B3D91" />
            {!isEditing ? (
              <View>
                <Text style={styles.infoLabel}>User Id</Text>
                <Text style={styles.infoValue}>{profile.user_id}</Text>
              </View>
            ) : (
              <TextInput
                style={styles.inputInline}
                value={editData.user_id.toString()}
                editable={false}
              />
            )}
          </View>

          {/* Date Created */}
          <View style={styles.infoRow}>
            <Clock size={20} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>Date Created</Text>
              <Text style={styles.infoValue}>
                {profile.user_date_created
                  ? new Date(profile.user_date_created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : ""}
              </Text>
            </View>
          </View>

          {/* Email */}
          {/* First Name */}
          <View style={styles.infoRow}>
            <User2Icon size={20} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>{profile.user_fname}</Text>
            </View>
          </View>

          {/* Middle Name */}
          <View style={styles.infoRow}>
            <User2Icon size={20} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>Middle Name</Text>
              <Text style={styles.infoValue}>{profile.user_mname}</Text>
            </View>
          </View>

          {/* Last Name */}
          <View style={styles.infoRow}>
            <User2Icon size={20} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>{profile.user_lname}</Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.infoRow}>
            <Mail size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput
                style={styles.inputInline}
                value={editData.user_email}
                onChangeText={(text) => setEditData({ ...editData, user_email: text })}
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile.user_email}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            {/* Password */}
            {isEditing && (
              <View style={styles.infoRow}>
                <Lock size={20} color="#0B3D91" />
                <TextInput
                  style={styles.inputInline}
                  value={editData.user_password}
                  placeholder="New Password"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setEditData({ ...editData, user_password: text })}
                  secureTextEntry={true}
                />
              </View>
            )}
          </View>


          {/* Phone */}
          <View style={styles.infoRow}>
            <Phone size={20} color="#0B3D91" />
            {isEditing ? (
              <TextInput
                style={styles.inputInline}
                value={editData.user_phonenum}
                onChangeText={(text) => setEditData({ ...editData, user_phonenum: text })}
                keyboardType="phone-pad"
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile.user_phonenum}</Text>
              </View>
            )}
          </View>

          {/* Status */}
          <View style={styles.infoRow}>
            <AlertCircle size={20} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{profile.user_status}</Text>
            </View>
          </View>

          {/* Role (read only) */}
          <View style={styles.infoRow}>
            <User2Icon size={20} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{profile.user_role}</Text>
            </View>
          </View>

          {/* Branch */}
          <View style={styles.infoRow}>
            <Building size={18} color="#0B3D91" />
            <View>
              <Text style={styles.infoLabel}>Branch</Text>
              <Text style={styles.infoValue}>{profile.branch_id}</Text>
            </View>
          </View>
        </View>

        {/* Settings and Logs */}
        {!isEditing && (
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem} onPress={() => setShowLogs(true)}>
              <Settings size={20} color="#0B3D91" />
              <Text style={styles.settingsText}>Activity Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem} onPress={() => setShowNotifications(true)}>
              <Bell size={20} color="#0B3D91" />
              <Text style={styles.settingsText}>Notification Preference</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isEditing && (
          <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowSignOutModal(true)}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sign Out Modal */}
      <Modal transparent visible={showSignOutModal} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: 280,
            }}
          >
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
              Are you sure you want to sign out?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => setShowSignOutModal(false)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: "#555", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSignOut} style={{ padding: 10 }}>
                <Text style={{ color: "#E53935", fontWeight: "bold" }}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Activity Logs Modal */}
      <Modal visible={showLogs} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <TouchableOpacity onPress={() => setShowLogs(false)}>
              <ArrowLeft size={24} color="#0B3D91" />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "1000",
                color: "#0B3D91",
              }}
            >
              Activity Logs
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 8,
              backgroundColor: "#f0f2f5",
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: Platform.OS === "ios" ? 10 : 6,
              flexDirection: "row",
              alignItems: "center",
              elevation: 2,
            }}
          >
            <TextInput
              placeholder="Search activity..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              style={{
                fontSize: 14,
                flex: 1,
                color: "#333",
              }}
            />
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <View
                  key={log.id}
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Clock size={20} color="#0B3D91" style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#0B3D91",
                        marginBottom: 4,
                      }}
                    >
                      {log.action}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#555" }}>
                      {log.time}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View
                style={{
                  paddingVertical: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#999", fontSize: 14 }}>
                  No activity logs found.
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Notification Preferences Modal */}
      <Modal visible={showNotifications} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <TouchableOpacity onPress={() => setShowNotifications(false)}>
              <ArrowLeft size={24} color="#0B3D91" />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "1000",
                color: "#0B3D91",
              }}
            >
              Notification Preferences
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Preferences List */}
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>
                Push Notifications
              </Text>
              <Switch
                value={prefs.push}
                onValueChange={() => togglePref("push")}
                trackColor={{ false: "#ccc", true: "#0B3D91" }}
                thumbColor="#fff"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>
                Email Notifications
              </Text>
              <Switch
                value={prefs.email}
                onValueChange={() => togglePref("email")}
                trackColor={{ false: "#ccc", true: "#0B3D91" }}
                thumbColor="#fff"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>
                SMS Notifications
              </Text>
              <Switch
                value={prefs.sms}
                onValueChange={() => togglePref("sms")}
                trackColor={{ false: "#ccc", true: "#0B3D91" }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default Profile;