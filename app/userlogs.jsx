import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { getEndpoint } from '@/constants/api-config';
import LogDetailsModal from '@/components/log-details-modal';

export default function UserLogsScreen() {
	const router = useRouter();
	const { user } = useAuth();

	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [showLogDetails, setShowLogDetails] = useState(false);
	const [selectedLog, setSelectedLog] = useState(null);

	useEffect(() => {
		const fetchLogs = async () => {
			if (!user?.user_id) return;
			setLoading(true);
			try {
				const res = await fetch(getEndpoint(`/user-logs/${user.user_id}`), {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				});
				if (!res.ok) throw new Error('Failed to fetch logs');
				const data = await res.json();
				const mapped = Array.isArray(data)
					? data.map((l, idx) => ({
							id: l.user_log_id || l.log_id || idx,
							action:
								l.user_log_description ||
								l.user_log_action ||
								l.description ||
								l.action ||
								'Activity',
							time:
								l.user_log_time ||
								l.user_log_datetime ||
								l.timestamp ||
								l.created_at ||
								l.time ||
								new Date().toISOString(),
							raw: l,
						}))
					: [];
				setLogs(mapped);
			} catch (err) {
				console.warn('Error fetching logs', err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchLogs();
	}, [user?.user_id]);

	const filteredLogs = useMemo(() => {
		const q = searchText.trim().toLowerCase();
		if (!q) return logs;
		return logs.filter((l) =>
			[l.action, l.time]
				.filter(Boolean)
				.some((v) => String(v).toLowerCase().includes(q))
		);
	}, [logs, searchText]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
			{/* Header */}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 16,
					paddingVertical: 12,
				}}
			>
				<TouchableOpacity onPress={() => router.back()}>
					<ArrowLeft size={24} color="#0B3D91" />
				</TouchableOpacity>
				<Text
					style={{
						flex: 1,
						textAlign: 'center',
						fontSize: 18,
						fontWeight: '1000',
						color: '#0B3D91',
					}}
				>
					Activity Logs
				</Text>
				<View style={{ width: 24 }} />
			</View>

			{/* Search */}
			<View
				style={{
					marginHorizontal: 16,
					marginTop: 8,
					backgroundColor: '#f0f2f5',
					borderRadius: 10,
					paddingHorizontal: 14,
					paddingVertical: Platform.OS === 'ios' ? 10 : 6,
					flexDirection: 'row',
					alignItems: 'center',
					elevation: 2,
				}}
			>
				<TextInput
					placeholder="Search activity..."
					placeholderTextColor="#888"
					value={searchText}
					onChangeText={setSearchText}
					style={{ fontSize: 14, flex: 1, color: '#333' }}
				/>
			</View>

			{loading ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator color="#0B3D91" />
				</View>
			) : (
				<ScrollView contentContainerStyle={{ padding: 16 }}>
					{filteredLogs.length > 0 ? (
						filteredLogs.map((log) => (
							<View
								key={log.id}
								style={{
									backgroundColor: '#f9f9f9',
									borderRadius: 12,
									padding: 14,
									marginBottom: 12,
									flexDirection: 'row',
									alignItems: 'flex-start',
									gap: 12,
									shadowColor: '#000',
									shadowOpacity: 0.05,
									shadowOffset: { width: 0, height: 2 },
									shadowRadius: 4,
									elevation: 2,
								}}
							>
								<Clock size={20} color="#0B3D91" style={{ marginTop: 2 }} />
								<TouchableOpacity
									style={{ flex: 1 }}
									activeOpacity={0.7}
									onPress={() => {
										setSelectedLog(log.raw || log);
										setShowLogDetails(true);
									}}
								>
									<Text
										style={{
											fontSize: 15,
											fontWeight: '600',
											color: '#0B3D91',
											marginBottom: 4,
										}}
									>
										{log.action}
									</Text>
									<Text style={{ fontSize: 13, color: '#555' }}>{log.time}</Text>
								</TouchableOpacity>
							</View>
						))
					) : (
						<View style={{ paddingVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: '#999', fontSize: 14 }}>No activity logs found.</Text>
						</View>
					)}
				</ScrollView>
			)}

			{/* Log Details Modal */}
			<LogDetailsModal visible={showLogDetails} onClose={() => setShowLogDetails(false)} log={selectedLog} />
		</SafeAreaView>
	);
}
