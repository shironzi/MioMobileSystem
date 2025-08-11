import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const FeedbackAlert = ({
  message,
  onHide,
}: {
  message: string;
  onHide: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.feedbackContainer}>
      <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
        <Text style={styles.alertText}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    alignSelf: "center",
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 5,
    width: "80%",
  },
  alertText: {
    color: "#fff",
    fontSize: 16,
  },
  feedbackContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

export default FeedbackAlert;
