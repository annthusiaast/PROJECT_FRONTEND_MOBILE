import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({


//======= ACTIVE TASK ========//

// Priority Filter Buttons
priorityBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 2,
    alignItems: "center",
} ,

priorityBtnText: {
    fontWeight: "bold",
    fontSize: 10,
},

//Tasks Cards
taskCard:{
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
},

//Priority Badge in the top right
priorityBadge:{
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
},

priorityBadgeText:{

    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 12 ,
},

//Task Card Title
taskCardTitle:{

    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 5 
},

//Task Card Description
taskCardDescription:{
    fontSize: 14,
     color: "#555", 
     marginBottom: 8 
 },

//Task Card Assigned User

assignedUser:{
    flexDirection: "row",
     alignItems: "center", 
     marginBottom: 5 
},

assignedUserText:{ 
    fontSize: 13, 
    color: "#333" },

// Task Card Due Date

dueDate:{ 
    flexDirection: "row", 
    alignItems: "center" },

dueDateText:{
    fontSize: 13, 
    color: "#333" 
},

//======= COMPLETED TASK ========//

//Task Card
renderTaskCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        backgroundColor: "#fff",
      },

//Completed Text Button in the top right
completedTexButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#2d6a4f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    
},

//Dropdown Button Alignment
dropdownBox: {
     flexDirection: "row", 
     justifyContent: "flex-end",
      marginBottom: 10 
    },

dropdownBoxOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#114d89",
    borderRadius: 8,
    backgroundColor: "#fff",
    },

dropdownBoxOptionText: { 

    color: "#101111ff", 
    fontWeight: "bold", 
    marginRight: 5 },

dropdownModalPosition: {
    backgroundColor: "#fff",
    position: "absolute",
    right: 20,
    width: 200,
    borderRadius: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    },


// //======= CREATE TASK ========//

dropdownPosition: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#acafb3ff",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 50, //  default height
    marginBottom: 15,
},

//  Dropdown Modal
dropdownModal: {
    backgroundColor: "#fff",
    position: "absolute",
    borderRadius: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
},

// Title
TitlePlaceholder: {
  borderWidth: 1,
  borderColor: "#acafb3ff",
  borderRadius: 6,
  paddingHorizontal: 10,
  height: 45,
  marginBottom: 10,

},

// Fee
FeePlaceholder: {
  borderWidth: 1,
  borderColor: "#acafb3ff",
  borderRadius: 6,
  paddingHorizontal: 10,
  height: 50,
  marginBottom: 10,
},

// Description
DescriptionPlaceholder: {
    borderWidth: 1,
    borderColor: "#acafb3ff",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    height: 80,
    textAlignVertical: "top",
},

// Due Date
dueDateDropdown: {
    borderWidth: 1,
    borderColor: "#acafb3ff",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 50, 
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    },


// Calendar Modal
calendarModal: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    },

    //Task Created Button
taskCreatedBtn: {
    backgroundColor: "#114d89",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    },

 });
