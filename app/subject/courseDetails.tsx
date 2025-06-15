import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import HeaderConfig from "@/utils/HeaderConfig";

const newCourseDetails = () => {
	const router = useRouter();
	const { id, description, title, role, subjectType, specializedType } =
		useLocalSearchParams<{
			id: string;
			title: string;
			description: string;
			subjectType: string;
			specializedType?: string;
			role: string;
		}>();

	const headerTitle =
		subjectType === "specialized"
			? specializedType === "speech"
				? "Speech Development"
				: specializedType === "auditory"
					? "Auditory Development"
					: specializedType === "language"
						? "Language Development"
						: "Course Details"
			: "Course Details";

	HeaderConfig(headerTitle);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 50 }}
			style={{ backgroundColor: "#fff", flex: 1 }}
		>
			<View style={styles.cardContainer}>
				<Image
					source={require("@/assets/dashImage/english.png")}
					style={styles.subImg}
				/>
				<View style={styles.group}>
					<Text style={styles.subId}>{id}</Text>
					<Text style={styles.subName}>{title}</Text>
					<Text style={styles.subDesc}>{description}</Text>
				</View>
			</View>

			<View style={styles.subContainer}>
				{subjectType === "specialized" && (
					<TouchableOpacity
						onPress={useCallback(() => {
							switch (specializedType) {
								case "speech":
									router.push({
										pathname: "/subject/(exercises)/(speech)/newSpeech",
										params: { subjectId: id, role },
									});
									break;
								case "auditory":
									router.push({
										pathname:
											"/subject/(exercises)/(auditory)/auditoryTrainingExercise",
										params: { subjectId: id, role },
									});
									break;
								case "language":
									router.push({
										pathname:
											"/subject/(exercises)/(language)/languageTrainingExercises",
										params: { subjectId: id, role },
									});
									break;
								default:
									router.push("/subject/courseDetails");
							}
						}, [router, specializedType, id, role])}
					>
						<Image
							source={
								specializedType === "speech"
									? require("@/assets/course/speech.png")
									: specializedType === "auditory"
										? require("@/assets/course/auditory.png")
										: require("@/assets/course/language.png")
							}
							style={styles.speech}
						/>
					</TouchableOpacity>
				)}

				<TouchableOpacity
					style={styles.subCourse}
					onPress={useCallback(() => {
						router.push({
							pathname: "/subject/announcements",
							params: { subjectId: id, role },
						});
					}, [router, id, role])}
				>
					<View style={styles.row}>
						<Image
							source={require("@/assets/course/ann.png")}
							style={styles.courseImg}
						/>
						<Text style={{ fontSize: 14, left: -40 }}>Announcements</Text>
						<FontAwesome6 name="arrow-right-long" size={20} color="#1f1f1f" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.subCourse}
					onPress={useCallback(() => {
						router.push({
							pathname: "/subject/assignments",
							params: { subjectId: id, role },
						});
					}, [router, id, role])}
				>
					<View style={styles.row}>
						<Image
							source={require("@/assets/course/ass.png")}
							style={styles.courseImg}
						/>
						<Text style={{ fontSize: 14, left: -50 }}>Assignments</Text>
						<FontAwesome6 name="arrow-right-long" size={20} color="#1f1f1f" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.subCourse}
					onPress={useCallback(() => {
						router.push({
							pathname: "/subject/Scores",
							params: { subjectId: id, role },
						});
					}, [router, id, role])}
				>
					<View style={styles.row}>
						<Image
							source={require("@/assets/course/score.png")}
							style={styles.courseImg}
						/>
						<Text style={{ fontSize: 14, left: -70 }}>Scores</Text>
						<FontAwesome6 name="arrow-right-long" size={20} color="#1f1f1f" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.subCourse}
					onPress={useCallback(() => {
						router.push({
							pathname: "/subject/modules",
							params: { subjectId: id },
						});
					}, [router, id])}
				>
					<View style={styles.row}>
						<Image
							source={require("@/assets/course/module.png")}
							style={[styles.courseImg, { width: 48, left: -10 }]}
						/>
						<Text style={{ fontSize: 14, left: -65 }}>Modules</Text>
						<FontAwesome6 name="arrow-right-long" size={20} color="#1f1f1f" />
					</View>
				</TouchableOpacity>

				{role === "teacher" && (
					<TouchableOpacity
						style={styles.subCourse}
						onPress={useCallback(() => {
							router.push("/subject/attendance");
						}, [router])}
					>
						<View style={styles.row}>
							<Image
								source={require("@/assets/course/attendance.png")}
								style={[styles.courseImg, { width: 40 }]}
							/>
							<Text style={{ fontSize: 14, left: -50 }}>Attendance</Text>
							<FontAwesome6 name="arrow-right-long" size={20} color="#1f1f1f" />
						</View>
					</TouchableOpacity>
				)}
			</View>
		</ScrollView>
	);
};

export default memo(newCourseDetails);

const styles = StyleSheet.create({
	cardContainer: {
		margin: 20,
		// padding: 20,
		// backgroundColor: "#000",
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 20,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
	},
	subImg: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		height: 130,
		width: 351,
	},
	group: {
		margin: 20,
	},
	subId: {
		color: "#828282",
		top: -10,
		fontSize: 14,
		// margin: 10,
		// left: 10,
	},
	subName: {
		top: -5,
		fontSize: 18,
		color: "#2264dc",
		fontWeight: 500,
		// margin: 10,
		// left: 10,
	},

	subDesc: {
		textAlign: "justify",
		fontWeight: 300,
		fontSize: 12,
	},
	subContainer: {},
	speech: {
		height: 110,
		width: 355,
		left: 20,
		marginVertical: -10,
		marginBottom: 5,
	},
	subCourse: {
		backgroundColor: "000",
		borderColor: "#ddd",
		borderWidth: 1,
		marginHorizontal: 20,
		marginVertical: 10,
		borderRadius: 20,
		padding: 10,
	},
	courseImg: {
		height: 40,
		width: 40,
		left: -10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 30,
	},
});
