import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const level = () => {
	const router = useRouter();

	const { activity, category, subjectId } = useLocalSearchParams<{
		activity: string;
		category: string;
		subjectId: string;
	}>();

	HeaderConfig("Levels");

	const handleEasyRoute = () =>
		router.push({
			pathname: "/subject/(exercises)/play",
			params: {
				subjectId: subjectId,
				activityType: activity,
				difficulty: "easy",
				category: category,
			},
		});

	const handleAverageRoute = () =>
		router.push({
			pathname: "/subject/(exercises)/play",
			params: {
				subjectId: subjectId,
				activityType: activity,
				difficulty: "Average",
				category: category,
			},
		});

	const handleDifficultRoute = () =>
		router.push({
			pathname: "/subject/(exercises)/play",
			params: {
				subjectId: subjectId,
				activityType: activity,
				difficulty: "Difficult",
				category: category,
			},
		});

	const handleChallengeRoute = () =>
		router.push({
			pathname: "/subject/(exercises)/play",
			params: {
				subjectId: subjectId,
				activityType: activity,
				difficulty: "Challenge",
				category: category,
			},
		});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Select Difficulty</Text>
			<View style={styles.cardContainer}>
				<TouchableOpacity style={styles.card} onPress={handleEasyRoute}>
					<MaterialIcons
						name="star"
						size={30}
						color="#009c41"
						style={styles.icon}
					/>
					<Text style={[styles.cardText, { color: "#009c41" }]}>Easy</Text>
				</TouchableOpacity>
				<View style={styles.divider} />
				<TouchableOpacity style={styles.card} onPress={handleAverageRoute}>
					<MaterialIcons
						name="star"
						size={30}
						color="#FFda03"
						style={styles.icon}
					/>
					<Text style={[styles.cardText, { color: "#FFda03" }]}>Average</Text>
				</TouchableOpacity>
				<View style={styles.divider} />
				<TouchableOpacity style={styles.card} onPress={handleDifficultRoute}>
					<MaterialIcons
						name="star"
						size={30}
						color="#FFa700"
						style={styles.icon}
					/>
					<Text style={[styles.cardText, { color: "#FFa700" }]}>Difficult</Text>
				</TouchableOpacity>
				<View style={styles.divider} />
				<TouchableOpacity style={styles.card} onPress={handleChallengeRoute}>
					<MaterialIcons
						name="star"
						size={30}
						color="#FF0000"
						style={styles.icon}
					/>
					<Text style={[styles.cardText, { color: "#FF0000" }]}>Challenge</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
		// alignItems: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: 500,
		marginBottom: 20,
		color: "#000",
		left: 0,
	},
	cardContainer: {
		display: "flex",
		width: "100%",
		justifyContent: "space-around",
		top: -20,
		// flexWrap: "wrap",
		// gap: 20,
	},
	card: {
		width: "100%",
		height: 70,
		backgroundColor: "#fff",
		borderRadius: 10,
		top: 20,
		marginTop: 20,
		// elevation: 5,
	},
	cardText: {
		// marginTop: 10,
		left: 50,
		marginTop: -30,
		fontSize: 20,
		fontWeight: "bold",
		color: "#000",
	},

	icon: {
		left: 0,
		marginTop: -10,
	},
	divider: {
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
		marginVertical: -5,
		width: "110%",
		left: -18,
	},
});

export default memo(level);
