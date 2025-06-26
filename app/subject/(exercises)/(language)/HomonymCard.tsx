import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomonymItem {
	item_id: string | null;
	sentence_1: string;
	sentence_2: string;
	audio_path_1: string;
	audio_path_2: string;
	choices: string[];
}

interface Props {
	activity: HomonymItem;
	emptyInput: boolean;
	inputError?: { item_id: string | null; index: number[] };
	answers: { item_id: string; answer: string[] };
	handleAnswer: (answer: string, index: number) => void;
	handleAudioLogs: (index: number) => void;
}

const HomonymCard = ({
	activity,
	emptyInput,
	handleAnswer,
	answers,
	inputError,
	handleAudioLogs,
}: Props) => {
	const activitySentence1 = activity.sentence_1.split(" ");
	const activitySentence2 = activity.sentence_2.split(" ");

	const sentenceError1 = inputError?.index.includes(0);
	const sentenceError2 = inputError?.index.includes(1);

	const player = useAudioPlayer();
	const status = useAudioPlayerStatus(player);

	const handleAudioPlay = (audio_path: string, index: number) => {
		player.pause();
		player.replace({ uri: audio_path });
		player.seekTo(0);
		player.play();
		handleAudioLogs(index);
		return;
	};

	useEffect(() => {
		return () => {
			if (status.playing) {
				player.pause();
			}
		};
	}, []);

	return (
		<View style={styles.container}>
			<View style={[styles.questionCard, styles.questionRow]}>
				<TouchableOpacity
					onPress={() => handleAudioPlay(activity.audio_path_1, 0)}
					style={styles.audioControl}
				>
					<FontAwesome name="volume-up" size={24} color="white" />
				</TouchableOpacity>
				<View style={styles.wordContainer}>
					{activitySentence1.map((word, i) => {
						if (/^_+$/.test(word)) {
							return (
								<View
									key={i}
									style={[
										styles.pickerWrapper,
										sentenceError1 ? styles.pickerError : styles.pickerNormal,
									]}
								>
									<Text style={styles.pickerText}>{answers?.answer[0]}</Text>
									<Picker
										dropdownIconColor={"#FFBF18"}
										style={styles.picker}
										mode={"dropdown"}
										selectedValue={answers?.answer[0] ?? ""}
										onValueChange={(value) => handleAnswer(value, 0)}
									>
										{activity.choices.map((choice) => (
											<Picker.Item label={choice} value={choice} key={choice} />
										))}
									</Picker>
								</View>
							);
						} else {
							return (
								<Text key={`word-${i}`} style={styles.wordText}>
									{word}
								</Text>
							);
						}
					})}
				</View>
			</View>

			<View style={[styles.questionCard, styles.questionRow]}>
				<TouchableOpacity
					onPress={() => handleAudioPlay(activity.audio_path_2, 1)}
					style={styles.audioControl}
				>
					<FontAwesome name="volume-up" size={24} color="white" />
				</TouchableOpacity>
				<View style={styles.wordContainer}>
					{activitySentence2.map((word, i) => {
						if (/^_+$/.test(word)) {
							return (
								<View
									key={i}
									style={[
										styles.pickerWrapper,
										sentenceError2 ? styles.pickerError : styles.pickerNormal,
									]}
								>
									<Text style={styles.pickerText}>{answers?.answer[1]}</Text>
									<Picker
										dropdownIconColor={"#FFBF19"}
										style={styles.picker}
										mode={"dropdown"}
										selectedValue={answers?.answer[1] ?? ""}
										onValueChange={(value) => handleAnswer(value, 1)}
									>
										{activity.choices.map((choice) => (
											<Picker.Item label={choice} value={choice} key={choice} />
										))}
									</Picker>
								</View>
							);
						} else {
							return (
								<Text key={`word-${i}`} style={styles.wordText}>
									{word}
								</Text>
							);
						}
					})}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 500,
	},
	questionCard: {
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#ddd",
		backgroundColor: "#fff",
		padding: 9,
		borderRadius: 20,
		flexWrap: "wrap",
		alignItems: "flex-start",
		minWidth: "100%",
	},
	questionRow: {
		flexDirection: "row",
		columnGap: 10,
	},
	audioControl: {
		backgroundColor: "#FFBF18",
		paddingVertical: 20,
		paddingHorizontal: 25,
		borderRadius: 12,
		justifyContent: "flex-start",
	},
	wordContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		maxWidth: "75%",
		rowGap: 4,
	},
	wordText: {
		marginRight: 5,
		fontSize: 16,
		flexWrap: "wrap",
	},
	pickerWrapper: {
		borderWidth: 1,
		borderRadius: 10,
		marginRight: 10,
		marginLeft: 5,
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
	pickerNormal: {
		borderColor: "#ddd",
	},
	pickerError: {
		borderColor: "red",
	},
	pickerText: {
		position: "absolute",
		left: 10,
		zIndex: 1,
	},
	picker: {
		width: 125,
		height: 30,
	},
});

export default HomonymCard;
