import { Logs } from "lucide-react-native";
import React, { useState } from "react";


// Activity Log Data
export const RecentActivity = [
    {
        id: 1,
        user_log_description: "Logged in 5 minutes ago",
        user_log_datetime: "2025-07-21T08:45:00Z",
        user_log_type: "login",
    },

    {
        id: 2,
        user_log_description: "Approved document 'Contract Agreement'",
        user_log_datetime: "2025-07-21T08:45:00Z",
        user_log_type: "document logs",
    },
    
    {
        id: 3,
        user_log_description: "Sent new task to Vanessa Escobar",
        user_log_datetime: "2025-07-21T08:45:00Z",
        user_log_type: "task logs",
    },

    {
        id: 4,
        user_log_description: "Added new document 'Project Proposal'",
        user_log_datetime: "2025-07-21T08:45:00Z",
        user_log_type: "document logs",
    },

    {
        id: 4,
        user_log_description: "Logged out 9 hours ago",
        user_log_datetime: "2025-07-21T08:45:00Z",
        user_log_type: "logout",
    },
];

// Header Date on each screen ( Home, Tasks, Cases, Documents)
export const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', 
  year: 'numeric', 
  month: 'long',   
  day: 'numeric'   
});

//======= ACTIVE TASK ========//

// Sample tasks 
  export const task = [
    { id: 1, title: "Affidavit of Cohabitation", description: "Prepare affidavit for court submission", assignedTo: "Paralegal John Doe", dueDate: "2025-07-29" },
    { id: 2, title: "Case Evidence Review", description: "Review and summarize submitted evidence", assignedTo: "Staff Jane Smith", dueDate: "2025-07-31" },
    { id: 3, title: "Witness Interview", description: "Schedule and conduct interview with witness", assignedTo: "Paralegal Mike Lee", dueDate: "2025-08-03" },
    { id: 4, title: "File Case Papers", description: "Organize and submit case documentation", assignedTo: "Paralegal Sarah Cruz", dueDate: "2025-08-10" },
  ];

// Button Color in Tasks UI (Active-Task)


  // Function to calculate priority level according to due date
 export const getPriority = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) return "high";        // Today or within 48 hours
    if (diffDays <= 4) return "medium";      // 3–4 days
    if (diffDays <= 7) return "low";         // Next week (5–7 days)
    return "low";                            // Else → low by default
  };

  // Function to format due date display
  export const formatDueDate = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return "Next Week";
    return dueDate;
  };

  //======= COMPLETED  TASK ========//

  //filter options in dropdown in top right 
  export const FILTER_OPTIONS = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 14 Days", value: 14 },
  { label: "Last 21 Days", value: 21 },
  { label: "Last 1 Month", value: 30 },
  { label: "Last 3 Months", value: 90 },
];

//Sample Completed Data
export const completedTasks = [
    { id: 1, title: "Submit Affidavit of Cohabitation", description: "Filed with supporting evidence.", completedDate: "2025-07-25", staff: "Paralegal Anna" },
    { id: 2, title: "Update Client Records", description: "Updated client information in the legal database.", completedDate: "2025-07-28", staff: "Staff John" },
    { id: 3, title: "Close Case #445", description: "Final documents were reviewed and archived.", completedDate: "2025-07-29", staff: "Paralegal Mike" },
  ];



  //======= CREATE  TASK ========//

//Sample Cases
export const sampleCases = ["Case A", "Case B", "Case C"];

//Sample Team Members
export const teamMembers = [
    { name: "John Doe", role: "Staff" },
    { name: "Jane Smith", role: "Paralegal" },
    { name: "Michael Lee", role: "Staff" },
  ];