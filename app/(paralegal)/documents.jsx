import { Redirect } from "expo-router";

// Paralegal does not have access to Documents. Redirect to Home silently.
export default function ParalegalDocuments() {
	return <Redirect href="/(tabs)/home" />;
}