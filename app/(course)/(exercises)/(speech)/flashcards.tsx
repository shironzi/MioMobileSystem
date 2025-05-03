import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ActivityProgress from "@/components/activityProgress";
import HeaderConfig from "@/components/HeaderConfig";

const initialData = [
  {
    id: 1,
    imageSrc: require("@/assets/flashcards/apple.jpg"),
    word: "Apple",
  },
  {
    id: 2,
    imageSrc: require("@/assets/flashcards/fireExtinguisher.jpg"),
    word: "Banana",
  },
  {
    id: 3,
    imageSrc: require("@/assets/flashcards/scissors.png"),
    word: "Orange",
  },
  {
    id: 4,
    imageSrc: require("@/assets/flashcards/teacher.jpg"),
    word: "Grapes",
  },
  {
    id: 5,
    imageSrc: require("@/assets/flashcards/whisper.png"),
    word: "Strawberry",
  },
];

const Picgame = () => {
  HeaderConfig("Picture Flashcards");
  const router = useRouter();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState(initialData);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentCard = useMemo(() => {
    return cards[currentCardIndex];
  }, [cards, currentCardIndex]);

  const handleMicPress = useCallback(() => {
    setIsRecording(true);

    const timer = setTimeout(() => {
      setIsRecording(false);
      setIsAnswered(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = useCallback(() => {
    if (!isRecording) {
      if (currentCardIndex < cards.length - 1) {
        setIsAnswered(false);
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        router.push({
          pathname: "/(course)/(sub-details)/scoreDetails",
        });
      }
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty="Easy"
        totalItems={cards.length}
        completedItems={currentCardIndex}
        instruction="Guess the picture"
      />

      <View style={styles.flashcardContainer}>
        <View>
          <Image
            source={require("@/assets/orange.png")}
            style={{ width: 90, height: 50 }}
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={currentCard.imageSrc}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.micContainer}>
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.recordingButton]}
          onPress={handleMicPress}
        >
          <FontAwesome
            name="microphone"
            size={50}
            color={isRecording ? "#fff" : "black"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.recordingText,
            isRecording ? { opacity: 100 } : { opacity: 0 },
          ]}
        >
          Listening...
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isAnswered && !isRecording
              ? { backgroundColor: "#FFBF18" }
              : { backgroundColor: "#E0E0E0" },
          ]}
          onPress={handleNext}
          disabled={!isAnswered || isRecording}
        >
          <Text style={styles.continueButtonText}>
            {currentCardIndex === cards.length - 1 ? "Submit" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  flashcardContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    marginBottom: 0,
    height: 300,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  cardImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: -90,
  },
  micContainer: {
    alignItems: "center",
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingButton: {
    backgroundColor: "#FFBF18",
  },
  recordingText: {
    marginTop: 15,
    color: "#FFBF18",
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 70,
  },
  continueButton: {
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default memo(Picgame);
