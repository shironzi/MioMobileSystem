import LoadingCard from "@/components/loadingCard";
import PlayCard from "@/components/playCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { getSpecializedActivities } from "@/utils/specialized";
import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

const Play = () => {
	HeaderConfig("Play");

	const { activity_type, difficulty, category, subjectId, role } =
		useLocalSearchParams<{
			subjectId: string;
			activity_type: string;
			difficulty: string;
			category: string;
			role: string;
		}>();

	const [activities, setActivities] = useState<string[]>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const res = await getSpecializedActivities(
					subjectId,
					activity_type,
					difficulty
				);

				setActivities(res.activities);
				setLoading(false);
			} catch (err) {
				console.error("Get Activities Fetch Failed: " + err);
				Alert.alert("Error", "Failed to load activities.");
			}
		};

		fetchActivities();
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

	if (!activities || activities.length === 0) {
		return (
			<View style={globalStyles.container}>
				<Text>No activities found.</Text>
			</View>
		);
	}

	const difficultyStyles: Record<
		string,
		{ backgroundColor: string; borderColor: string }
	> = {
		easy: { backgroundColor: "#C8FFB7", borderColor: "#439558" },
		average: { backgroundColor: "#ffe9ae", borderColor: "#ffbf18" },
		difficult: { backgroundColor: "#FFCEA1", borderColor: "#FF7A00" },
		challenge: { backgroundColor: "#FFB1B1", borderColor: "#DB4141" },
	};

	const renderHeaderCard = () => {
		switch (difficulty?.toLowerCase()) {
			case "easy":
				return (
					<View style={[styles.subLevel, difficultyStyles.easy]}>
						<Fontisto
							name="star"
							size={40}
							color="#439558"
							style={styles.shape1}
						/>
						<Text style={styles.try}>TRY THE</Text>
						<Text style={styles.name}>Easy Mode</Text>
						<Fontisto
							name="star"
							size={70}
							color="#439558"
							style={styles.shape2}
						/>
					</View>
				);
			case "average":
				return (
					<View style={[styles.subLevel, difficultyStyles.average]}>
						<Ionicons
							name="square"
							size={40}
							color="#ffbf18"
							style={styles.shape1}
						/>
						<Text style={styles.try}>TRY THE</Text>
						<Text style={styles.name}>Average Mode</Text>
						<Ionicons
							name="square"
							size={70}
							color="#ffbf18"
							style={styles.shape2}
						/>
					</View>
				);
			case "difficult":
				return (
					<View style={[styles.subLevel, difficultyStyles.difficult]}>
						<Ionicons
							name="triangle"
							size={40}
							color="#FF7A00"
							style={styles.shape1}
						/>
						<Text style={styles.try}>TRY THE</Text>
						<Text style={styles.name}>Difficult Mode</Text>
						<Ionicons
							name="triangle"
							size={70}
							color="#FF7A00"
							style={styles.shape2}
						/>
					</View>
				);
			case "challenge":
				return (
					<View style={[styles.subLevel, difficultyStyles.challenge]}>
						<FontAwesome
							name="circle"
							size={40}
							color="#DB4141"
							style={styles.shape1}
						/>
						<Text style={styles.try}>TRY THE</Text>
						<Text style={styles.name}>Challenge Mode</Text>
						<FontAwesome
							name="circle"
							size={70}
							color="#DB4141"
							style={styles.shape2}
						/>
					</View>
				);
			default:
				return null;
		}
	};

	const renderItem = (item: { item: string; index: number }) => (
		<PlayCard
			id={item.index}
			label="Play"
			activity_type={activity_type}
			difficulty={difficulty}
			category={category}
			subjectId={subjectId}
			activityId={item.item}
			role={role}
		/>
	);

	return (
		<View
			style={[
				globalStyles.container,
				{ marginHorizontal: -20, marginTop: -20 },
			]}
		>
			<FlatList
				data={activities}
				renderItem={renderItem}
				keyExtractor={(item) => item}
				ListHeaderComponent={renderHeaderCard}
				contentContainerStyle={styles.listContainer}
				style={{ paddingHorizontal: 5 }}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 20,
	},
	listContainer: {
		paddingBottom: 20,
	},
	row: {
		marginBottom: 15,
	},
	shape1: {
		transform: [{ rotate: "-15deg" }],
		left: 20,
		top: -15,
	},
	shape2: {
		position: "absolute",
		transform: [{ rotate: "20deg" }],
		left: 250,
		top: 45,
	},
	try: {
		fontSize: 12,
		fontWeight: 400,
		left: 90,
		top: -12,
	},
	name: {
		fontSize: 16,
		fontWeight: 500,
		left: 90,
		top: -10,
	},
	subLevel: {
		margin: 20,
		borderWidth: 1,
		borderRadius: 20,
		height: 100,
		overflow: "hidden",
		position: "relative",
	},
});

export default memo(Play);
