import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type ActivityProgressProps = {
  difficulty: string;
  totalItems: number;
  completedItems: number;
  instruction: string;
};

const ActivityProgress = ({
  difficulty,
  totalItems,
  completedItems,
  instruction,
}: ActivityProgressProps) => {
  const progressItems = useMemo(
    () => Array(totalItems).fill(null),
    [totalItems],
  );

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.difficultyText}>{difficulty}</Text>
      <View style={styles.progressRow}>
        {progressItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressItem,
              index < completedItems && styles.completedProgressItem,
            ]}
          />
        ))}
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Piddie Tips!</Text>
        <Text style={styles.instructionsText}>{instruction}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "transparent",
    marginBottom: 20,
    width: "100%",
  },
  difficultyText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
    marginBottom: 5,
    textTransform: "capitalize",
    marginTop: -10,
  },
  progressRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 5,
  },
  progressItem: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#ddd",
    borderRadius: 5,
    height: 30,
  },
  completedProgressItem: {
    backgroundColor: "#FFBF18",
    borderColor: "#FFBF18",
  },
  instructionsText: {
    marginTop: 5,
    margin: 10,
    textAlign: "justify",
    fontWeight: "300",
  },
  instructionsTitle: {
    marginHorizontal: 10,
    textAlign: "justify",
    fontWeight: "500",
    fontSize: 16,
    color: "#2264dc",
    marginTop: 10,
  },
  instructionsContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
});

export default memo(ActivityProgress);
