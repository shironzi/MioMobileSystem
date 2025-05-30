import globalStyles from "@/styles/globalStyles";
import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const ScoreFeedback = (props: { percentage: number }) => {
  return (
    <View style={[globalStyles.cardContainer, { rowGap: 10 }]}>
      <Text style={styles.sectionTitle}>Feedback</Text>
      <View style={styles.feedbackRow}>
        <Image
          source={require("@/assets/images/face/red.png")}
          style={
            props.percentage < 40
              ? styles.feedbackIconSelectedStyle
              : styles.feedbackIconStyle
          }
        />
        <Image
          source={require("@/assets/images/face/yellow.png")}
          style={
            props.percentage >= 40 && props.percentage < 60
              ? styles.feedbackIconSelectedStyle
              : styles.feedbackIconStyle
          }
        />
        <Image
          source={require("@/assets/images/face/blue.png")}
          style={
            props.percentage >= 60 && props.percentage < 85
              ? styles.feedbackIconSelectedStyle
              : styles.feedbackIconStyle
          }
        />
        <Image
          source={require("@/assets/images/face/green.png")}
          style={
            props.percentage >= 85
              ? styles.feedbackIconSelectedStyle
              : styles.feedbackIconStyle
          }
        />
      </View>
      <Text style={styles.feedbackText}>
        Great effort! Keep practicing and paying attention to details—you're
        getting better! Try again and see if you can improve your score. You're
        on the right track!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackIconStyle: {
    width: "20%",
    height: 80,
    resizeMode: "contain",
  },

  feedbackIconSelectedStyle: {
    width: "30%",
    paddingHorizontal: 10,
    height: 120,
    resizeMode: "contain",
  },
  feedbackText: {
    paddingHorizontal: 20,
    textAlign: "center" as const,
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 28,
  },
  sectionTitle: {
    fontWeight: "bold" as const,
    fontSize: 18,
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ScoreFeedback;
