import { StyleSheet } from 'react-native';

 export const styles = StyleSheet.create({ 

    // Date Header
  headerDate: {
    fontSize: 12,
    color: '#555',
    marginTop: 30,
    marginLeft: 10,
    marginBottom: -25,
  },

    //Tasks Title
headerContainer: {
    color: '#1d1d66ff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Sans-serif',
    padding: 20,
    marginLeft: -25,},
  
//Notification Icon
headerWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',  
  alignItems: 'center',
  paddingHorizontal: 20,            
  paddingVertical: 10,
  },

  //Search Placeholder
searchInputContainer: {
  flexDirection: 'row',
  marginTop: -5,
  marginLeft: 10,
  width: '95%',
  alignItems: 'center',
  borderColor: '#8b8b96ff',
  borderWidth: 1.5,
  borderRadius: 8,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
  marginVertical: 15,
  elevation: 2,
},

searchInput: {
  flex: 1,         
  height: 45,
  fontSize: 16,
  color: '#333',
  marginLeft: 8,   
},

// Task Button, Text and Cards

taskButtonAlignments:{
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     marginHorizontal: 10, 
     marginTop: 10 
},

taskButton: {
  borderWidth: 1,
  borderColor: '#2784e0ff',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginRight: 8,
},

taskButtonText: {
  color: '#121313ff',
  fontSize: 14,
  fontWeight: 'bold',
},

taskButtonPressed: {
  backgroundColor: '#114d89ff',
},

taskButtonTextPressed: {
  color: '#fff',
},

taskFilterContainer: {
  flexDirection: 'row',
  marginTop: 10,
  marginLeft: 10,
  backgroundColor: '#114d89ff',
},

taskCard: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 10,
  marginHorizontal: 10,
  marginTop: 10,
  borderWidth: 1,
  borderColor: '#ddd',
},

 });