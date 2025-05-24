import { DatePickerField } from "@/components/DatePickerField";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { getAssignmentById } from "@/utils/query";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface InputErrorState {
	submissionType: boolean;
	deadline: boolean;
	availabilityFrom: boolean;
	availabilityTo: boolean;
	attempt: boolean;
	title: boolean;
	description: boolean;
}

enum SubmissionOptions {
	TEXT_ENTRY = "Text Entry",
	FILE_UPLOAD = "File Upload",
}

type SubmissionOption =
	(typeof SubmissionOptions)[keyof typeof SubmissionOptions];

const addAssignment = () => {
	HeaderConfig("Add Assignment");
	const router = useRouter();

	const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();

	const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
	const [submissionType, setSubmissionType] = useState<SubmissionOptions>(
		SubmissionOptions.TEXT_ENTRY
	);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [deadline, setDeadline] = useState<Date | null>(null);
	const [availabilityFrom, setAvailabilityFrom] = useState<Date | null>(null);
	const [availabilityTo, setAvailabilityTo] = useState<Date | null>(null);
	const [attempt, setAttempt] = useState<number>(1);
	const [points, setPoints] = useState<number>(1);
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [descHeight, setDescHeight] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	const [error, setError] = useState<InputErrorState>({
		submissionType: false,
		deadline: false,
		availabilityFrom: false,
		availabilityTo: false,
		attempt: false,
		title: false,
		description: false,
	});

	const handleAddAttempt = () => {
		setAttempt(attempt + 1);
	};

	const handleMinusAttempt = () => {
		if (attempt > 1) {
			setAttempt(attempt - 1);
		}
	};

	const sanitizeAttemptInput = (raw: string, prev: number): number => {
		if (raw === "") return 1;

		const digitsOnly = raw.replace(/\D/g, "");
		if (digitsOnly === "") {
			return 1;
		}

		const n = parseInt(digitsOnly, 10);
		const clamped = n < 1 ? 1 : n;

		return clamped;
	};

	//   const [quizItems, setQuizItems] = useState<{ question: string; answer: string }[]>([]);

	const handlePreviewAssignment = async () => {
		setError({
			submissionType: false,
			deadline: false,
			availabilityFrom: false,
			availabilityTo: false,
			attempt: false,
			title: false,
			description: false,
		});

		let hasError = false;

		if (!(deadline instanceof Date) || isNaN(deadline.getTime())) {
			setError((prev) => ({ ...prev, deadline: true }));
			hasError = true;
		}

		if (
			!(availabilityFrom instanceof Date) ||
			isNaN(availabilityFrom.getTime())
		) {
			setError((prev) => ({ ...prev, availabilityFrom: true }));
			hasError = true;
		}

		if (!(availabilityTo instanceof Date) || isNaN(availabilityTo.getTime())) {
			setError((prev) => ({ ...prev, availabilityTo: true }));
			hasError = true;
		}

		if (
			!title ||
			title.trim().length === 0 ||
			description.trim().length > 250
		) {
			setError((prev) => ({ ...prev, title: true }));
			hasError = true;
		}

		if (
			!description ||
			description.trim().length === 0 ||
			description.trim().length > 1000
		) {
			setError((prev) => ({ ...prev, description: true }));
			hasError = true;
		}

		if (!attempt || attempt < 1) {
			setError((prev) => ({ ...prev, attempt: true }));
			hasError = true;
		}

		if (hasError) return;

		router.push({
			pathname: "/subject/(sub-details)/assignment/AssignmentPreview",
			params: {
				subjectId,
				availabilityFrom: availabilityFrom?.toISOString() ?? null,
				availabilityTo: availabilityTo?.toISOString() ?? null,
				deadline: deadline?.toISOString() ?? null,
				title: title,
				description: description,
				attempt: attempt.toString(),
				points: points.toString(),
				submissionType: submissionType,
				assignmentId: assignmentId,
			},
		});
	};

	const optionValues = Object.values(SubmissionOptions) as SubmissionOption[];

	useEffect(() => {
		if (assignmentId != null) {
			setLoading(true);

			const fetchAssignment = async () => {
				try {
					const res = await getAssignmentById(subjectId, assignmentId);

					const data = res.assignment;

					setSubmissionType(data.submission_type as SubmissionOption);
					setDeadline(data.deadline ? new Date(data.deadline) : null);
					setAvailabilityFrom(
						data.availability.start ? new Date(data.availability.start) : null
					);
					setAvailabilityTo(
						data.availability.deadline
							? new Date(data.availability.deadline)
							: null
					);
					setAttempt(data.attempts);
					setPoints(data.total);
					setTitle(data.title);
					setDescription(data.description);

					setLoading(false);
				} catch (err) {
					console.error(err);
				}
			};
			fetchAssignment();
		}
	}, []);

	if (loading) {
		return (
			<View>
				<Text>Loading..........</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={globalStyles.container}
			contentContainerStyle={{ paddingBottom: 80 }}
			showsVerticalScrollIndicator={false}
		>
			<View style={[globalStyles.cardContainer, { rowGap: 15 }]}>
				<View style={styles.row}>
					<Text style={globalStyles.textLabel}>Submission Type</Text>

					<TouchableOpacity
						style={[
							styles.dropdownButton,
							error.submissionType
								? { borderColor: "#ee6b6e", borderWidth: 1 }
								: null,
						]}
						onPress={() => setDropdownVisible(!dropdownVisible)}
					>
						<View style={styles.inputRow}>
							<Text style={{ color: submissionType ? "#000" : "#aaa" }}>
								{submissionType}
							</Text>
							<MaterialIcons
								name={dropdownVisible ? "arrow-drop-up" : "arrow-drop-down"}
								size={25}
								color="#ffbf18"
							/>
						</View>
					</TouchableOpacity>
				</View>

				{dropdownVisible && (
					<View style={styles.dropdownList}>
						{optionValues.map((option) => (
							<TouchableOpacity
								key={option}
								style={styles.dropdownItem}
								onPress={() => {
									setSubmissionType(option);
									setDropdownVisible(false);
								}}
							>
								<Text style={{ color: "#333" }}>{option}</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

				<View style={styles.row}>
					<Text style={globalStyles.textLabel}>Deadline</Text>
					<DatePickerField
						date={deadline}
						onChange={setDeadline}
						error={error.deadline}
						style={styles.dropdown}
					/>
				</View>

				<View style={styles.row}>
					<Text style={globalStyles.textLabel}>Availability From</Text>
					<DatePickerField
						date={availabilityFrom}
						onChange={setAvailabilityFrom}
						error={error.availabilityFrom}
						style={styles.dropdown}
					/>
				</View>

				<View style={styles.row}>
					<Text style={globalStyles.textLabel}>Availability To</Text>
					<DatePickerField
						date={availabilityTo}
						onChange={setAvailabilityTo}
						error={error.availabilityTo}
						style={styles.dropdown}
					/>
				</View>
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Text style={globalStyles.textLabel}>Attempts</Text>
					<View
						style={[
							{
								width: "55%",
								borderWidth: 1,
								paddingHorizontal: 10,
								borderRadius: 10,
								backgroundColor: "#fff",
								flexDirection: "row",
								height: 50,
							},
							error.attempt
								? { borderColor: "#ee6b6e", borderWidth: 1 }
								: { borderColor: "#ddd" },
						]}
					>
						<TextInput
							style={{ width: "85%" }}
							value={attempt.toString()}
							onChangeText={(text) =>
								setAttempt((prev: number) => sanitizeAttemptInput(text, prev))
							}
							keyboardType={"numeric"}
						/>
						<View style={{ marginVertical: "auto" }}>
							<TouchableOpacity onPress={handleAddAttempt}>
								<MaterialIcons
									name="arrow-drop-up"
									size={25}
									color="#ffbf18"
									style={{ marginTop: 0 }}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={handleMinusAttempt}>
								<MaterialIcons
									name="arrow-drop-down"
									size={25}
									color="#ffbf18"
									style={{ marginTop: -10 }}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={styles.row}>
					<Text style={globalStyles.textLabel}>Points</Text>
					<TextInput
						style={[
							styles.dropdown,
							error.title
								? { borderColor: "#ee6b6e", borderWidth: 1 }
								: { borderColor: "#ddd" },
						]}
						placeholder="Title"
						placeholderTextColor="#aaa"
						value={points.toString()}
						onChangeText={(text) =>
							setPoints((prev: number) => sanitizeAttemptInput(text, prev))
						}
					/>
				</View>

				<View style={styles.separator}></View>

				<View style={styles.row}>
					<Text style={globalStyles.textLabel}>Title</Text>
					<TextInput
						style={[
							styles.dropdown,
							error.title
								? { borderColor: "#ee6b6e", borderWidth: 1 }
								: { borderColor: "#ddd" },
						]}
						placeholder="Enter title"
						placeholderTextColor="#aaa"
						multiline={true}
						value={title}
						onChangeText={setTitle}
					/>
				</View>

				<View style={{ rowGap: 5 }}>
					<Text style={globalStyles.textLabel}>Description</Text>
					<TextInput
						style={[
							{
								borderWidth: 1,
								borderColor: "#ddd",
								borderRadius: 10,
								padding: 10,
								marginTop: 10,
								height: 150,
							},
							// globalStyles.inputContainer,
							// { height: Math.max(150, descHeight) },
							error.description
								? { borderColor: "#ee6b6e", borderWidth: 1 }
								: { borderColor: "#ddd" },
						]}
						// onContentSizeChange={(e) =>
						// 	setDescHeight(e.nativeEvent.contentSize.height)
						// }
						textAlignVertical="top"
						placeholder="Enter description..."
						placeholderTextColor="#aaa"
						multiline={true}
						value={description}
						onChangeText={setDescription}
					/>
				</View>

				<TouchableOpacity
					style={[
						globalStyles.submitButton,
						{ flexDirection: "row", justifyContent: "center", elevation: 5 },
					]}
					onPress={handlePreviewAssignment}
				>
					<Text style={globalStyles.submitButtonText}>Preview</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	separator: {
		height: 3,
		backgroundColor: "#f5f5f5",
		width: 350,
		left: -23,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	dropdown: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		padding: 12,
		borderRadius: 10,
		backgroundColor: "#fff",
		width: "55%",
	},
	dropdownButton: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#fff",
		width: "55%",
	},
	dropdownList: {
		position: "absolute",
		top: 75,
		left: 161,
		width: "55%",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		backgroundColor: "#fff",
		zIndex: 999,
	},
	dropdownItem: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
});

export default memo(addAssignment);
