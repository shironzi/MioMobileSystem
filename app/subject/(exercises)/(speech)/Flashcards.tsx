import ActivityProgress from "@/components/activityProgress";
import HeaderConfig from "@/utils/HeaderConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getActivityById } from "@/utils/specialized";

const initialData = [
  {
    id: 1,
    word: "Mio A Web and Mobile Oralism Based Learning Management System with Online Enrollment, Speech and Auditory using Automatic Speech Recognition based Recurrent Neural Network for Philippine Institute for the Deaf.",
  },
  {
    id: 2,
    word: "Banana",
  },
  {
    id: 3,
    word: "Orange",
  },
  {
    id: 4,
    word: "Grapes",
  },
  {
    id: 5,
    word: "Strawberry",
  },
];

const Flashcards = () => {
  HeaderConfig("Picture Flashcards");
  const router = useRouter();

  const { subjectId, difficulty, activityType, category, activityId } =
    useLocalSearchParams<{
      activityType: string;
      difficulty: string;
      category: string;
      subjectId: string;
      activityId: string;
    }>();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState<{ id: string; word: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<number | null>(null);

  const currentCard = useMemo(() => {
    return cards[currentCardIndex];
  }, [cards, currentCardIndex]);

  const handleMicPress = useCallback(() => {
    setIsRecording(true);

    timerRef.current = setTimeout(() => {
      setIsRecording(false);
      setIsAnswered(true);
    }, 8000);
  }, []);

  const handleNext = useCallback(() => {
    if (!isRecording) {
      if (currentCardIndex < cards.length - 1) {
        setIsAnswered(false);
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        router.push({
          pathname: "/subject/(sub-details)/scoreDetails",
        });
      }
    }
  }, [router, isRecording, currentCardIndex, cards.length]);

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await getActivityById(
        subjectId,
        activityType,
        difficulty,
        activityId,
      );

      const data = res.activities;

      const formattedData = Object.entries(data).map(
        ([id, value]: [string, any]) => ({
          id,
          word: value.value,
        }),
      );

      setCards(formattedData);

      setLoading(false);
    };

    fetchActivity();
  }, [subjectId, activityType, difficulty, activityId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityProgress
        difficulty={difficulty}
        totalItems={cards.length}
        completedItems={currentCardIndex}
        instruction="Guess the picture"
      />

      <View style={styles.flashcardContainer}>
        <Image
          source={require("@/assets/images/orange.png")}
          style={{ width: 90, height: 50 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.flashcardText}>{currentCard.word}</Text>
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
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
    height: 300,
    borderRadius: 15,
  },
  textContainer: {
    margin: "auto",
    textAlign: "center",
  },
  flashcardText: {
    fontSize: 24,
    flexWrap: "wrap",
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

export default memo(Flashcards);
