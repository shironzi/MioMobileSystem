import { useFocusEffect, useRouter } from "expo-router";
import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ActivityProgress from "@/components/activityProgress";
import HeaderConfig from "@/components/HeaderConfig";

const initialData = [
  {
    id: 1,
    imageSrc: require("@/assets/flashcards/apple.jpg"),
    word: "Apple",
    isAnswered: false,
  },
  {
    id: 2,
    imageSrc: require("@/assets/flashcards/fireExtinguisher.jpg"),
    word: "Banana",
    isAnswered: false,
  },
  {
    id: 3,
    imageSrc: require("@/assets/flashcards/scissors.png"),
    word: "Orange",
    isAnswered: false,
  },
  {
    id: 4,
    imageSrc: require("@/assets/flashcards/teacher.jpg"),
    word: "Grapes",
    isAnswered: false,
  },
  {
    id: 5,
    imageSrc: require("@/assets/flashcards/whisper.png"),
    word: "Strawberry",
    isAnswered: false,
  },
];

const Picgame = () => {
  const router = useRouter();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState(initialData);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCard = cards[currentCardIndex];

  const completedItemsCount = cards.filter((card) => card.isAnswered).length;

  HeaderConfig("Picture Flashcards");

  const handleMicPress = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeLeft(8);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            handleCorrectAnswer();
            setIsRecording(false);
            return 8;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      handleCorrectAnswer();
      setIsRecording(false);
      setTimeLeft(8);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleCorrectAnswer = () => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[currentCardIndex].isAnswered = true;
      return updatedCards;
    });
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      router.push({
        pathname: "/(course)/(sub-details)/scoreDetails",
      });
    }
  };

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty="Easy"
        totalItems={cards.length}
        completedItems={completedItemsCount}
        instruction="Guess the picture"
      />

      <View style={styles.flashcardContainer}>
        <View>
          <Image
            source={require("@/assets/orange.png")}
            style={{width:90, height:50 }}
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
        <Text style={!isRecording ? { opacity: 0 } : styles.recordingText}>
          Listening...
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !currentCard.isAnswered && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={!currentCard.isAnswered}
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
    backgroundColor: "#FFBF18",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default memo(Picgame);
