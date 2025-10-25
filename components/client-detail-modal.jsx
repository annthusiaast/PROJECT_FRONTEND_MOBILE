import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ModalWrapper from './common/modal-wrapper';

const statusColor = (status) => {
	if (status === 'Active') return '#16a34a';
	if (status === 'Removed') return '#dc2626';
	return '#64748b';
};

const InfoRow = ({ label, value, multiLine }) => (
	<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
		<Text style={{ color: '#6b7280', fontWeight: '700' }}>{label}</Text>
		<Text
			style={{ color: '#111827', fontWeight: label === 'Email' ? '600' : '400', flex: multiLine ? 1 : undefined, textAlign: multiLine ? 'right' : 'left', paddingLeft: multiLine ? 12 : 0 }}
			numberOfLines={multiLine ? 4 : 1}
		>
			{value || '—'}
		</Text>
	</View>
);

const ClientDetailModal = ({ visible, onClose, client, contacts, getUserFullName }) => {
	if (!client) return null;
	const clientContacts = contacts.filter(c => c.client_id === client.client_id);
	return (
		<ModalWrapper visible={visible} onClose={onClose} animationType="fade">
			<View style={{ marginBottom: 8 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', flex: 1, paddingRight: 8 }}>
						{client.client_fullname}
					</Text>
					<View style={{ backgroundColor: statusColor(client.client_status), paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 }}>
						<Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
							{client.client_status || 'Unknown'}
						</Text>
					</View>
				</View>
			</View>
			<ScrollView style={{ maxHeight: '75%' }} showsVerticalScrollIndicator={false}>
				<View style={{ gap: 12 }}>
					<View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, backgroundColor: '#f9fafb' }}>
						<InfoRow label="Email" value={client.client_email} />
						<InfoRow label="Phone" value={client.client_phonenum} />
						<InfoRow label="Address" value={client.client_address} multiLine />
						<InfoRow label="Lawyer" value={client.user_id == null ? 'N/A' : getUserFullName(client.user_id)} />
						<InfoRow label="Created By" value={getUserFullName(client.created_by)} />
					</View>
					<View>
						<Text style={{ fontWeight: '800', marginBottom: 6, color: '#111827' }}>Contacts</Text>
						{clientContacts.length === 0 ? (
							<Text style={{ fontStyle: 'italic', color: '#6b7280' }}>No contacts.</Text>
						) : (
							<View style={{ gap: 8 }}>
								{clientContacts.map(c => (
									<View key={c.contact_id || c.contact_email} style={{ borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
										<Text style={{ fontWeight: '700', marginBottom: 2 }}>{c.contact_fullname}</Text>
										<Text style={{ color: '#374151', marginBottom: 2 }}>{c.contact_email}</Text>
										{c.contact_phone ? (
											<Text style={{ color: '#6b7280', fontSize: 12 }}>{c.contact_phone}</Text>
										) : null}
									</View>
								))}
							</View>
						)}
					</View>
				</View>
			</ScrollView>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 14 }}>
				<TouchableOpacity
					onPress={onClose}
					style={{ backgroundColor: '#114d89', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 }}
					activeOpacity={0.85}
				>
					<Text style={{ color: '#fff', fontWeight: '700' }}>Close</Text>
				</TouchableOpacity>
			</View>
		</ModalWrapper>
	);
};

export default ClientDetailModal;
