import { FontAwesome6 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface Availability {
	start: string;
	deadline: string;
}

const assCard = (props: {
	assignment_id: string;
	subjectId: string;
	attempts: string;
	availability: Availability;
	createdAt: string;
	description: string;
	totalPoints: string;
	title: string;
	submission_type: string;
	role: string;
	handleDelete: () => void;
}) => {
	const router = useRouter();

	const handleSelect = () => {
		if (props.role === "teacher") {
			router.push({
				pathname: "/subject/(sub-details)/assignment/addAssignment",
				params: {
					subjectId: props.subjectId,
					assignmentId: props.assignment_id,
				},
			});
		} else {
			router.push({
				pathname: "/subject/(sub-details)/assignment/assignmentDetails",
				params: {
					assignmentId: props.assignment_id,
					attempts: props.attempts,
					title: props.title,
					description: props.description,
					createdAt: props.createdAt,
					availabilityStart: props.availability.start,
					availabilityEnd: props.availability.deadline,
					totalPoints: props.totalPoints,
					submission_type: props.submission_type,
				},
			});
		}
	};

	const translatedX = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			if (e.translationX < 0 && e.translationX > -110) {
				translatedX.value = e.translationX;
			}
		})
		.onEnd(() => {
			if (translatedX.value < -90) {
				translatedX.value = withTiming(-1000, { duration: 1500 });
				runOnJS(props.handleDelete)();
			}
			translatedX.value = withTiming(0, { duration: 700 });
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translatedX.value }],
	}));

	return (
		<View style={{ marginHorizontal: 20 }}>
			{props.role === "teacher" && (
				<View style={styles.deleteBackground}>
					<MaterialIcons name="delete" size={28} color="white" />
				</View>
			)}
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[animatedStyle]}>
					<TouchableOpacity
						onPress={handleSelect}
						style={styles.touchableOpacity}
					>
						<View style={styles.yellowBulletin} />
						<View style={styles.textContent}>
							<Text style={styles.title} numberOfLines={3}>
								{props.title}
							</Text>
							<Text style={styles.score}> / {props.totalPoints}</Text>
						</View>
						<View style={styles.rightSection}>
							<View style={styles.deadline}>
								<Text style={{ color: "#db4141" }}>Not Yet Submitted</Text>
							</View>
							<FontAwesome6 name="arrow-right-long" size={15} color="#1f1f1f" />
						</View>
					</TouchableOpacity>
				</Animated.View>
			</GestureDetector>
		</View>
	);
};

const styles = StyleSheet.create({
	touchableOpacity: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 20,
		borderColor: "#ddd",
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	deleteBackground: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#FF5646",
		paddingHorizontal: 30,
		justifyContent: "center",
		alignItems: "flex-end",
		borderRadius: 10,
		zIndex: 0,
	},
	yellowBulletin: {
		backgroundColor: "#FFBF18",
		height: 40,
		width: "1.5%",
		borderRadius: 100,
		marginRight: 20,
	},
	textContent: {
		flex: 1,
	},
	title: {
		fontSize: 14,
		color: "#000",
		fontWeight: "500",
		// marginBottom: 4,
		flexShrink: 1,
		flexWrap: "wrap",
	},
	score: {
		fontSize: 13,
		color: "#888",
	},
	deadline: {
		marginVertical: "auto",
		marginHorizontal: 10,
	},
	rightSection: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "center",
		marginHorizontal: 5,
	},
	// date: {
	//   fontSize: 12,
	//   color: "#888",
	//   marginBottom: 5,
	//   textAlign: "right",
	// },
	// icons: {
	//   flexDirection: "row",
	//   marginLeft: 5,
	//   marginRight: 5,
	//   top: -8,
	// },
});

export default memo(assCard);
