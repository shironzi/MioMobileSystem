import PlayCard from "@/components/playCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { getActivities } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Play = () => {
	HeaderConfig("Play");

	const { activityType, difficulty, category, subjectId } =
		useLocalSearchParams<{
			subjectId: string;
			activityType: string;
			difficulty: string;
			category: string;
		}>();

	const [activities, setActivities] = useState<string[]>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const res = await getActivities(subjectId, activityType, difficulty);

				setActivities(res.activities);
				setLoading(false);
			} catch (err) {
				console.error("Get Activities Fetch Failed: " + err);
			}
		};

		fetchActivities();
	}, [subjectId, activityType, difficulty]);

	if (loading) {
		return (
			<View>
				<Text>Loading.......</Text>
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

	const renderItem = (item: { item: string; index: number }) => (
		<PlayCard
			id={item.index}
			label="Play"
			activityType={activityType}
			difficulty={difficulty}
			category={category}
			subjectId={subjectId}
			activityId={item.item}
		/>
	);

	return (
		<View style={[globalStyles.container, { flex: 1 }]}>
			<Text style={styles.title}>Easy</Text>
			<FlatList
				data={activities}
				renderItem={renderItem}
				keyExtractor={(item) => item}
				numColumns={3}
				columnWrapperStyle={[
					styles.row,
					activities.length >= 3
						? { justifyContent: "space-between" }
						: { columnGap: 20 },
				]}
				contentContainerStyle={styles.listContainer}
				style={{ paddingHorizontal: 5 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: "500",
		color: "#000",
		marginBottom: 20,
	},
	listContainer: {
		paddingBottom: 20,
	},
	row: {
		marginBottom: 15,
	},
});

export default memo(Play);
