import { RecentActivity as SampleData, today } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/home_styles";
import { router } from "expo-router";
import { Bell, CheckCircle, ClipboardList, FileText, Folder, Logs, Scale, Search, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const Dashboard = () => {
  const [recentActivity, setRecentActivity] = useState(SampleData);

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
                    <TouchableOpacity style={styles.activityItem} activeOpacity={0.7}>
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;
