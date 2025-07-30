import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Bell, Search } from 'lucide-react-native';
import { styles } from "@/constants/styles/(tabs)/tasks_styles";
import { today } from "@/constants/sample_data";
import ActiveTask from '@/components/active-task';
import CompletedTask from '@/components/completed-task';
import CreateTask from '@/components/create-task';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'create'>('active');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* ✅ Use a single non-scrollable container */}
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          
          {/* Header Date */}
          <Text style={styles.headerDate}>{today}</Text>

          {/* Header with Notification Icon */}
          <View style={styles.headerWrapper}>
            <Text style={styles.headerContainer}>Tasks</Text>
            <TouchableOpacity onPress={() => alert('Notifications Clicked!')} style={{ marginTop: 15 }}>
              <Bell size={26} color="#373839ff" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#999" />
          </View>

          {/* ==== Tab Buttons ==== */}
          <View style={styles.taskButtonAlignments}>
            {['active', 'completed', 'create'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.taskButton, activeTab === tab && styles.taskButtonPressed]}
                onPress={() => setActiveTab(tab as any)}
                activeOpacity={0.7}
              >
                <Text style={[styles.taskButtonText, activeTab === tab && styles.taskButtonTextPressed]}>
                  {tab === 'active' ? 'Active Task' : tab === 'completed' ? 'Completed Task' : '+ Create Task'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ==== Content Area of Each Task Button ==== */}
          <View style={{ flex: 1 }}>
            {activeTab === 'active' && <ActiveTask />}
            {activeTab === 'completed' && <CompletedTask />}
            {activeTab === 'create' && <CreateTask />}
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Tasks;
