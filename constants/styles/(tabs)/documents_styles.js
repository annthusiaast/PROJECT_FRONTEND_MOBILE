import { StyleSheet } from "react-native";

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

    //DROPDOWN FILTERS 
    dropdownButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginLeft: 16,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    dropdownText: {
        fontSize: 14,
        color: "#000",
    },

    //TABS (Recent, All Files, Shared)
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#1E3A8A",
        alignItems: "center",
        borderRadius: 8,
        marginHorizontal: 2, // adds spacing between tab buttons
    },
    activeTabButton: {
        backgroundColor: "#1E3A8A",
    },
    tabText: {
        color: "#1E3A8A",
        fontSize: 14,
        fontWeight: "500",
    },
    activeTabText: {
        color: "#fff",
    },


    //DOCUMENT CARD 
    docCard: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginTop: 15,
        backgroundColor: "#fff",
    },

    //DOCUMENT HEADER (Title & Tag)
    docHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    docTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    docCase: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    docTag: {
        backgroundColor: "#E5E7EB",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    docTagText: {
        fontSize: 12,
        color: "#555",
    },

    //DOCUMENT META (Date & Size)
    docMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },

    //DOCUMENT ACTION BUTTONS 
    docButtons: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },

    downloadButton: {
    borderWidth: 1,
    borderColor: "#1E3A8A",
    backgroundColor: "#f3f5faff",
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    alignSelf: "center", // push button to the right
    },

    downloadButtonText: {
        color: "#0e0e0eff",
        fontWeight: "500",
    },

    dropdownButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#114d89",
        borderRadius: 6,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 150,
    },


    dropdownText: {
        fontSize: 14,
        color: "#101111ff",
        marginRight: 6
    },

    dropdownModal: {
        backgroundColor: "#E5E7EB",
    },


});
