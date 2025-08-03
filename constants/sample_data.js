

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


//Profile/sampledata
export const initialProfile = {
  name: "Joseph Martinez",
  role: "Lawyer",
  email: "joseph@gmail.com",
  phone: "0912 345 6789",
  address: "Cebu, City",
  department: "Boslawfirm",
};

// Sample Documents Data
export const documents = [
  {
    id: 1,
    title: "Settlement Agreement",
    caseName: "Smith vs. Johnson",
    date: "Today",
    size: "1.2 MB",
    type: "Contract",
  },
  {
    id: 2,
    title: "Court Filing",
    caseName: "Estate Planning",
    date: "2 days ago",
    size: "3.5 MB",
    type: "Pleading",
  },

];

// Documents UI , All Case and All Types Sample Data
  export const CASE_FILTERS = ["All Cases", "Case A", "Case B", "Case C"];
  export const DOC_TYPES = ["All Types", "Pleading", "Contract", "Evidence"];

// ======= CLIENTS ======= //
export const sampleClients = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "09123456789" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "09987654321" },
  { id: 3, name: "Michael Johnson", email: "michael@example.com", phone: "09771234567" },
];


// ====== ALL CASES ======= //
export const allCases = [
  {
    id: 1,
    title: "Criminal Case",
    description: "Review evidence for the upcoming trial.",
    assignedTo: "Atty. Santos",
    status: "pending",
  },
  {
    id: 2,
    title: "Civil Case",
    description: "Prepare defense documents and witness list.",
    assignedTo: "Atty. Cruz",
    status: "processing",
  },
  {
    id: 3,
    title: "Property Dispute",
    description: "Finalize settlement agreement with opposing counsel.",
    assignedTo: "Atty. Ramirez",
    status: "completed",
  },
  {
    id: 4,
    title: "Fraud Investigation",
    description: "Collect financial records for further analysis.",
    assignedTo: "Paralegal Jane",
    status: "pending",
  },
  {
    id: 5,
    title: "Tax Evasion Case #5223",
    description: "Draft initial complaint and supporting affidavits.",
    assignedTo: "Atty. Lopez",
    status: "processing",
  },
];
