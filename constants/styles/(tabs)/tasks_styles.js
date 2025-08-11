import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  //Notification Icon
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  //SEARCH BAR
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 15,
    marginBottom: 30,
    marginLeft: 6,
    width: '96.5%',
    height: 48,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },


  // Task Button, Text and Cards

  taskButtonAlignments: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginTop: 10,
  },

  taskButton: {
    borderWidth: 1,
    borderColor: '#2784e0ff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 5,
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
    marginHorizontal: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

});