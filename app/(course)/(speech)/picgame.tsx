import { useFocusEffect, useNavigation } from "expo-router";
import React, { memo, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

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
  const navigation = useNavigation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [cards, setCards] = useState(initialData);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCard = cards[currentCardIndex];

  const handleMicPress = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setTimeLeft(8); // Reset timer

      // Start the countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up, stop recording
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
      setTimeLeft(8); // Reset timer
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

    setCompletedCards((prev) => new Set([...prev, currentCardIndex]));
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Picture Flashcards",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.difficultyText}>Easy</Text>
        <View style={styles.progressRow}>
          {cards.map((card, index) => (
            <View
              key={index}
              style={[
                styles.progressItem,
                card.isAnswered && styles.completedProgressItem,
              ]}
            />
          ))}
        </View>
        <Text style={styles.instructionText}>
          Say what you see in the picture
        </Text>
      </View>

      <View style={styles.flashcardContainer}>
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
        <View
          style={{
            flexDirection: "row",
            marginTop: 13,
            gap: 10,
          }}
        >
          {data?.map((ques, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                borderColor: "#CBCBCB",
                borderWidth: 1,
                backgroundColor: "#CBCBCB",
                borderRadius: 5,
                height: 25,
                width: "auto",
              }}
            />
          ))}
        </View>
        <Text style={{ color: "#434242", fontSize: 15, marginTop: 25 }}>
          Guess the picture
        </Text>
      </View>
    </View>
  );
};

export default memo(picgame);
