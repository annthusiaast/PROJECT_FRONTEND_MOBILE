import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ModalWrapper from './common/modal-wrapper';
import { getEndpoint } from '../constants/api-config';

const EditClientModal = ({ visible, client, onClose, onSaved, getUserFullName }) => {
	const [first, setFirst] = useState('');
	const [middle, setMiddle] = useState('');
	const [last, setLast] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [status, setStatus] = useState('Active');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (visible && client) {
			const parts = (client.client_fullname || '').trim().split(/\s+/).filter(Boolean);
			let f = '', m = '', l = '';
			if (parts.length === 1) f = parts[0];
			else if (parts.length === 2) { f = parts[0]; l = parts[1]; }
			else if (parts.length > 2) { f = parts[0]; l = parts[parts.length - 1]; m = parts.slice(1, -1).join(' '); }
			setFirst(f); setMiddle(m); setLast(l);
			setEmail(client.client_email || '');
			setPhone(client.client_phonenum || '');
			setAddress(client.client_address || '');
			setStatus(client.client_status || 'Active');
		} else if (!visible) {
			setFirst(''); setMiddle(''); setLast(''); setEmail(''); setPhone(''); setAddress(''); setStatus('Active');
		}
	}, [visible, client]);

	const combinedName = [first, middle, last].filter(Boolean).join(' ').trim();

	const handleSave = async () => {
		if (!client) return;
		setSubmitting(true);
		try {
			await fetch(getEndpoint(`/clients/${client.client_id}`), {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					client_fullname: combinedName || client.client_fullname,
					client_email: email,
					client_status: status,
					client_phonenum: phone,
					client_address: address,
				}),
			});
			onClose && onClose();
			onSaved && onSaved();
		} catch (e) {
			console.error('Update error:', e);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ModalWrapper visible={visible} onClose={onClose} animationType="fade">
			<Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>Edit Client</Text>
			<Text style={{ fontSize: 12, fontWeight: '600' }}>First Name</Text>
			<TextInput style={inputStyle} value={first} onChangeText={setFirst} editable={!submitting} placeholder="First Name" />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Middle Name(s)</Text>
			<TextInput style={inputStyle} value={middle} onChangeText={setMiddle} editable={!submitting} placeholder="Middle Name(s)" />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Last Name</Text>
			<TextInput style={inputStyle} value={last} onChangeText={setLast} editable={!submitting} placeholder="Last Name" />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Email</Text>
			<TextInput style={inputStyle} value={email} onChangeText={setEmail} editable={!submitting} keyboardType="email-address" placeholder="Email" />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Phone</Text>
			<TextInput style={inputStyle} value={phone} onChangeText={setPhone} editable={!submitting} keyboardType="phone-pad" placeholder="Phone" />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Address</Text>
			<TextInput style={[inputStyle, { minHeight: 44 }]} value={address} onChangeText={setAddress} editable={!submitting} placeholder="Address" multiline />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Created By</Text>
			<TextInput style={[inputStyle, { backgroundColor: '#f2f2f2', color: '#555' }]} value={client ? getUserFullName(client.created_by) : ''} editable={false} />
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Status</Text>
			<TouchableOpacity style={[inputStyle, { justifyContent: 'center' }]} disabled={submitting} onPress={() => setStatus(prev => prev === 'Active' ? 'Inactive' : 'Active')}>
				<Text>{status}</Text>
			</TouchableOpacity>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
				<TouchableOpacity onPress={onClose} disabled={submitting} style={{ backgroundColor: '#ccc', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 }}>
					<Text>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleSave} disabled={submitting} style={{ backgroundColor: '#114d89', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, opacity: submitting ? 0.7 : 1 }}>
					<Text style={{ color: '#fff', fontWeight: '600' }}>{submitting ? 'Saving...' : 'Save'}</Text>
				</TouchableOpacity>
			</View>
		</ModalWrapper>
	);
};

const inputStyle = {
	borderWidth: 1,
	borderColor: '#ccc',
	borderRadius: 6,
	marginBottom: 10,
	padding: 8,
	backgroundColor: '#fff'
};

export default EditClientModal;
