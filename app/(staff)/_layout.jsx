import TabsLayout from "../(tabs)/_layout";
import ProtectedRoute from "@/components/protected-route";
import React from "react";

export default function StaffLayout() {
	return (
		<ProtectedRoute allowedGroups={["staff"]}>
			<TabsLayout />
		</ProtectedRoute>
	);
}
