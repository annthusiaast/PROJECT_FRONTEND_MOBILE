import { styles } from "@/constants/styles/(tabs)/tasksBtn_styles";
import { User } from "lucide-react-native";
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator } from "react-native";
import { getEndpoint } from "@/constants/api-config";

// Fetches and displays all cases (Admin & Lawyer) or user-specific cases otherwise.
// Props: onCasePress (function), user (object with role & id)
const AllCase = ({ onCasePress, user, showArchived = false }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Decide endpoint based on role
  const buildEndpoint = () => {
    if (!user) return null;
    if (user.user_role === 'Admin') return getEndpoint('/cases');
    return getEndpoint(`/cases/user/${user.user_id}`);
  };

  const fetchCases = useCallback(async () => {
    const ep = buildEndpoint();
    if (!ep) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(ep, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch cases');
      const data = await res.json();
      // Normalize into UI shape expected by existing rendering
      const mapped = Array.isArray(data) ? data.map(c => {
        const rawStatus = (c.case_status || c.status || 'pending').toLowerCase();
        // Normalize archived statuses
        const isArchived = rawStatus.includes('archived');
        const normalizedStatus = isArchived ? 'archived' : rawStatus;
        
        return {
          id: c.case_id || c.id,
          case_id: c.case_id || c.id,
          title: c.case_title || c.ct_name || `Case #${c.case_id}`,
          description: c.case_remarks || c.case_description || c.description || '',
          status: normalizedStatus,
          rawStatus: c.case_status || c.status || 'pending',
          assignedTo: c.user_fname ? `${c.user_fname} ${c.user_lname || ''}`.trim() : c.assignedTo || 'Unassigned',
          client: c.client_fullname || c.client,
          dateFiled: c.case_date_created || c.dateFiled,
          lastUpdated: c.case_last_updated || c.lastUpdated,
          lawyerId: c.user_id,
          // Pass through all original fields for modal
          ...c,
        };
      }) : [];
      setCases(mapped);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCases().finally(() => setRefreshing(false));
  }, [fetchCases]);

  const statusColors = {
    all: "#000000",
    pending: "#656162ff",
    processing: "#3b82f6",
    completed: "#0c8744ff",
    archived: "#9ca3af",
  };

  const filteredCases = cases.filter((t) => {
    if (showArchived) {
      // Show only archived cases
      return t.status === 'archived';
    }
    // When not showing archived, exclude archived cases from "all"
    if (statusFilter === 'all') {
      return t.status !== 'archived';
    }
    return t.status === statusFilter;
  });

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ flex: 1, padding: 10 }}>
        {error && (
          <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        )}
        {loading && !refreshing && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator />
          </View>
        )}
        {/* Filter Buttons - Hide when showing archived */}
        {!showArchived && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            {Object.keys(statusColors).filter(s => s !== 'archived').map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.priorityBtn,
                  {
                    borderColor: statusColors[s],
                    backgroundColor:
                      statusFilter === s ? statusColors[s] : "transparent",
                  },
                ]}
                onPress={() => setStatusFilter(s)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.priorityBtnText,
                    { color: statusFilter === s ? "#fff" : "#000" },
                  ]}
                >
                  {s.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Archived Cases Header with Legend */}
        {showArchived && (
          <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
              Archived Cases
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#0c8744ff' }} />
                <Text style={{ fontSize: 10, color: '#6b7280' }}>Completed</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#9ca3af' }} />
                <Text style={{ fontSize: 10, color: '#6b7280' }}>Dismissed</Text>
              </View>
            </View>
          </View>
        )}

        {/* Cases List */}
        {filteredCases.length === 0 && !loading ? (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            {showArchived ? 'No archived cases found.' : 'No case found.'}
          </Text>
        ) : (
          filteredCases.map((t) => {
            const status = t.status || "pending";
            const displayStatus = showArchived && t.rawStatus ? t.rawStatus : status;
            const statusColor = showArchived 
              ? (displayStatus.toLowerCase().includes('completed') ? '#0c8744ff' : '#9ca3af')
              : (statusColors[status] || "#000");
            
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => onCasePress(t)}
                activeOpacity={0.85}
              >
                <View style={styles.taskCard}>
                  {/* Status Badge */}
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: statusColor },
                    ]}
                  >
                    <Text style={styles.priorityBadgeText}>
                      {displayStatus.toUpperCase()}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text style={styles.taskCardTitle}>{t.title || 'Untitled Case'}</Text>

                  {/* Description */}
                  <Text style={styles.taskCardDescription}>{t.description || 'No description provided.'}</Text>

                  {/* Assigned User + Client (for archived) */}
                  <View style={styles.assignedUser}>
                    <User size={16} color="#333" style={{ marginRight: 5 }} />
                    <Text style={styles.assignedUserText}>
                      {t.assignedTo || "Unassigned"}
                    </Text>
                  </View>
                  {showArchived && t.client && (
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                      Client: {t.client}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default AllCase;
