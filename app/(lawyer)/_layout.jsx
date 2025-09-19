import TabsLayout from "../(tabs)/_layout";
import ProtectedRoute from "@/components/protected-route";
import React from "react";

export default function LawyerLayout() {
	return (
		<ProtectedRoute allowedGroups={["lawyer"]}>
			<TabsLayout />
		</ProtectedRoute>
	);
}
