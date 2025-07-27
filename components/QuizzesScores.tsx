import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QuizzesScores = ({
	subjectId,
	role,
	quizzes,
	placeholder,
}: {
	subjectId: string;
	quizzes: { id: string; title: string }[];
	role: string;
	placeholder: string;
}) => {
	useHeaderConfig("Scores");

	const [isVisible, setIsVisible] = useState(false);
	const toggleDropdown = () => setIsVisible(!isVisible);

	const handleViewStudents = (quizId: string) => {
		if (role === "teacher") {
			router.push({
				pathname: "/subject/(sub-details)/Scores/ScoreStudentList",
				params: {
					subjectId,
					activityId: quizId,
					role: role,
					activityType: placeholder.toLowerCase(),
				},
			});
		} else {
			if (placeholder.toLowerCase() === "assignments") {
				router.push({
					pathname: "/subject/(sub-details)/Scores/AcademicScore",
					params: {
						subjectId,
						activityId: quizId,
						role: role,
						activityType: placeholder.toLowerCase(),
					},
				});
			} else {
				router.push({
					pathname: "/subject/(sub-details)/quiz/QuizScore",
					params: {
						subjectId,
						quizId: quizId,
						role: role,
						activityType: placeholder.toLowerCase(),
					},
				});
			}
		}
	};

	return (
		<View>
			<TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						width: "100%",
						paddingHorizontal: 10,
					}}
				>
					<Text style={styles.buttonText}>{placeholder}</Text>
					<AntDesign
						name={isVisible ? "up" : "down"}
						size={18}
						color="#FFBF18"
						// style={{ top: 5 }}
					/>
				</View>
				{/* <MaterialIcons
          name={isVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#fff"
        /> */}
			</TouchableOpacity>

			{isVisible && (
				<View style={{ rowGap: 5, width: "90%", marginHorizontal: "auto" }}>
					{quizzes.length > 0 ? (
						quizzes.map((quiz, index) => (
							<TouchableOpacity
								key={quiz.id}
								onPress={() => handleViewStudents(quiz.id)}
								style={styles.dropdownContent}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<View style={styles.yellowBulletin}></View>
										<Text style={[styles.item, globalStyles.text1]}>
											{placeholder === "Quizzes" ? "Quiz" : "Assignment"}{" "}
											{index + 1}
										</Text>
									</View>
									<FontAwesome
										name="long-arrow-right"
										size={20}
										color="black"
										style={{ top: 0, left: -18 }}
									/>
								</View>
							</TouchableOpacity>
						))
					) : (
						<View style={styles.dropdownContent}>
							<Text style={styles.item}>No Activities Yet</Text>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	dropdownButton: {
		padding: 16,
		borderRadius: 8,
		marginBottom: 4,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "500",
	},
	dropdownContent: {
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#00000024",
		paddingHorizontal: 15,
		paddingVertical: 8,
		marginBottom: 8,
	},
	item: {
		paddingVertical: 8,
		fontSize: 14,
		color: "#333",
	},
	yellowBulletin: {
		borderColor: "#FFBF18",
		backgroundColor: "#FFBF18",
		borderWidth: 2.5,
		borderRadius: 100,
		marginRight: 15,
		height: 30,
	},
});

export default QuizzesScores;
