import { Redirect } from "expo-router";

// Staff does not have access to Documents. Redirect to Home silently.
export default function StaffDocuments() {
	return <Redirect href="/(tabs)/home" />;
}