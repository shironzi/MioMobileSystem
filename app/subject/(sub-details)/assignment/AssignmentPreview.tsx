import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createAssignment, editAssignment } from "@/utils/query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Params = {
	subjectId: string;
	availabilityFrom: string;
	availabilityTo: string;
	deadline: string;
	title: string;
	description: string;
	attempt: string;
	points: string;
	submissionType: string;
	assignmentId: string;
};

const AssignmentPreview = () => {
	useHeaderConfig("Preview");

	const router = useRouter();

	const {
		subjectId,
		availabilityFrom,
		availabilityTo,
		deadline,
		title,
		description,
		attempt,
		points,
		submissionType,
		assignmentId,
	} = useLocalSearchParams<Params>();

	const handleCreateAssignment = async () => {
		let isSuccess = false;
		if (assignmentId !== null) {
			const res = await editAssignment(
				subjectId,
				{ start: availabilityFrom, end: availabilityTo },
				title,
				description,
				parseInt(attempt),
				submissionType,
				deadline,
				parseInt(points)
			);

			isSuccess = res.success;

			console.log(res);
		} else {
			try {
				const res = await createAssignment(
					subjectId,
					{ start: availabilityFrom, end: availabilityTo },
					title,
					description,
					parseInt(attempt),
					submissionType,
					deadline,
					parseInt(points)
				);
				isSuccess = res.success;

				console.log(res);
			} catch (err) {
				console.error(err);
			}
		}

		if (!isSuccess) return;

		router.back();
		router.back();
	};

	return (
		<View style={styles.container}>
			{/* <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        Preview Assignment for Subject {subjectId}
      </Text> */}
			<Text style={styles.label}>Title</Text>
			<Text style={[styles.text, { top: 5 }]}>{title}</Text>
			<Text style={styles.label}>Description</Text>
			<Text style={[styles.text, { top: 5 }]}>{description}</Text>
			<Text style={styles.label}>Submission Type</Text>
			<Text style={[styles.text, { top: 5 }]}>{submissionType}</Text>
			<Text style={styles.label}>Attempts Allowed</Text>
			<Text style={[styles.text, { top: 5 }]}>{attempt}</Text>
			<Text style={styles.label}>Points</Text>
			<Text style={[styles.text, { top: 5 }]}>{points}</Text>
			<Text style={styles.label}>Available From</Text>
			<Text style={[styles.text, { top: 5 }]}>{availabilityFrom}</Text>
			<Text style={styles.label}>Available To</Text>
			<Text style={[styles.text, { top: 5 }]}>{availabilityTo}</Text>
			<Text style={styles.label}>Deadline</Text>
			<Text style={[styles.text, { top: 5 }]}>{deadline}</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					top: 10,
					marginTop: 20,
					// marginBottom: 20,
					elevation: 5,
				}}
			>
				<TouchableOpacity
					style={[
						globalStyles.submitButton,
						{
							width: "49%",
							borderWidth: 1,
							borderColor: "#ffbf18",
							backgroundColor: "#fff",
							elevation: 5,
							// // padding: 10,
							// paddingVertical: 10,
							// borderRadius: 40,
						},
					]}
					onPress={() => router.back()}
				>
					<Text
						style={[
							globalStyles.submitButtonText,
							{ color: "#ffbf18", fontSize: 16 },
						]}
					>
						Cancel
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[globalStyles.submitButton, { width: "49%", elevation: 5 }]}
					onPress={handleCreateAssignment}
				>
					<Text
						style={[
							globalStyles.submitButtonText,
							// { color: "#ffbf18", top: 5, fontSize: 16 },
						]}
					>
						Save
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
		margin: 20,
		borderRadius: 10,
		elevation: 5,
	},
	label: {
		fontWeight: 600,
		marginTop: 12,
		fontSize: 18,
		color: "#2264dc",
	},
	text: {
		marginTop: 4,
		fontSize: 16,
		color: "#333",
	},
});

export default memo(AssignmentPreview);
