import TabsLayout from "../(tabs)/_layout";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import React from "react";

export default function AdminLayout() {
	const { user } = useAuth();
	// Only allow admins to render this group; others will be redirected by ProtectedRoute below
	return (
		<ProtectedRoute allowedGroups={["admin"]}>
			<TabsLayout />
		</ProtectedRoute>
	);
}
