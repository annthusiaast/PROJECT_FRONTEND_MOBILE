// Centralized role -> tabs mapping used by both TabsLayout and ProtectedRoute.
// Keep this file free of React / navigation logic for easy reuse.

import { ClipboardList, FileText, Home, Scale, User } from 'lucide-react-native';

export const baseTabs = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'tasks', label: 'Tasks', icon: ClipboardList },
  { name: 'cases', label: 'Cases', icon: Scale },
  { name: 'documents', label: 'Documents', icon: FileText },
  { name: 'profile', label: 'Profile', icon: User },
];

// Returns an ordered array of tab objects allowed for a given role.
export function getAllowedTabs(role) {
  if (!role) return baseTabs; // while role unknown, show all (layout will handle loading separately)
  switch (role) {
    case 'Admin':
      return baseTabs;
    case 'Lawyer':
      return [
        tab('home'),
        tab('cases'),
        tab('tasks'),
        tab('profile'),
      ].filter(Boolean);
    case 'Paralegal':
      // Per updated requirement Paralegals have no access to cases or documents
      return [
        tab('home'),
        tab('tasks'),
        tab('profile'),
      ].filter(Boolean);
    case 'Staff':
      return [
        tab('home'),
        tab('tasks'),
        tab('profile'),
      ].filter(Boolean);
    default:
      return baseTabs;
  }
}

export function getAllowedTabNames(role) {
  return getAllowedTabs(role).map(t => t.name);
}

function tab(name) {
  return baseTabs.find(t => t.name === name);
}
