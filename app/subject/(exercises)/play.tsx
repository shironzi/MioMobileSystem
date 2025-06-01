import HeaderConfig from "@/utils/HeaderConfig";
import PlayCard from "@/components/playCard";
import React, { memo, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { getActivities } from "@/utils/specialized";

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
        const res = await getActivities(subjectId, activity_type, difficulty);

        setActivities(res.activities);
        setLoading(false);
      } catch (err) {
        console.error("Get Activities Fetch Failed: " + err);
      }
    };

    fetchActivities();
  }, [subjectId, activity_type, difficulty]);

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
      activity_type={activity_type}
      difficulty={difficulty}
      category={category}
      subjectId={subjectId}
      activityId={item.item}
      role={role}
    />
  );

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>{difficulty}</Text>
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
});

export default memo(Play);
