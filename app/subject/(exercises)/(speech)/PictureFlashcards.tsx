import ActivityProgress from "@/components/activityProgress";
import FeedbackAlert from "@/components/FeedbackAlert";
import LoadingCard from "@/components/loadingCard";
import AudioPlayer from "@/components/trainingActivities/AudioPlayer";
import FlashcardMicrophone from "@/components/trainingActivities/speech/FlashcardMicrophone";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { startActivity, submitAnswer } from "@/utils/specialized";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PictureFlashcards = () => {
	HeaderConfigQuiz("Flashcards");
	const router = useRouter();
	interface PictureItem {
		flashcard_id: string;
		text: string;
		image_url: string;
	}

	const { subjectId, difficulty, activity_type, activityId } =
		useLocalSearchParams<{
			activity_type: string;
			difficulty: string;
			subjectId: string;
			activityId: string;
		}>();

	const [cards, setCards] = useState<PictureItem[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [isAnswered, setIsAnswered] = useState(false);
	const [recordingAudio, setRecordingAudio] = useState<string | null>("");
	const [loading, setLoading] = useState(true);
	const [attemptId, setAttemptId] = useState<string | undefined>();
	const [currentCard, setCurrentCard] = useState<number>(0);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [isSending, setIsSending] = useState<boolean>(false);

	const handleNextCard = async () => {
		if (!attemptId) return;
		if (!recordingAudio) return;
		setIsSending(true);

		const res = await submitAnswer(
			subjectId,
			activity_type,
			difficulty,
			activityId,
			attemptId,
			cards[currentCard].flashcard_id,
			recordingAudio
		);

		if (res.feedbacks) {
			setFeedback(res.feedbacks);
		}

		setRecordingAudio(null);
		setTimeout(() => {
			if (currentCard === cards.length - 1) {
				router.push({
					pathname: "/subject/(sub-details)/scoreDetails",
					params: {
						subjectId,
						activity_type,
						difficulty,
						activityId,
						attemptId,
					},
				});

				return;
			}

			if (res.lowest_phoneme_score < 75) {
				return;
			}

			setCurrentCard(currentCard + 1);
			setIsAnswered(false);

			setIsSending(false);
		}, 5000);
	};

	useEffect(() => {
		let isMounted = true;

		const fetchActivity = async () => {
			const res = await startActivity(
				subjectId,
				activity_type,
				difficulty,
				activityId
			);

			if (res.success) {
				if (!isMounted) return;
				setCards(Object.values(res.flashcards));
				setAttemptId(res.attemptId);

				setCurrentCard(res.currentItem ?? 0);
				setLoading(false);
			} else {
				Alert.alert("Access Denied", res.message, [
					{
						text: "OK",
						onPress: () => router.back(),
					},
				]);
			}
		};

		fetchActivity();
		return () => {
			isMounted = false;
		};
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

	if (!cards) {
		return (
			<View style={styles.container}>
				<Text>No flashcards available.</Text>
			</View>
		);
	}
	const getInstruction =
		"Look at the picture. Tap and hold the microphone and say the name out loud. Try to pronounce it clearly.";
	return (
		<GestureHandlerRootView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50, height: "100%" }}
				style={[styles.container, { flex: 1, backgroundColor: "#fff" }]}
			>
				<ActivityProgress
					difficulty={difficulty}
					totalItems={cards.length}
					completedItems={currentCard}
				/>
				<View
					style={{
						// marginHorizontal: 10,
						borderColor: "#ddd",
						borderWidth: 1,
						borderRadius: 20,
						paddingHorizontal: 10,
						marginBottom: 15,
						marginTop: -10,
					}}
				>
					<Text
						style={{
							marginHorizontal: 10,
							textAlign: "justify",
							fontWeight: "500",
							fontSize: 16,
							color: "#2264dc",
							marginTop: 10,
						}}
					>
						Piddie Tips!
					</Text>
					<Text
						style={{
							marginTop: 5,
							margin: 10,
							textAlign: "justify",
							fontWeight: "300",
						}}
					>
						{getInstruction}
					</Text>
				</View>

				<View style={{ rowGap: 20 }}>
					<View style={styles.flashcardContainer}>
						<Image
							resizeMode="contain"
							source={require("@/assets/images/face/echo.png")}
							style={{ width: 90, height: 50 }}
						/>

						{feedback && (
							<View
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									left: 0,
									bottom: 0,
								}}
							>
								<FeedbackAlert
									message={feedback}
									onHide={() => setFeedback(null)}
								/>
							</View>
						)}

						<Image
							source={{ uri: cards[currentCard]?.image_url }}
							style={{
								width: 150,
								height: 150,
								borderRadius: 8,
								margin: "auto",
							}}
							resizeMode="contain"
						/>
					</View>

					<View style={{ rowGap: 5 }}>
						<FlashcardMicrophone
							onStop={(uri) => {
								setIsRecording(false);
								setIsAnswered(true);
								setRecordingAudio(uri);
							}}
						/>
						{recordingAudio && (
							<View style={{ marginTop: 10 }}>
								<AudioPlayer uri={recordingAudio} />
							</View>
						)}
					</View>
				</View>
				<View
					style={{
						position: "absolute",
						bottom: 70,
						left: 20,
						right: 20,
						width: "100%",
						justifyContent: "center",
					}}
				>
					<TouchableOpacity
						style={[
							styles.continueButton,
							isAnswered && !isRecording
								? { backgroundColor: "#ffbf18" }
								: { backgroundColor: "#ddd" },
						]}
						disabled={!isAnswered || isRecording || isSending}
						onPress={handleNextCard}
					>
						<Text style={styles.continueButtonText}>
							{isSending ? "Submitting...." : "Next"}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		// backgroundColor: "#fff",
		padding: 30,
		// margin: 10,
	},
	flashcardContainer: {
		backgroundColor: "#fff",
		padding: 20,
		height: 230,
		borderRadius: 20,
		borderColor: "#ddd",
		borderWidth: 1,
	},
	textContainer: {
		margin: "auto",
		textAlign: "center",
	},
	flashcardText: {
		fontSize: 24,
		flexWrap: "wrap",
	},
	cardImage: {
		width: 100,
		height: 200,
		borderRadius: 10,
		marginTop: -90,
	},
	buttonContainer: {
		marginTop: 70,
	},
	continueButton: {
		flex: 1,
		marginHorizontal: 5,
		left: -25,
		padding: 17,
		borderRadius: 15,
		alignItems: "center",
		width: "100%",
		top: 70,
	},
	continueButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default memo(PictureFlashcards);
