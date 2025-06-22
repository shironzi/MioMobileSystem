import ScoreFeedback from "@/components/ScoreFeedback";
import globalStyles from "@/styles/globalStyles";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import { useLocalSearchParams } from "expo-router";
import React, { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const AuditoryScores = () => {
  headerConfigScoreDetails("Score Detail");

  const { score, activity_type, difficulty } = useLocalSearchParams<{
    score: string;
    activity_type: string;
    difficulty: string;
  }>();

  const fill = !isNaN(parseFloat(score)) ? parseFloat(score) : 0;

  const getTitle = (type: string) => {
    switch (type) {
      case "picture":
        return "Picture Flashcards";
      case "pronunciation":
        return "ReadMe: Pronunciation Challenge";
      case "phrases":
        return "Phrase Flashcards";
      case "question":
        return "Question Flashcards";
      case "bingo":
        return "Bingo Cards";
      case "matching":
        return "Matching Cards";
      default:
        return "Activity";
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[globalStyles.container, { rowGap: 20, flex:1 }]}>
        <View style={{marginHorizontal:15}}>
          <Text style={styles.title}>{getTitle(activity_type)}</Text>
          <Text style={styles.subtitle}>{difficulty}</Text>
        </View>

        <View style={[globalStyles.cardContainer, {}]}>
          <Text style={styles.sectionTitle}>Score</Text>
          <View style={styles.scoreRow}>
            <AnimatedCircularProgress
              size={150}
              width={5}
              fill={parseFloat(score)}
              tintColor="#2264DC"
              backgroundColor="#fff"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <>
                  <Text style={styles.scoreText}>{fill}</Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text>Out of 100 points</Text>
          </View>
        </View>

        <ScoreFeedback percentage={parseFloat(score)} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    lineHeight: 28,
    fontWeight: "500" as const,
    fontSize: 18,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 300 as const,
    lineHeight: 28,
    textTransform:"capitalize"
  },
  sectionTitle: {
    fontWeight: 500 as const,
    fontSize: 18,
    marginVertical: 10,
    marginBottom:20
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 0,
  },
  scoreText: {
    fontSize: 24,
    color: "#1F1F1F",
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackText: {
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 28,
  },
  cardContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth:1
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  correctText: {
    color: "green",
    marginBottom: 4,
  },
  incorrectText: {
    color: "red",
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackIconStyle: {
    width: "20%",
    height: 80,
    resizeMode: "contain" as const,
  },
  feedbackIconSelectedStyle: {
    width: "30%",
    paddingHorizontal: 10,
    height: 120,
    resizeMode: "contain" as const,
  },
});

export default memo(AuditoryScores);
