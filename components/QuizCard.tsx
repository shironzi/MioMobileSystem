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

const QuizCard = (props: {
  quiz_id: string;
  subjectId: string;
  total_points: string;
  title: string;
  role: string;
  handleDelete: () => void;
}) => {
  const router = useRouter();

  const handleSelect = () => {
    if (props.role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/quiz/AddQuiz",
        params: {
          subjectId: props.subjectId,
          quizId: props.quiz_id,
        },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/quiz/ViewActivity",
        params: {
          subjectId: props.subjectId,
          quizId: props.quiz_id,
        },
      });
    }
  };

  const translatedX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (props.role !== "teacher") return;
      if (e.translationX < 0 && e.translationX > -110) {
        translatedX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (props.role !== "teacher") return;
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
              <Text style={styles.score}> / {props.total_points}</Text>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.deadline}></View>
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
    backgroundColor: "#db4141",
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 20,
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
});

export default memo(QuizCard);
