import AudioPlayer from "@/components/trainingActivities/AudioPlayer";
import FlashcardMicrophone from "@/components/trainingActivities/speech/FlashcardMicrophone";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MicrophoneTest = () => {
	useHeaderConfig("Flashcards");

	const {
		category,
		activity_type,
		role,
		subjectId,
		activityId,
		difficulty,
		attemptId,
	} = useLocalSearchParams<{
		category: string;
		activity_type: string;
		role: string;
		difficulty: string;
		subjectId: string;
		activityId: string;
		attemptId: string;
	}>();

	const [recordingAudio, setRecordingAudio] = useState<string | null>("");

	const handleTakeExercise = () => {
		if (activity_type === "picture") {
			router.push({
				pathname:
					role === "teacher"
						? "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity"
						: "/subject/(exercises)/(speech)/PictureFlashcards",
				params: {
					subjectId,
					activity_type,
					difficulty,
					category,
					activityId,
					prevAttemptId: attemptId,
				},
			});
		}

		if (
			activity_type === "phrase" ||
			activity_type === "question" ||
			activity_type === "pronunciation"
		) {
			router.push({
				pathname:
					role === "teacher"
						? "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity"
						: "/subject/(exercises)/(speech)/Flashcards",
				params: {
					subjectId,
					activity_type,
					difficulty,
					category,
					activityId,
					prevAttemptId: attemptId,
				},
			});
		}
	};

	return (
		<GestureHandlerRootView>
			<View
				style={[
					{
						height: "100%",
						backgroundColor: "#fff",
					},
				]}
			>
				<View style={[globalStyles.cardContainer1, { marginBottom: 15 }]}>
					<View>
						<Image
							source={require("@/assets/mic_test.png")}
							style={[styles.image, { width: 170, height: 200 }]}
						/>
						<Text
							style={[
								globalStyles.text1,
								{
									marginHorizontal: "auto",
									fontSize: 20,
									marginVertical: 10,
								},
							]}
						>
							Microphone Test
						</Text>
						<Text
							style={[
								globalStyles.text1,
								{
									marginHorizontal: "auto",
									fontSize: 14,
									fontWeight: 300,
								},
							]}
						>
							Say "Piddie" to test the microphone
						</Text>
					</View>
				</View>
				<View style={{ marginHorizontal: 20, marginBottom: 15 }}>
					<FlashcardMicrophone
						onStop={(uri) => {
							setRecordingAudio(uri);
						}}
					/>
				</View>
				<View style={[{ marginTop: 0, marginHorizontal: 20 }]}>
					{recordingAudio && (
						<View>
							<AudioPlayer uri={recordingAudio} />

							<Text
								style={[
									globalStyles.text1,
									{
										marginHorizontal: "auto",
										marginVertical: 10,
										fontSize: 14,
										fontWeight: 300,
									},
								]}
							>
								Did you hear your voice clearly?
							</Text>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<TouchableOpacity
									style={[
										globalStyles.submitButton,
										{
											backgroundColor: "#fff",
											borderWidth: 1,
											borderColor: "#FFBF18",
											width: "45%",
										},
									]}
									onPress={() => router.back()}
								>
									<Text
										style={[
											globalStyles.submitButtonText,
											{ color: "#FFBF18" },
										]}
									>
										No
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[globalStyles.submitButton, { width: "45%" }]}
									onPress={handleTakeExercise}
								>
									<Text style={globalStyles.submitButtonText}>Yes</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>
			</View>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 250,
		height: 250,
		alignSelf: "center",
		marginVertical: "auto",
	},
});

export default memo(MicrophoneTest);
