import { today } from "@/constants/sample_data";
import { styles } from "@/constants/styles/(tabs)/home_styles";
import { Bell, Search } from 'lucide-react-native';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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
              <Bell size={26} color="#0B3D91" strokeWidth={2} />
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
