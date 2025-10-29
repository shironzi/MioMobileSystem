import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import {
  createPictureSpeechActivity,
  updatePictureActivity,
} from "@/utils/specialized";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useMemo, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface PictureItem {
  id: string;
  flashcard_id: string | null;
  file: FileInfo | null;
  text: string;
  image_url: string;
}

const PictureFlashcards = () => {
  useHeaderConfig("Flashcards");

  const {
    subjectId,
    activity_type,
    difficulty,
    activityId,
    data,
    title,
    isRemedial,
    selectedActivityId,
  } = useLocalSearchParams<{
    subjectId: string;
    activity_type: string;
    difficulty: string;
    activityId: string;
    data: string;
    title: string;
    isRemedial: string;
    selectedActivityId: string;
  }>();

  const parsedBingoItems = useMemo<PictureItem[]>(() => {
    try {
      return JSON.parse(data || "[]");
    } catch {
      return [];
    }
  }, [data]);

  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = activityId
        ? await updatePictureActivity(
            subjectId,
            difficulty,
            activityId,
            parsedBingoItems,
            title,
            isRemedial,
          )
        : await createPictureSpeechActivity(
            subjectId,
            parsedBingoItems,
            activity_type,
            difficulty,
            title,
            isRemedial,
            selectedActivityId,
          );

      if (res.success) {
        Alert.alert(
          "Success",
          res.message,
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (err) {
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }

    setIsSubmitting(false);
  };

  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleNext = () => {
    if (currentCard < parsedBingoItems.length - 1) {
      opacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 1500 }),
      );
      setCurrentCard((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      opacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 1500 }),
      );
      setCurrentCard((prev) => prev - 1);
    }
  };

  if (!parsedBingoItems.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No flashcards to preview.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.flashcardContainer}>
        <Image
          source={require("@/assets/images/face/echo.png")}
          style={styles.bannerLogo}
          resizeMode="contain"
        />
        <Animated.Image
          source={{
            uri:
              parsedBingoItems[currentCard].file?.uri ??
              parsedBingoItems[currentCard].image_url,
          }}
          style={[styles.flashcardImage, animatedStyle]}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.nextButtonWrapper}>
        <TouchableOpacity
          disabled={currentCard >= parsedBingoItems.length - 1}
          style={[
            styles.nextButton,
            currentCard >= parsedBingoItems.length - 1
              ? styles.nextButtonDisabled
              : styles.nextButtonActive,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <FontAwesome6 name="arrow-right-long" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={currentCard <= 0}
          style={[
            styles.prevButton,
            currentCard <= 0
              ? styles.nextButtonDisabled
              : styles.nextButtonActive,
          ]}
          onPress={handlePrev}
        >
          <FontAwesome6 name="arrow-left-long" size={16} color="#fff" />
          <Text style={styles.nextButtonText}>Prev</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.submitWrapper, { flexDirection: "row", columnGap: 10 }]}
      >
        <TouchableOpacity
          style={[globalStyles.inactivityButton, { width: "48%" }]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.inactivityButtonText}>
            {" "}
            Cancel
            {/* {activityId ? "Update" : "Create"} Activity */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            {activityId
              ? isSubmitting
                ? "Updating"
                : "Update"
              : isSubmitting
                ? "Creating"
                : "Create"}
          </Text>
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
  },
  flashcardContainer: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  bannerLogo: {
    position: "absolute",
    width: 90,
    height: 50,
    left: 17,
    top: 20,
    zIndex: 100,
  },
  flashcardImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 40,
  },
  flashcardText: {
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  nextButtonWrapper: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    borderRadius: 15,
    width: 100,
    position: "absolute",
    right: 0,
  },
  prevButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    borderRadius: 15,
    width: 100,
    position: "absolute",
    left: 0,
  },
  nextButtonActive: {
    backgroundColor: "#FFBF18",
  },
  nextButtonDisabled: {
    backgroundColor: "#aaa",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 14,
  },
  submitWrapper: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    width: "100%",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 100,
    textAlign: "center",
    color: "#333",
  },
});

export default memo(PictureFlashcards);
