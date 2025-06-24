import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { formattedDate } from "@/utils/DateFormat";
import HeaderConfig from "@/utils/HeaderConfig";
import { getAttendance } from "@/utils/query";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const attendanceDetails = () => {
	HeaderConfig("Attendance");

	const { subjectId, role } = useLocalSearchParams<{
		subjectId: string;
		role: string;
	}>();
	const [attendanceList, setAttendanceList] = useState<
		{ id: string; date: string; date_created: string; date_updated?: string }[]
	>([]);
	const [loading, setLoading] = useState(true);

	const handleAttendanceSelect = (attendanceId: string) => {
		router.push({
			pathname: "/subject/(sub-details)/AddAttendance",
			params: { subjectId: subjectId, attendanceId: attendanceId },
		});
	};

	useEffect(() => {
		const fetchAttendance = async () => {
			const res = await getAttendance(subjectId);
			if (res?.success && res.attendance) {
				const mapped = Object.entries(res.attendance).map(
					([id, details]: any) => ({
						id,
						date: details.date,
						date_created: details.date_created,
						date_updated: details.date_updated ?? null,
					})
				);
				setAttendanceList(mapped);
				setLoading(false);
			}
		};

		fetchAttendance();
	}, []);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#fff",
				}}
			>
				<LoadingCard></LoadingCard>
			</View>
		);
	}

	return (
		<View style={[globalStyles.container, { flex: 1 }]}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50 }}
			>
				<View style={styles.content}>
					{role === "teacher" && (
						<TouchableOpacity
							style={styles.addButton}
							onPress={() =>
								router.push({
									pathname: "/subject/(sub-details)/AddAttendance",
									params: { subjectId },
								})
							}
						>
							<View
								style={{
									top: 20,
									alignSelf: "center",
									flexDirection: "row",
								}}
							>
								<Ionicons name="add-circle" size={20} color="#ffbf18" />
								<Text style={styles.addText}>Add Attendance</Text>
							</View>
						</TouchableOpacity>
					)}
					{attendanceList.length > 0 ? (
						attendanceList.map((item) => (
							<TouchableOpacity
								style={[
									globalStyles.cardContainer,
									{ flexDirection: "row", alignItems: "center" },
								]}
								key={item.id}
								onPress={() => handleAttendanceSelect(item.id)}
							>
								<View style={styles.yellowBulletin}></View>
								<Text>{formattedDate(item.date)}</Text>
							</TouchableOpacity>
						))
					) : (
						<Text style={styles.emptyText}>No attendance records yet.</Text>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 20,
		backgroundColor: "#fff",
	},
	content: {
		rowGap: 10,
	},
	emptyText: {
		textAlign: "center",
		marginTop: 30,
		fontSize: 16,
		color: "#666",
	},
	addButton: {
		left: -28,
		width: "98%",
		backgroundColor: "#fcefcc",
		borderColor: "#ffbf18",
		borderWidth: 2,
		borderRadius: 20,
		borderStyle: "dashed",
		margin: 30,
		marginBottom: 20,
		height: 60,
		marginVertical: 5,
	},
	addText: {
		color: "#ffbf18",
		fontWeight: 500,
		marginHorizontal: 10,
	},
	yellowBulletin: {
		borderColor: "#FFBF18",
		backgroundColor: "#FFBF18",
		borderWidth: 2.5,
		borderRadius: 100,
		marginLeft: -15,
		marginRight: 15,
		height: 30,
	},
});

export default memo(attendanceDetails);
