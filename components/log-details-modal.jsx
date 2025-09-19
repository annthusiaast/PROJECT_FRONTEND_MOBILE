import React from 'react';
import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, FileText, MapPin, User2Icon, Info } from 'lucide-react-native';

// A small formatter for date/time
const formatDateTime = (value) => {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value || '');
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date} • ${time}`;
  } catch {
    return String(value || '');
  }
};

// Extract common fields regardless of shape
const normalizeLog = (log) => {
  if (!log) return {};
  return {
    id: log.id || log.user_log_id || log.log_id,
    description:
      log.user_log_description || log.description || log.action || log.user_log_action || 'Activity',
    type: log.user_log_type || log.type,
    datetime:
      log.user_log_datetime || log.time || log.timestamp || log.created_at || log.user_log_time,
    ip: log.user_ip_address || log.ip,
    fullname: log.user_fullname || log.fullname,
  };
};

const LogDetailsModal = ({ visible, onClose, log }) => {
  const n = normalizeLog(log);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onClose}>
            <ArrowLeft size={24} color="#0B3D91" />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#0B3D91' }}>
            Activity Details
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          {/* Description */}
          <View style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, flexDirection: 'row', gap: 12 }}>
            <Info size={20} color="#0B3D91" style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, color: '#0B3D91', fontWeight: '600', marginBottom: 4 }}>Description</Text>
              <Text style={{ fontSize: 14, color: '#334155' }}>{n.description}</Text>
            </View>
          </View>

          {/* Type */}
          {n.type ? (
            <View style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, flexDirection: 'row', gap: 12 }}>
              <FileText size={20} color="#0B3D91" style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: '#0B3D91', fontWeight: '600', marginBottom: 4 }}>Type</Text>
                <Text style={{ fontSize: 14, color: '#334155' }}>{n.type}</Text>
              </View>
            </View>
          ) : null}

          {/* Time */}
          {n.datetime ? (
            <View style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, flexDirection: 'row', gap: 12 }}>
              <Clock size={20} color="#0B3D91" style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: '#0B3D91', fontWeight: '600', marginBottom: 4 }}>Date & Time</Text>
                <Text style={{ fontSize: 14, color: '#334155' }}>{formatDateTime(n.datetime)}</Text>
              </View>
            </View>
          ) : null}

          {/* User */}
          {n.fullname ? (
            <View style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, flexDirection: 'row', gap: 12 }}>
              <User2Icon size={20} color="#0B3D91" style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: '#0B3D91', fontWeight: '600', marginBottom: 4 }}>Performed By</Text>
                <Text style={{ fontSize: 14, color: '#334155' }}>{n.fullname}</Text>
              </View>
            </View>
          ) : null}

          {/* IP */}
          {n.ip ? (
            <View style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, flexDirection: 'row', gap: 12 }}>
              <MapPin size={20} color="#0B3D91" style={{ marginTop: Platform.OS === 'ios' ? 2 : 0 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: '#0B3D91', fontWeight: '600', marginBottom: 4 }}>IP Address</Text>
                <Text style={{ fontSize: 14, color: '#334155' }}>{n.ip}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LogDetailsModal;
