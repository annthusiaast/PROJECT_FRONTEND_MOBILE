import { RecentActivity as SampleData, today } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/home_styles";
import { router } from "expo-router";
import { Bell, CheckCircle, ClipboardList, FileText, Folder, Logs, Scale, Search, Trash2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAuth } from '@/context/auth-context';
import { getEndpoint } from '@/constants/api-config';
import LogDetailsModal from '@/components/log-details-modal';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState(SampleData);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const clearAllActivities = () => {
    setRecentActivity([]);
  };

  const deleteActivity = (id) => {
    setRecentActivity(prev => prev.filter(item => item.id !== id));
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.trashIcon} onPress={() => deleteActivity(id)}>
      <Trash2 size={24} color="#fff" />
    </TouchableOpacity>
  );

  // Fetch recent activity from backend when user is available
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.user_id) return;
      setLoading(true);
      try {
        const endpointPath = user?.user_role === 'Admin' ? `/user-logs` : `/user-logs/${user.user_id}`;
        const res = await fetch(getEndpoint(endpointPath), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // cookies are used by backend verifyUser
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch recent activity');
        const data = await res.json();
        const mapped = Array.isArray(data)
          ? data.map((l, idx) => ({
              id: l.user_log_id || l.log_id || idx,
              user_log_description: l.user_log_description || l.description || l.user_log_action || 'Activity',
              user_log_datetime: l.user_log_datetime || l.user_log_time || l.timestamp || l.created_at || new Date().toISOString(),
              user_log_type: l.user_log_type || l.type,
              raw: l,
            }))
          : [];
        setRecentActivity(mapped);
      } catch (e) {
        // keep sample data as fallback
        console.warn('Recent activity fetch failed:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user?.user_id, user?.user_role]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          {/* Searh input */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#999" />
          </View>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Folder size={20} color="#edf0f6ff" />
              <Text style={styles.cardTitle}>Archived Cases</Text>
              <Text style={styles.cardCount}>24</Text>
            </View>
            <View style={styles.card}>
              <Scale size={20} color="#edf0f6ff" />
              <Text style={styles.cardTitle}>Processing Cases</Text>
              <Text style={styles.cardCount}>24</Text>
            </View>
            <View style={styles.card}>
              <FileText size={20} color="#edf0f6ff" />
              <Text style={styles.processDocuments}>Processing{'\n'}Documents</Text>
              <Text style={styles.cardCount}>48</Text>
            </View>
            <View style={styles.card}>
              <FileText size={20} color="#edf0f6ff" />
              <Text style={styles.processDocuments}>Archived{'\n'}Documents</Text>
              <Text style={styles.cardCount}>48</Text>
            </View>
            <View style={styles.card}>
              <CheckCircle size={20} color="#edf0f6ff" />
              <Text style={styles.cardTitle}>Pending Approvals</Text>
              <Text style={styles.cardCount}>8</Text>
            </View>
            <View style={styles.card}>
              <ClipboardList size={20} color="#edf0f6ff" />
              <Text style={styles.cardTitle}>Pending Tasks</Text>
              <Text style={styles.cardCount}>5</Text>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivityCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.recentActivityTitle}>Recent Activity</Text>
              {recentActivity.length > 0 && (
                <TouchableOpacity onPress={clearAllActivities}>
                  <Text style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.recentActivityContainer}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <Swipeable key={`${activity.id}-${index}`} renderRightActions={() => renderRightActions(activity.id)}>
                    <TouchableOpacity
                      style={styles.activityItem}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedLog(activity.raw || activity);
                        setShowDetails(true);
                      }}
                    >
                      <Logs size={22} color="#1d1d66ff" />
                      <View style={styles.activityTextWrapper}>
                        <Text style={styles.activityText}>{activity.user_log_description}</Text>
                      </View>
                      <Text style={styles.activityTime}>
                        {new Date(activity.user_log_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{'\n'}
                        {new Date(activity.user_log_datetime).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  </Swipeable>
                ))
              ) : (
                <Text style={styles.noActivityText}>No recent activity available</Text>
              )}
            </View>
          </View>
          {/* Details Modal */}
          <LogDetailsModal
            visible={showDetails}
            onClose={() => setShowDetails(false)}
            log={selectedLog}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;
