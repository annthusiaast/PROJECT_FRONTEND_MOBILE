import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { styles } from "@/constants/styles/(tabs)/home_styles"
import { today } from "@/constants/sample_data";
import { Bell, Search } from 'lucide-react-native';

const Cases = () => {
  
  return (
        // this wrap the entire screen to adjust layout when keyboard appears 
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' works better on iOS, 'height' is safer for Android
    >
      
      {/*  dismissing the keyboard when tapping outside of input fields */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        {/* Enables scroll when content overflows and makes it compatible with keyboard appearance */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      {/* Header Date */}
      <View>
          <Text style={styles.headerDate}>{today}</Text>
      </View>

      {/* Header with Notification Icon */}
      <View style={styles.headerWrapper}>

        <Text style={styles.headerContainer}>Cases</Text>
        <TouchableOpacity onPress={() => alert('Notifications Clicked!')} style={{ marginTop: 15 }}>
          <Bell size={26} color="#373839ff" strokeWidth={3}/>
        </TouchableOpacity>
      </View>

      {/* Search Placeholder */}
      <View style={styles.searchInputContainer}>
        <Search size={20} color="#999" />
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#999" />
      </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Cases;
