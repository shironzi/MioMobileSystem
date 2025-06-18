import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const difficultyColors: Record<string, string> = {
	easy: "#439558",
	Average: "#ffbf18",
	Difficult: "#FF7A00",
	Challenge: "#DB4141",
};

const PlayCard = (props: {
	id: number;
	label: string;
	activity_type: string;
	difficulty: string;
	category: string;
	subjectId: string;
	activityId: string;
	role: string;
}) => {
	const router = useRouter();

	const handleCategory = () => {
		if (
			props.activity_type === "picture" ||
			props.activity_type === "pronunciation" ||
			props.activity_type === "phrase" ||
			props.activity_type === "question"
		) {
			router.push({
				pathname:
					props.role === "teacher"
						? "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity"
						: "/subject/(exercises)/ViewActivity",
				params: {
					subjectId: props.subjectId,
					activity_type: props.activity_type,
					difficulty: props.difficulty,
					category: props.category,
					activityId: props.activityId,
				},
			});
		} else if (
			props.activity_type === "bingo" ||
			props.activity_type === "matching"
		) {
			router.push({
				pathname:
					props.role === "teacher"
						? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
						: "/subject/(exercises)/ViewActivity",
				params: {
					subjectId: props.subjectId,
					activity_type: props.activity_type,
					difficulty: props.difficulty,
					category: props.category,
					activityId: props.activityId,
				},
			});
		} else if (
			props.activity_type === "fill" ||
			props.activity_type === "homonyms"
		) {
			router.push({
				pathname:
					props.role === "teacher"
						? "/subject/(exercises)/(language)/ManageActivity/AddLanguageActivity"
						: "/subject/(exercises)/ViewActivity",
				params: {
					subjectId: props.subjectId,
					activity_type: props.activity_type,
					difficulty: props.difficulty,
					category: props.category,
					activityId: props.activityId,
				},
			});
		}
	};

	const difficultyColor =
		difficultyColors[props.difficulty.toLowerCase()] || "#aaa";

	return (
		<TouchableOpacity style={styles.card} onPress={handleCategory}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					top: 25,
					left: -30,
				}}
			>
				<FontAwesome
					name="circle"
					size={13}
					color={difficultyColor}
					style={styles.icon}
				/>
				<Text style={styles.cardNumber}>Exercise {props.id + 1}</Text>
			</View>
			<View style={[styles.play, { backgroundColor: difficultyColor }]}>
				<Text
					style={{
						color: "#fff",
						alignSelf: "center",
						top: 6,
						fontWeight: "300",
						fontSize: 12,
					}}
				>
					Play!
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 20,
		marginHorizontal: 20,
		marginVertical: 10,
		top: -10,
		height: 70,
	},
	icon: {
		alignSelf: "center",
	},
	play: {
		height: 30,
		width: "30%",
		alignSelf: "flex-end",
		borderTopLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginTop: 18,
	},
	cardNumber: {
		fontSize: 14,
		color: "#000",
		left: -100,
		fontWeight: "400",
	},
});

export default memo(PlayCard);
