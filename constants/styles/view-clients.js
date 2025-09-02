import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1},
  errorText: { backgroundColor: "#ef4444", color: "#fff", padding: 8, textAlign: "center" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  searchInput: { flex: 1, marginLeft: 8 },
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
});
