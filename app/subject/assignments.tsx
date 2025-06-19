import AssCard from "@/components/assignment/AssCard";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingCard from "@/components/loadingCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteAssignment, getAssignments } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Availability {
	start: string;
	deadline: string;
}

export interface Assignment {
	assignment_id: string;
	attempts: string;
	availability: Availability;
	createdAt: string;
	description: string;
	publishedAt: string;
	total: string;
	title: string;
	submission_type: string;
}

const assignments = () => {
	HeaderConfig("Assignments");

	const router = useRouter();

	const { subjectId, role } = useLocalSearchParams<{
		subjectId: string;
		role: string;
	}>();
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
	const [targetAssignment, setTargetAssignment] = useState<string | null>(null);

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				const response = await getAssignments(subjectId);
				setAssignments(response.assignments);
				setLoading(false);
			} catch (err) {
				console.error("Fetch assignment error: ", err);
				useAuthGuard(err);
			}
		};

		fetchAssignments();
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

	const handleDelete = async () => {
		if (targetAssignment === null) return;

		console.log(targetAssignment);

		try {
			const res = await deleteAssignment(subjectId, targetAssignment);

			console.log(res);
			setDeleteConfirm(false);
			setTargetAssignment(null);
		} catch (err) {
			console.error("Deleting error: " + err);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.content}>
					{assignments.length > 0 ? (
						<View style={{ rowGap: 15 }}>
							{assignments.map((item) => (
								<GestureHandlerRootView key={item.assignment_id}>
									<AssCard
										subjectId={subjectId}
										title={item.title}
										description={item.description}
										availability={item.availability}
										createdAt={item.createdAt}
										totalPoints={item.total}
										attempts={item.attempts}
										assignment_id={item.assignment_id}
										submission_type={item.submission_type}
										role={role}
										handleDelete={() => {
											setDeleteConfirm(true);
											setTargetAssignment(item.assignment_id);
										}}
									/>
								</GestureHandlerRootView>
							))}
						</View>
					) : (
						<View>
							<Text>This subject has no assignments yet.</Text>
						</View>
					)}
				</View>
			</ScrollView>

			<ConfirmationModal
				isVisible={deleteConfirm}
				description={"Are you sure you want to delete this assignment?"}
				cancelDisplay={"Cancel"}
				approveDisplay={"Delete"}
				handleCancel={() => setDeleteConfirm(false)}
				handleApprove={() => handleDelete()}
			/>

			{role === "teacher" && (
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => {
						router.push({
							pathname: "/subject/(sub-details)/assignment/addAssignment",
							params: { subjectId: subjectId },
						});
					}}
				>
					<MaterialIcon name="add" size={30} color="#fff" />
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		padding: 2,
		paddingVertical: 20,
	},
	headerStyle: {
		backgroundColor: "#2264DC",
	},
	addButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#2264DC",
		height: 60,
		width: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
});

export default memo(assignments);
