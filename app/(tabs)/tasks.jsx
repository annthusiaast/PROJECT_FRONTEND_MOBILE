import ActiveTask from '@/components/active-task';
import CompletedTask from '@/components/completed-task';
import CreateTask from '@/components/create-task';
import { styles } from "@/constants/styles/(tabs)/tasks_styles";
import { Search } from 'lucide-react-native';
import { useAuth } from '@/context/auth-context';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

const Tasks = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, paddingHorizontal: 10, paddingBottom: 30 }}>
          
          {/* Search input */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#999"
            />
          </View>

          {/* ==== Tab Buttons ==== */}
            <View style={styles.taskButtonAlignments}>
            {['active', 'completed', 'create'].map((tab) => {
              const isActive = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.taskButton,
                    tab === 'create' && !isActive && { backgroundColor: 'green' }, //  Green only if not active
                    isActive && styles.taskButtonPressed // Normal active style
                    
                  ]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.taskButtonText,
                      isActive && styles.taskButtonTextPressed,
                      tab === 'create' && !isActive && { color: 'white' } // White text only when green
                    ]}
                  >
                    {tab === 'active'
                      ? 'Active Task'
                      : tab === 'completed'
                      ? 'Completed Task'
                      : '+ Create Task'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ==== Content Area of Each Task Button ==== */}
          <View style={{ flex: 1 }}>
            {activeTab === 'active' && <ActiveTask user={user} />}
            {activeTab === 'completed' && <CompletedTask user={user} />}
            {activeTab === 'create' && <CreateTask user={user} />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Tasks;
