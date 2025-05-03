import React, { memo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "@rneui/themed";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type titleProps = {
  title: string;
  difficulty: string;
  actNo: string;
  attemptNo: string;
  score: number;
  totalQuestion: number;
  comments: { id: number; word: string }[];
};

const commentText =
  "Great effort! Keep practicing and paying attention to details—you're getting better! Try again and see if you can improve your score. You're on the right track!";

const ScoreDetailsCard = ({
  title,
  difficulty,
  actNo,
  attemptNo,
  score,
  totalQuestion,
  comments = [],
}: titleProps) => {
  const fillPercentage = totalQuestion > 0 ? (score / totalQuestion) * 100 : 0;

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.bold}>{difficulty}</Text>
        <Text>{actNo}</Text>
        <Text>{attemptNo}</Text>
      </View>

      <Card containerStyle={styles.cardContainer1}>
        <Text style={styles.scoreLabel}>Score</Text>
        <View style={styles.circleContainer}>
          <AnimatedCircularProgress
            size={100}
            width={5}
            fill={fillPercentage}
            tintColor="#ffbf18"
            backgroundColor="#e7eaea"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <Text style={styles.pointsLabel}>
                {score.toFixed(0.2)}
                {"\n"}Points
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.label}>Out of {totalQuestion} points</Text>
        </View>
      </Card>

      <Card containerStyle={styles.cardContainer2}>
        <Text style={[styles.scoreLabel, { left: -10 }]}>Feedback</Text>
        <View style={styles.faceRow}>
          <Image
            source={require("@/assets/face/red.png")}
            style={{ width: 60, height: 60 }}
          />
          <Image
            source={require("@/assets/face/yellow.png")}
            style={{ width: 80, height: 80, top: -10 }}
          />
          <Image
            source={require("@/assets/face/blue.png")}
            style={{ width: 50, height: 50, top: 5 }}
          />
          <Image
            source={require("@/assets/face/green.png")}
            style={{ width: 50, height: 50, top: 5 }}
          />
        </View>
        <Text style={styles.commentText}>{commentText}</Text>
      </Card>
      {/* <Card> */}
      {comments.map((item, index) => (
        <Card key={item.id} containerStyle={styles.cardContainer3}>
          <Text style={styles.noLabel}>Number {index + 1}</Text>
          <Text style={{left:10, fontSize:14}}>{item.word}</Text>
        </Card>
      ))}
        
      {/* </Card> */}

      
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    left: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 60,
    left: -50,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 14,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    margin: 10,
    marginTop: 10,
  },
  cardContainer1: {
    backgroundColor: "#fff",
    height: 190,
    left: -5,
    padding: 10,
    marginTop: 20,
    width: "95%",
    borderWidth: 0,
    borderRadius: 10,
    elevation: 5,
  },
  cardContainer2: {
    backgroundColor: "#fff",
    height: 300,
    left: -5,
    padding: 20,
    marginTop: 20,
    width: "95%",
    borderWidth: 0,
    borderRadius: 10,
    elevation: 5,
  },
  circleContainer: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    left: -60,
  },
  label: {
    color: "#000",
    fontSize: 14,
    alignSelf: "center",
    right: -120,
    top: -60,
  },
  pointsLabel: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    position: "absolute",
    top: "35%",
    left: "32%",
  },
  faceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  commentText: {
    fontSize: 16,
    justifyContent: "center",
    textAlign: "center",
    margin: 8,
    marginTop: 10,
    lineHeight: 25,
  },
  noLabel: {
    fontWeight: "bold",
    fontSize: 16,
    // marginBottom: 5,
    margin:10,
    marginTop:10,

  },
  cardContainer3: {
    backgroundColor: "#fff",
    padding: 15,
    paddingTop:5,
    paddingRight:30,
    marginTop: 20,
    borderWidth: 0,
    borderRadius: 10,
    elevation: 5,
    width:"95%",
    left: -5,
  },
});

export default memo(ScoreDetailsCard);
