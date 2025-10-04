import { RecentActivity as SampleData, today } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/home_styles";
import { router } from "expo-router";
import { Bell, CheckCircle, ClipboardList, FileText, Folder, Logs, Scale, Search, Trash2, User2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAuth } from '@/context/auth-context';
import { getEndpoint } from '@/constants/api-config';
import LogDetailsModal from '@/components/log-details-modal';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState(SampleData);
  const [error, setError] = useState(null);
  const [processingCasesCount, setProcessingCasesCount] = useState(0);
  const [archivedCasesCount, setArchivedCasesCount] = useState(0);
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

  // Fetch dashboard counts from backend
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      if (!user?.user_id) return;
      
      try {
        // Fetch processing cases count
        const processingCasesRes = await fetch(getEndpoint('/cases/count/processing'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (processingCasesRes.ok) {
          const data = await processingCasesRes.json();
          setProcessingCasesCount(data.count || 0);
        }

        // Fetch archived cases count
        // const archivedCasesRes = await fetch(getEndpoint('/cases/count/archived'), {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        //   credentials: 'include',
        // });
        // if (archivedCasesRes.ok) {
        //   const data = await archivedCasesRes.json();
        //   setArchivedCasesCount(data.count || 0);
        // }

        // Fetch processing documents count
        const processingDocsRes = await fetch(getEndpoint('/documents/count/processing'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (processingDocsRes.ok) {
          const data = await processingDocsRes.json();
          setProcessingDocumentsCount(data.count || 0);
        }

        // Fetch clients count
        const clientsRes = await fetch(getEndpoint('/clients/count'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (clientsRes.ok) {
          const data = await clientsRes.json();
          setClientsCount(data.count || 0);
        }

        // Fetch pending approvals count
        // const pendingApprovalsRes = await fetch(getEndpoint('/approvals/count/pending'), {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        //   credentials: 'include',
        // });
        // if (pendingApprovalsRes.ok) {
        //   const data = await pendingApprovalsRes.json();
        //   setPendingApprovalsCount(data.count || 0);
        // }

        // Fetch pending tasks count
        // const pendingTasksRes = await fetch(getEndpoint('/tasks/count/pending'), {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        //   credentials: 'include',
        // });
        // if (pendingTasksRes.ok) {
        //   const data = await pendingTasksRes.json();
        //   setPendingTasksCount(data.count || 0);
        // }

      } catch (e) {
        console.warn('Dashboard counts fetch failed:', e.message);
        setError('Failed to load dashboard data');
      }
    };

    fetchDashboardCounts();
  }, [user?.user_id]);


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
    <KeyboardAvoidingView style={{ flex: 3}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          {/* Searh input
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#999" />
          </View> */}

          {/* Cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Folder size={20} color="#edf0f6ff" />
              <Text style={styles.cardTitle}>Archived Cases</Text>
              <Text style={styles.cardCount}>{archivedCasesCount}</Text>
            </View>
            <View style={styles.card}>
              <Scale size={20} color="#edf0f6ff" />
              <Text style={styles.cardTitle}>Processing Cases</Text>
              <Text style={styles.cardCount}>{processingCasesCount}</Text>
            </View>
            <View style={styles.card}>
              <FileText size={20} color="#edf0f6ff" />
              <Text style={styles.processDocuments}>Processing{'\n'}Documents</Text>
              <Text style={styles.cardCount}>48</Text>
            </View>
            <View style={styles.card}>
              <User2 size={20} color="#edf0f6ff" />
              <Text style={styles.processDocuments}>Clients</Text>
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
