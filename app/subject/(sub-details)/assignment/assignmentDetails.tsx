import FileUpload from "@/components/FileUpload";
import MultipleChoiceQuestion from "@/components/assignment/MultipleChoiceQuestion";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface FileInfo {
	uri: string;
	name: string;
	mimeType?: string;
}

const assignmentDetails = () => {
	HeaderConfig("Assignment");

	const {
		title,
		deadline,
		availabilityStart,
		availabilityEnd,
		attempts,
		totalPoints,
		submission_type,
	} = useLocalSearchParams<{
		title: string;
		deadline: string;
		availabilityStart: string;
		availabilityEnd: string;
		attempts: string;
		totalPoints: string;
		submission_type: string;
	}>();

	const [descHeight, setDescHeight] = useState<number>(200);
	const [assignmentStatus, setAssignmentStatus] = useState<
		"notStarted" | "inProgress" | "completed"
	>("notStarted");
	const [answer, setAnswer] = useState<string | string[] | FileInfo[] | null>();
	const choices: Record<string, string>[] = [
		{ A: "choice 1" },
		{ B: "choice 2" },
		{ C: "choice 3" },
		{ D: "choice 4" },
	];
	const [showDropdown, setShowDropdown] = useState(false);

	const formatDateTime = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	const handleTakeAssignment = () => {
		// request from the backend first

		setAssignmentStatus("inProgress");
	};

	const handleSubmit = () => {
		console.log(answer);
	};

	const handleFileUpload = (files: FileInfo[]) => {
		setAnswer(files);
	};

	const handleChoice = (choice: string | string[]) => {
		setAnswer(choice);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 50 }}
			style={[globalStyles.container, { rowGap: 15 }]}
		>
			<View
				style={[
					globalStyles.cardContainer,
					{
						borderColor: "#ddd",
						borderWidth: 1,
						borderRadius: 20,
						paddingVertical: 10,
					},
				]}
			>
				<Text style={styles.title}>{title}</Text>
				<View style={styles.row}>
					<Text style={styles.deadline}>
						Deadline:{" "}
						{deadline === null || deadline === ""
							? "No Due Date"
							: formatDateTime(deadline)}
					</Text>
					<Text style={styles.points}>Points: {totalPoints}</Text>
				</View>
				<View style={styles.availabilityContainer}>
					<Text style={{ fontWeight: 300 }}>Availability: </Text>
					<Text style={styles.availability}>
						{formatDateTime(availabilityStart)} -{" "}
						{formatDateTime(availabilityEnd)}
					</Text>
				</View>

				<Text style={styles.attempt}>Attempts: {attempts}</Text>
				<Text style={{ fontWeight: 300 }}>
					Submission Type: {submission_type}
				</Text>
				{assignmentStatus !== "inProgress" ? (
					<TouchableOpacity
						style={[
							globalStyles.submitButton,
							{ marginVertical: 15, marginBottom: 5, alignSelf: "center" },
						]}
						onPress={handleTakeAssignment}
					>
						<Text style={globalStyles.submitButtonText}>Take Assignment</Text>
					</TouchableOpacity>
				) : null}
			</View>

			<View
				style={[
					globalStyles.cardContainer,
					globalStyles.cardBody,
					{
						minHeight: 100,
						borderColor: "#ddd",
						borderWidth: 1,
						borderRadius: 20,
						marginVertical: 15,
					},
				]}
			>
				<Text style={globalStyles.sectionHeader}>Question</Text>
				<Text
					style={{
						paddingHorizontal: 26,
						marginTop: 15,
					}}
				>
					What is your opinion about...?
				</Text>
				{assignmentStatus === "inProgress" ? (
					<View style={[globalStyles.contentPadding, { rowGap: 15 }]}>
						{submission_type === "quiz" ? (
							<MultipleChoiceQuestion
								choices={choices}
								handleChoice={handleChoice}
								allowsMultipleChoice={false}
							/>
						) : submission_type === "text" ? (
							<>
								{/*<TextInput*/}
								{/*  style={[globalStyles.inputContainer, { height: 50 }]}*/}
								{/*/>*/}
								<TextInput
									placeholder="Your Answer Here"
									onChangeText={setAnswer}
									style={[
										globalStyles.inputContainer,
										{ height: Math.max(200, descHeight), fontSize: 14 },
									]}
									multiline
									onContentSizeChange={(e) =>
										setDescHeight(e.nativeEvent.contentSize.height)
									}
									textAlignVertical="top"
								/>
							</>
						) : submission_type === "file" ? (
							<FileUpload handleFiles={handleFileUpload} />
						) : (
							<>
								{/* <Text>Error</Text> */}
								<TextInput
									placeholder="Type your answer here..."
									onChangeText={setAnswer}
									style={[
										globalStyles.inputContainer,
										{ height: Math.max(200, descHeight), fontSize: 14 },
									]}
									multiline
									onContentSizeChange={(e) =>
										setDescHeight(e.nativeEvent.contentSize.height)
									}
									textAlignVertical="top"
								/>
							</>
						)}
					</View>
				) : null}
			</View>
			<TouchableOpacity
				style={[globalStyles.submitButton, { alignSelf: "center" }]}
				onPress={handleSubmit}
			>
				<Text style={globalStyles.submitButtonText}>Submit</Text>
			</TouchableOpacity>
			{assignmentStatus !== "inProgress" ? (
				<View
					style={[
						globalStyles.cardContainer,
						{
							rowGap: 20,
							borderColor: "#ddd",
							borderWidth: 1,
							borderRadius: 20,
						},
					]}
				>
					<Text style={{ fontWeight: 500, fontSize: 16 }}>Latest Attempt</Text>
					<TouchableOpacity>
						<Text
							style={{
								color: "#2264dc",
								textDecorationColor: "#2264dc",
								textDecorationLine: "underline",
								marginVertical: -15,
								marginBottom: 5,
							}}
						>
							Dropdown (View Attempt)
						</Text>
						<MaterialIcons
							name={showDropdown ? "arrow-drop-up" : "arrow-drop-down"}
							style={styles.iconStyle}
						/>
					</TouchableOpacity>

					<TextInput
						placeholder="Answer..."
						style={[
							globalStyles.inputContainer,
							{ height: Math.max(200, descHeight), marginTop: -30 },
						]}
						multiline
						onContentSizeChange={(e) =>
							setDescHeight(e.nativeEvent.contentSize.height)
						}
						textAlignVertical="top"
					/>
				</View>
			) : null}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		color: "#2264dc",
		marginVertical: 15,
		fontWeight: "bold",
		marginTop: 5,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: 10,
	},
	deadline: {
		fontSize: 14,
		color: "#000",
		marginRight: 10,
		fontWeight: 300,
	},
	points: {
		fontSize: 14,
		color: "#000",
		fontWeight: 300,
	},
	availabilityContainer: {
		fontSize: 14,
		color: "#000",
		marginBottom: 10,
		lineHeight: 20,
		maxWidth: "80%",
		flexDirection: "row",
	},
	availability: {
		flexWrap: "wrap",
		maxWidth: "70%",
		fontWeight: 300,
	},
	attempt: {
		fontSize: 14,
		color: "#000",
		marginBottom: 10,
		fontWeight: 300,
	},
	iconStyle: {
		fontSize: 30,
		color: "#FFBF18",
		alignSelf: "center",
		top: -28,
		left: 30,
	},
});

export default memo(assignmentDetails);
