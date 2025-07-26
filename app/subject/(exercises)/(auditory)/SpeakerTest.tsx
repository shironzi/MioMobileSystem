import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const audioSource = require("@/assets/audio/piddie.mp3");

const SpeakerTest = () => {
	useHeaderConfig("Audio Test");

	const {
		category,
		activity_type,
		role,
		subjectId,
		activityId,
		difficulty,
		attemptId,
		remedial,
	} = useLocalSearchParams<{
		category: string;
		activity_type: string;
		role: string;
		difficulty: string;
		subjectId: string;
		activityId: string;
		attemptId: string;
		remedial: string;
	}>();

	const player = useAudioPlayer(audioSource);
	const status = useAudioPlayerStatus(player);
	const [played, setPlayed] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	useEffect(() => {
		if (status.playing) {
			setIsPlaying(true);
		} else if (status.didJustFinish) {
			setIsPlaying(false);
		}
	}, [status.playing, status.didJustFinish]);

	const handlePlayButton = () => {
		player.replace(audioSource);
		player.play();
		setPlayed(true);
	};

	const handleTakeExercise = () => {
		if (remedial === "true") {
			router.push({
				pathname:
					activity_type === "matching"
						? "/subject/(exercises)/(auditory)/Remedial/RemedialActivity"
						: "/subject/(exercises)/(auditory)/Remedial/BingoRemedialActivity",
				params: {
					subjectId: subjectId,
					remedialId: activityId,
				},
			});
		} else if (activity_type === "bingo") {
			router.push({
				pathname:
					role === "teacher"
						? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
						: "/subject/(exercises)/(auditory)/bingo",
				params: {
					subjectId,
					activity_type,
					difficulty,
					category,
					activityId,
					prevAttemptId: attemptId,
				},
			});
		} else if (activity_type === "matching") {
			router.push({
				pathname:
					role === "teacher"
						? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
						: "/subject/(exercises)/(auditory)/MatchingCards",
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
							Speaker Test
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
							Tap the speaker icon to hear "Piddie"
						</Text>
					</View>
				</View>

				<View
					style={[
						globalStyles.cardContainer1,
						{ flexDirection: "row", alignItems: "center", marginTop: 0 },
					]}
				>
					<View
						style={[
							{
								backgroundColor: "#ddd",
								padding: 15,
								borderRadius: 10,
								margin: -10,
							},
							isPlaying && styles.recordingButton,
						]}
					>
						<TouchableOpacity onPress={handlePlayButton}>
							<FontAwesome6
								name="volume-high"
								size={30}
								color={isPlaying ? "#fff" : "#000"}
							/>
						</TouchableOpacity>
					</View>

					<Text style={{ fontWeight: 300, left: 60, fontSize: 14 }}>
						Tap the speaker
					</Text>
				</View>

				{played && (
					<View
						style={[
							{
								marginTop: -10,

								flexDirection: "column",
								marginHorizontal: 20,
							},
						]}
					>
						<Text
							style={[
								globalStyles.text1,
								{
									marginHorizontal: "auto",
									marginVertical: 10,
									marginBottom: 10,
									fontSize: 14,
									fontWeight: 300,
								},
							]}
						>
							Did you hear Piddie well?
						</Text>
						<View
							style={{ flexDirection: "row", justifyContent: "space-between" }}
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
									style={[globalStyles.submitButtonText, { color: "#FFBF18" }]}
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
	recordingButton: {
		backgroundColor: "#FFBF18",
	},
	bg: {
		backgroundColor: "#FFBF18",
	},
});

export default memo(SpeakerTest);
