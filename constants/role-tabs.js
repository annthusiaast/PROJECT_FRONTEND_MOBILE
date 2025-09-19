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
  if (!role) return []; // while role unknown, show none; layout should handle loading state
  const normalized = String(role).toLowerCase();
  switch (normalized) {
    case 'admin':
      return baseTabs;
    case 'lawyer':
      // Lawyers should have access to Documents as well
      return [
        tab('home'),
        tab('cases'),
        tab('documents'),
        tab('tasks'),
        tab('profile'),
      ].filter(Boolean);
    case 'paralegal':
      // Per updated requirement Paralegals have no access to cases or documents
      return [
        tab('home'),
        tab('tasks'),
        tab('profile'),
      ].filter(Boolean);
    case 'staff':
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

// Map a role string to its route group name (folder under app/).
// Returns one of: 'admin' | 'lawyer' | 'paralegal' | 'staff' | null (unknown)
export function roleToGroup(role) {
  if (!role) return null;
  const normalized = String(role).toLowerCase();
  switch (normalized) {
    case 'admin':
      return 'admin';
    case 'lawyer':
      return 'lawyer';
    case 'paralegal':
      return 'paralegal';
    case 'staff':
      return 'staff';
    default:
      return null;
  }
}
