import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getEndpoint } from '@/constants/api-config';
import { useAuth } from '@/context/auth-context';

// Utility: PHP currency formatting with graceful fallback
const formatPHP = (amount) => {
  const n = Number(amount);
  if (!isFinite(n)) return '₱0.00';
  try {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(n);
  } catch {
    return `₱${n.toFixed(2)}`;
  }
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return d.toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

// Props:
// - visible: boolean
// - onClose: () => void
// - caseId?: string|number  -> when present, fetch payments scoped to this case
// - title?: string          -> optional header suffix
export default function PaymentsModal({ visible, onClose, caseId, title }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [selected, setSelected] = useState(null); // details view

  const role = useMemo(() => (user?.user_role || user?.role || '').toLowerCase(), [user]);
  const userId = user?.user_id || user?.id;

  useEffect(() => {
    if (!visible) return;
    let aborted = false;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        let url;
        if (caseId) {
          url = getEndpoint(`/payments/case/${caseId}`);
        } else if (role.includes('admin')) {
          url = getEndpoint('/payments');
        } else if (userId) {
          url = getEndpoint(`/payments/lawyer/${userId}`);
        } else {
          // Fallback to all if role is unknown
          url = getEndpoint('/payments');
        }

        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load payments');
        const data = await res.json();
        if (aborted) return;
        const mapped = Array.isArray(data)
          ? data.map((p, idx) => ({
              id: String(p.payment_id || p.id || idx),
              payment_id: p.payment_id ?? p.id ?? null,
              case_id: p.case_id ?? p.c_id ?? null,
              amount: Number(p.payment_amount ?? p.amount ?? 0),
              type: p.payment_type || p.type || '—',
              date: p.payment_date || p.date || p.created_at || null,
              client_fullname:
                (p.client_fullname) ||
                ([p.client_fname, p.client_lname].filter(Boolean).join(' ') || 'Unknown Client'),
              added_by:
                (p.user_fullname) ||
                ([p.user_fname, p.user_lname].filter(Boolean).join(' ') || '—'),
              raw: p,
            }))
          : [];
        setPayments(mapped);
        setPage(1);
      } catch (e) {
        if (aborted) return;
        setError(e.message || 'Unable to load payments');
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchPayments();
    return () => {
      aborted = true;
    };
  }, [visible, caseId, role, userId]);

  const dataSlice = useMemo(() => payments.slice(0, PAGE_SIZE * page), [payments, page]);

  const loadMore = () => {
    if (dataSlice.length < payments.length) {
      setPage((p) => p + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => setSelected(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.amount}>{formatPHP(item.amount)}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta} numberOfLines={1}>Client: {item.client_fullname}</Text>
        <Text style={styles.meta}>Case #{item.case_id ?? '—'}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Date: {formatDateTime(item.date)}</Text>
        <Text style={styles.meta} numberOfLines={1}>Added by: {item.added_by}</Text>
      </View>
      <Text style={styles.viewLink}>View details</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.headerRow}>
                <Text style={styles.title}>Payments {caseId ? `(Case #${caseId})` : title ? `- ${title}` : ''}</Text>
                <TouchableOpacity onPress={onClose} accessibilityLabel="Close payments">
                  <Text style={styles.close}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Body */}
              {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator color="#0B3D91" />
                </View>
              ) : error ? (
                <View style={{ paddingVertical: 8 }}>
                  <Text style={{ color: '#b00020' }}>{error}</Text>
                </View>
              ) : (
                <FlatList
                  data={dataSlice}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  onEndReachedThreshold={0.4}
                  onEndReached={loadMore}
                  ListEmptyComponent={
                    <View style={{ paddingVertical: 10 }}>
                      <Text style={{ color: '#555' }}>No payments found.</Text>
                    </View>
                  }
                />
              )}

              {/* Details submodal */}
              <Modal visible={!!selected} animationType="fade" transparent>
                <TouchableWithoutFeedback onPress={() => setSelected(null)}>
                  <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                      <View style={styles.detailsCard}>
                        <View style={styles.headerRow}>
                          <Text style={styles.detailsTitle}>Payment Details</Text>
                          <TouchableOpacity onPress={() => setSelected(null)}>
                            <Text style={styles.close}>×</Text>
                          </TouchableOpacity>
                        </View>
                        {selected && (
                          <View>
                            <Text style={styles.detailsLine}>Payment ID: <Text style={styles.detailsStrong}>{selected.payment_id ?? selected.id}</Text></Text>
                            <Text style={styles.detailsLine}>Client: <Text style={styles.detailsStrong}>{selected.client_fullname}</Text></Text>
                            <Text style={styles.detailsLine}>Case ID: <Text style={styles.detailsStrong}>{selected.case_id ?? '—'}</Text></Text>
                            <Text style={styles.detailsLine}>Amount: <Text style={styles.detailsStrong}>{formatPHP(selected.amount)}</Text></Text>
                            <Text style={styles.detailsLine}>Type: <Text style={styles.detailsStrong}>{selected.type}</Text></Text>
                            <Text style={styles.detailsLine}>Date: <Text style={styles.detailsStrong}>{formatDateTime(selected.date)}</Text></Text>
                            <Text style={styles.detailsLine}>Added by: <Text style={styles.detailsStrong}>{selected.added_by}</Text></Text>
                          </View>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 12,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    maxHeight: '90%',
    minHeight: 200,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0B3D91', flex: 1 },
  close: { fontSize: 30, color: '#999', paddingHorizontal: 6 },
  row: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  amount: { fontSize: 16, fontWeight: '800', color: '#0c8744' },
  type: { fontSize: 12, color: '#475467' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  meta: { fontSize: 12, color: '#555', maxWidth: '60%' },
  viewLink: { marginTop: 8, color: '#1e90ff', textDecorationLine: 'underline', alignSelf: 'flex-start' },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  detailsTitle: { fontSize: 16, fontWeight: '800', color: '#0B3D91', flex: 1 },
  detailsLine: { fontSize: 14, color: '#333', marginTop: 6 },
  detailsStrong: { fontWeight: '700', color: '#000' },
});
