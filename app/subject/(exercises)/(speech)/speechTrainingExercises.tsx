import HeaderConfig from "@/utils/HeaderConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SpeechTrainingExercise = () => {
	const router = useRouter();

	HeaderConfig("Speech Exercises");

	const { subjectId, role } = useLocalSearchParams<{
		subjectId: string;
		role: string;
	}>();

	const handlePictureRoute = () => {
		router.push({
			pathname: "/subject/(exercises)/level",
			params: {
				subjectId: subjectId,
				activity_type: "picture",
				category: "speech",
				role: role,
			},
		});
	};

	const handleQuestionRoute = () => {
		router.push({
			pathname: "/subject/(exercises)/level",
			params: {
				subjectId: subjectId,
				activity_type: "question",
				category: "speech",
				role: role,
			},
		});
	};

	const handlePhraseRoute = () => {
		router.push({
			pathname: "/subject/(exercises)/level",
			params: {
				subjectId: subjectId,
				activity_type: "phrase",
				category: "speech",
				role: role,
			},
		});
	};

	const handlePronunciationRoute = () => {
		router.push({
			pathname: "/subject/(exercises)/level",
			params: {
				subjectId: subjectId,
				activity_type: "pronunciation",
				category: "speech",
				role: role,
			},
		});
	};

	const handleAdd = () => {
		router.push({
			pathname:
				"/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity",
			params: { subjectId: subjectId },
		});
	};

	return (
		<View style={{ backgroundColor: "#fff", flex: 1 }}>
			<Image
				source={require("@/assets/actCard/speechDev.png")}
				style={styles.actHeader}
			/>
			<Text
				style={{
					color: "#2264dc",
					fontWeight: 500,
					marginHorizontal: 30,
					marginVertical: -5,
				}}
			>
				Explore your exercises!
			</Text>
			<TouchableOpacity onPress={handlePictureRoute}>
				<Image
					source={require("@/assets/actCard/pic.png")}
					style={[styles.actSub, { marginVertical: -5 }]}
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={handleQuestionRoute}>
				<Image
					source={require("@/assets/actCard/word.png")}
					style={[styles.actSub, { marginVertical: -5 }]}
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={handlePhraseRoute}>
				<Image
					source={require("@/assets/actCard/phrase.png")}
					style={styles.actSub}
				/>
			</TouchableOpacity>
			{role === "teacher" && (
				<TouchableOpacity style={styles.addButton} onPress={handleAdd}>
					<View
						style={{
							top: 20,
							alignSelf: "center",
							flexDirection: "row",
							// justifyContent: "center",
						}}
					>
						<Ionicons name="add-circle" size={20} color="#aaa" />
						<Text style={styles.addText}>Add Exercise</Text>
					</View>

					{/* <MaterialIcon name="add" size={30} color="#fff" /> */}
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	actHeader: {
		margin: 20,
		height: 170,
		width: 350,
	},
	actSub: {
		marginTop: 15,
		margin: 20,
		height: 110,
		width: 350,
	},
	addButton: {
		backgroundColor: "#f5f5f5",
		borderColor: "#ddd",
		borderWidth: 2,
		borderRadius: 20,
		borderStyle: "dashed",
		margin: 30,
		bottom: -10,
		height: 60,
	},
	addText: {
		color: "#aaa",
		fontWeight: 500,
		marginHorizontal: 10,
	},
});

export default memo(SpeechTrainingExercise);
