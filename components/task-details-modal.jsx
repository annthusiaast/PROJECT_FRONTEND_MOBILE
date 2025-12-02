import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import ModalWrapper from './common/modal-wrapper';
import { Calendar, FileText, User, X, Upload, Trash2 } from 'lucide-react-native';
import API_CONFIG from '@/constants/api-config';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '@/context/auth-context';

function formatDate(value) {
  if (!value) return 'N/A';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return String(value);
  }
}

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      const parts = value.split(',').map((v) => v.trim()).filter(Boolean);
      if (parts.length) return parts;
    }
    return [value];
  }
  return [];
};

export default function TaskDetailsModal({ visible, onClose, task, viewerRole, onTaskUpdated }) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  if (!task) return null;
  const {
    title,
    description,
    assignedTo,
    assignedToName,
    assignedById,
    assignedByName,
    dueDate,
    status,
    raw,
  } = task;

  const assignedByDisplay = assignedByName || (assignedById ? `User ${assignedById}` : 'Unknown');
  const assignedToDisplay = assignedToName || (assignedTo ? assignedTo : 'Unassigned');
  const normalizedRole = String(viewerRole || '').toLowerCase();
  const assignmentLabel = (normalizedRole === 'lawyer' || normalizedRole === 'admin') 
    ? 'Assigned to' 
      : 'Assigned by';

  const assignmentValue = (normalizedRole === 'lawyer' || normalizedRole === 'admin') 
    ? assignedToDisplay 
      : assignedByDisplay;


  const origin = String(API_CONFIG.BASE_URL || '').replace('/api', '');
  const fileUrl = raw?.doc_file ? `${origin}${raw.doc_file}` : null;
  const referenceEntries = toArray(raw?.doc_reference);
  const referenceDocs = referenceEntries
    .map((entry, index) => {
      if (!entry) return null;
      if (typeof entry === 'string') {
        const normalized = entry.replace(/\\/g, '/');
        const url = normalized.startsWith('http') ? normalized : `${origin}${normalized}`;
        const label = normalized.split('/').pop() || `Reference ${index + 1}`;
        return { url, label };
      }
      if (typeof entry === 'object') {
        const rawUrl = entry.url || entry.link || entry.path || '';
        if (!rawUrl) return null;
        const normalized = String(rawUrl).replace(/\\/g, '/');
        const url = normalized.startsWith('http') ? normalized : `${origin}${normalized}`;
        const label = entry.name || entry.label || normalized.split('/').pop() || `Reference ${index + 1}`;
        return { url, label };
      }
      return null;
    })
    .filter(Boolean);

  const Badge = () => (
    <View style={{ backgroundColor: status === 'done' || status === 'completed' ? '#2d6a4f' : '#1e3a8a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{(status || 'ACTIVE').toString().toUpperCase()}</Text>
    </View>
  );

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB.');
          return;
        }
        setSelectedFile(file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !task?.raw?.doc_id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('doc_file', {
        uri: selectedFile.uri,
        type: selectedFile.mimeType || 'application/pdf',
        name: selectedFile.name,
      });
      formData.append('doc_status', 'available');
      formData.append('doc_submitted_by', user?.user_id || '');

      const res = await fetch(`${API_CONFIG.BASE_URL}/documents/${task.raw.doc_id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Upload failed');
      }

      Alert.alert('Success', 'Document uploaded successfully!');
      setSelectedFile(null);
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <ModalWrapper visible={visible} onClose={onClose} animationType="fade">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '800', color: '#0B3D91' }} numberOfLines={2}>{title || 'Task Details'}</Text>
        <Badge />
        <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
          <X size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 12 }} />

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Calendar size={16} color="#333" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: '#333' }}>Due: {formatDate(dueDate)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <User size={16} color="#333" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: '#333' }}>{assignmentLabel}: {assignmentValue}</Text>
        </View>
        {raw?.doc_type ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FileText size={16} color="#333" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 14, color: '#333' }}>Type: {raw.doc_type}</Text>
          </View>
        ) : null}
        {raw?.case_id ? (
          <Text style={{ fontSize: 14, color: '#333' }}>Case: #{raw.case_id}</Text>
        ) : null}
      </View>

      <View style={{ height: 14 }} />

      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Description</Text>
      <Text style={{ fontSize: 14, color: '#111827' }}>{description || 'No description provided.'}</Text>

      {referenceDocs.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Reference Docs</Text>
          <View style={{ gap: 8 }}>
            {referenceDocs.map((ref, idx) => (
              <TouchableOpacity
                key={ref.url || idx}
                onPress={() => Linking.openURL(ref.url).catch(() => {})}
                style={{
                  borderWidth: 1,
                  borderColor: '#1E3A8A',
                  backgroundColor: '#f8f9fe',
                  borderRadius: 6,
                  paddingVertical: 9,
                  paddingHorizontal: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: '#0e0e0e', fontWeight: '500', flex: 1 }} numberOfLines={1}>{ref.label}</Text>
                <FileText size={16} color="#1E3A8A" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {fileUrl ? (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
          <TouchableOpacity
            onPress={() => Linking.openURL(fileUrl).catch(() => {})}
            style={{
              borderWidth: 1,
              borderColor: '#1E3A8A',
              backgroundColor: '#f3f5fa',
              borderRadius: 6,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FileText size={16} color="#1E3A8A" />
            <Text style={{ color: '#0e0e0e', fontWeight: '600' }}>Open Document</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Upload Section - Only show if task is not completed and user is the assignee */}
      {(status !== 'done' && status !== 'completed' && 
        (normalizedRole === 'paralegal' || normalizedRole === 'staff') && 
        String(task?.assignedTo) === String(user?.user_id)) && (
        <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            Upload Completed Document
          </Text>

          {selectedFile ? (
            <View style={{ 
              backgroundColor: '#f9fafb', 
              borderRadius: 8, 
              padding: 12, 
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <FileText size={18} color="#1E3A8A" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 14, color: '#111827', flex: 1 }} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={removeSelectedFile} style={{ marginLeft: 8 }}>
                  <Trash2 size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handlePickDocument}
              disabled={uploading}
              style={{
                flex: 1,
                backgroundColor: '#f3f4f6',
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: uploading ? 0.5 : 1,
              }}
            >
              <Upload size={18} color="#374151" />
              <Text style={{ color: '#374151', fontWeight: '600', fontSize: 14 }}>
                {selectedFile ? 'Change File' : 'Select File'}
              </Text>
            </TouchableOpacity>

            {selectedFile && (
              <TouchableOpacity
                onPress={handleUploadDocument}
                disabled={uploading}
                style={{
                  flex: 1,
                  backgroundColor: '#1e3a8a',
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Upload size={18} color="#fff" />
                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Upload</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            * PDF files only, max 10MB
          </Text>
        </View>
      )}
    </ModalWrapper>
  );
}
