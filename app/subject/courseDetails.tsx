import HeaderConfig from "@/utils/HeaderConfig";
import {
	FontAwesome5,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

enum activityCategory {
	speech = "Speech",
	auditory = "Auditory",
	language = "Language",
	academic = "Academic",
}

const courseDetails = () => {
	const router = useRouter();

	// const { id, description, title, subjectType, role } = useLocalSearchParams<{
	//   id: string;
	//   title: string;
	//   description: string;
	//   subjectType: keyof typeof activityCategory;
	//   role: string;
	// }>();

	const { id, description, title, role } = useLocalSearchParams<{
		id: string;
		title: string;
		description: string;
		role: string;
	}>();

	const subjectType = activityCategory.speech;

	HeaderConfig("Course Details");

	return (
		<SafeAreaView
			style={{ backgroundColor: "#fff", paddingBottom: 300, top: -20 }}
		>
			<View style={styles.container}>
				<View style={[styles.courseInfoContainer]}>
					<View style={[styles.courseInfo]}></View>
					<View>
						<Text style={[styles.fontSizeTwo, { color: "#fff" }]}>{id}</Text>
						<Text style={[styles.fontSizeOne, { color: "#fff" }]}>{title}</Text>
						<Text style={[styles.fontSizeTwo, { color: "#fff" }]}>
							{description}
						</Text>
					</View>
				</View>
				<View style={styles.linksContainer}>
					{/*{subjectType !== "academic" ? (*/}
					<TouchableOpacity
						style={styles.link}
						onPress={useCallback(() => {
							// switch (subjectType) {
							//   case activityCategory.speech:
							router.push({
								pathname:
									"/subject/(exercises)/(speech)/speechTrainingExercises",
								params: { subjectId: id },
							});
							//     break;
							//   case activityCategory.auditory:
							//     router.push({
							//       pathname:
							//         "/subject/(exercises)/(language)/languageTrainingExercises",
							//       params: { subjectId: id },
							//     });
							//     break;
							//   case activityCategory.language:
							//     router.push({
							//       pathname:
							//         "/subject/(exercises)/(language)/languageTrainingExercises",
							//       params: { subjectId: id },
							//     });
							//     break;
							//   default:
							//     router.push("/subject/courseDetails");
							// }
						}, [router])}
					>
						<View style={styles.linkContent}>
							<Image
								source={
									subjectType === activityCategory.speech
										? require("@/assets/icons/speech.png")
										: subjectType === activityCategory.auditory
										? require("@/assets/icons/auditory.png")
										: subjectType === activityCategory.language
										? require("@/assets/icons/language.png")
										: null
								}
								style={{ width: 30, height: 30, left: -5 }}
							/>
							<View style={styles.linkTextContainer}>
								<Text style={styles.fontSizeOne}>
									{subjectType} Training Exercises
								</Text>
								<Entypo
									name="chevron-small-right"
									size={30}
									color="#CCC"
									style={{ left: -18 }}
								/>
							</View>
						</View>
					</TouchableOpacity>
					<View style={styles.divider} />
					{/*) : null}*/}
					<TouchableOpacity
						style={styles.link}
						onPress={useCallback(
							() =>
								router.push({
									pathname: "/subject/announcements",
									params: { subjectId: id, role: role },
								}),
							[]
						)}
					>
						<MaterialIcons
							name="campaign"
							size={30}
							style={{ color: "#ffbf18", left: -5 }}
						/>
						{/* <View style={styles.yellowBulletin}></View> */}
						<View style={styles.linkDecoration}>
							<Text style={styles.fontSizeOne}>Announcements</Text>
							<Entypo
								name="chevron-small-right"
								size={30}
								color="#CCC"
								style={{ left: -30 }}
							/>
						</View>
					</TouchableOpacity>
					<View style={styles.divider} />
					<TouchableOpacity
						style={styles.link}
						onPress={useCallback(
							() =>
								router.push({
									pathname: "/subject/assignments",
									params: { subjectId: id, role: role },
								}),
							[]
						)}
					>
						<MaterialCommunityIcons
							name="file-document-edit"
							size={30}
							style={{ color: "#ffbf18", left: -5 }}
						/>
						{/* <View style={styles.yellowBulletin}></View> */}
						<View style={styles.linkDecoration}>
							<Text style={styles.fontSizeOne}>Assignments</Text>
							<Entypo
								name="chevron-small-right"
								size={30}
								color="#CCC"
								style={{ left: -30 }}
							/>
						</View>
					</TouchableOpacity>
					<View style={styles.divider} />
					<TouchableOpacity
						style={styles.link}
						onPress={useCallback(() => router.push("/subject/scores"), [])}
					>
						<MaterialIcons
							name="celebration"
							size={30}
							style={{ color: "#ffbf18", left: -5 }}
						/>
						{/* <View style={styles.yellowBulletin}></View> */}
						<View style={styles.linkDecoration}>
							<Text style={styles.fontSizeOne}>Scores</Text>
							<Entypo
								name="chevron-small-right"
								size={30}
								color="#CCC"
								style={{ left: -30 }}
							/>
						</View>
					</TouchableOpacity>
					<View style={styles.divider} />
					<TouchableOpacity
						style={styles.link}
						onPress={useCallback(
							() =>
								router.push({
									pathname: "/subject/modules",
									params: { subjectId: id },
								}),
							[router]
						)}
					>
						<FontAwesome5
							name="book"
							size={30}
							style={{ color: "#ffbf18", left: -5, marginRight: 2 }}
						/>
						{/* <View style={styles.yellowBulletin}></View> */}
						<View style={styles.linkDecoration}>
							<Text style={styles.fontSizeOne}>Modules</Text>
							<Entypo
								name="chevron-small-right"
								size={30}
								color="#CCC"
								style={{ left: -30 }}
							/>
						</View>
					</TouchableOpacity>
					<View style={styles.divider} />
					{role === "teacher" ? (
						<TouchableOpacity
							style={styles.link}
							onPress={useCallback(
								() => router.push("/subject/attendance"),
								[router]
							)}
						>
							<Ionicons
								name="people"
								size={30}
								style={{ color: "#ffbf18", left: -5 }}
							/>
							{/* <View style={styles.yellowBulletin}></View> */}
							<View style={styles.linkDecoration}>
								<Text style={styles.fontSizeOne}>Attendance</Text>
								<Entypo
									name="chevron-small-right"
									size={30}
									color="#CCC"
									style={{ left: -30 }}
								/>
							</View>
						</TouchableOpacity>
					) : null}
					<View style={styles.divider} />
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 15,
		// backgroundColor: "#fff",
	},
	divider: {
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
		marginVertical: -5,
		width: "110%",
		left: -18,
	},
	courseInfoContainer: {
		backgroundColor: "#1F1F1F",
		paddingLeft: 13,
		paddingRight: 50,
		paddingVertical: 15,
		elevation: 5,
		display: "flex",
		flexDirection: "row",
		columnGap: 14,
		borderRadius: 10,
	},
	courseInfo: {
		borderColor: "#fff",
		borderWidth: 2.5,
		borderRadius: 100,
	},
	linksContainer: {
		rowGap: 10,
		top: 20,
		// marginTop: 10,
		// backgroundColor: "#000",
	},
	link: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		columnGap: 15,
		backgroundColor: "#fff",
		paddingVertical: 10,
		// paddingHorizontal: 10,
		borderRadius: 10,
		// elevation: 2,
		margin: 3,
	},
	linkContent: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		// columnGap: 5,
		backgroundColor: "#fff",
		// paddingVertical: 10,
		borderRadius: 10,
		width: "100%",
		// marginBottom: 0,
	},
	linkTextContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		// marginBottom: -20,
		left: 15,
	},
	fontSizeOne: {
		fontSize: 18,
		textAlignVertical: "center",
	},
	fontSizeTwo: {
		fontSize: 12,
	},
	linkDecoration: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		paddingRight: 18,
	},
	yellowBulletin: {
		borderColor: "#FFBF18",
		backgroundColor: "#FFBF18",
		height: "100%",
		borderWidth: 2.5,
		borderRadius: 100,
	},
});

export default memo(courseDetails);
