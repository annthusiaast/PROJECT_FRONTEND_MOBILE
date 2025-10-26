import { Redirect } from "expo-router";

// Paralegal does not have access to Cases. Redirect to Home silently.
export default function ParalegalCases() {
	return <Redirect href="/(tabs)/home" />;
}