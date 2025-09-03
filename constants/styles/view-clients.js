import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1},
  errorText: { backgroundColor: "#ef4444", color: "#fff", padding: 8, textAlign: "center" },
  
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },


  clientInfo: { flex: 1 },
  clientName: { fontWeight: "600", fontSize: 16 },
  clientEmail: { color: "#6b7280" },
  clientCreatedBy: { color: "#9ca3af", fontSize: 12 },
  clientActions: { flexDirection: "row", gap: 10 },
  emptyText: { textAlign: "center", color: "#9ca3af", marginTop: 20 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },


  pageButton: { paddingHorizontal: 12, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  
  modalBox: { backgroundColor: "#fff", padding: 24, borderRadius: 8, width: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalButton: { marginTop: 16, backgroundColor: "#2563eb", padding: 10, borderRadius: 6 },
  modalButtonText: { color: "#fff", textAlign: "center" },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", //top- right corner
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 10, 
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },

  activeTab: {
    backgroundColor: "#144478ff",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },


});
