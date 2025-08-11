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

  //Trash Icon
  trashIcon: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
    marginLeft: 16,
    width: '91%',
    height: 48,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },

  //cards container
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: -30,
  },

  card: {
    width: '48%',       // 2 cards per row
    height: 70,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#114d89ff',
  },

  cardTitle: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#edf0f6ff'
  },

  //processing documents card
  processDocuments: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#edf0f6ff'
  },

  cardCount: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#edf0f6ff',
    padding: 2,
    borderRadius: 8,
  },

  //Recent Activity Cards
  recentActivityCard: {
    width: '91%',
    minHeight: 360,
    borderRadius: 10,
    borderColor: '#aaaab4ff',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    marginLeft: 15,
    backgroundColor: '#f6fafdff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },

  recentActivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d1d66ff',
    marginBottom: 15,
  },

  recentActivityContainer: {
    flexDirection: 'column',   // ✅ stack items vertically
    gap: 7,                   // ✅ space between items
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#103a63',    // solid color for Android
    backgroundColor: '#fff',   // required for proper shadow rendering
    elevation: 5,              // shadow for Android
    shadowColor: '#002',       // shadow for iOS
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },


  activityTextWrapper: {
    flex: 1,
    marginLeft: 10,           // space after the icon
  },

  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  activitySubText: {
    fontSize: 12,
    color: '#666',
  },

  activityTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1d1d66ff',
    textAlign: 'right',
    marginLeft: 10,
  },

  activityTextWrapper: {
    flex: 1,
    marginLeft: 10,
  },

  activitySubText: {
    fontSize: 12,
    color: '#777',
  },

  noActivityText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },


})
