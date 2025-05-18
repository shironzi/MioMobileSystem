import React, { useState, memo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BingoCard from "@/components/trainingActivities/auditory/bingoCard";
import { FontAwesome6 } from "@expo/vector-icons";
import HeaderConfig from "@/utils/HeaderConfig";
import { useRouter } from "expo-router";

const Data = [
  { id: "1", image: require("@/assets/images/flashcards/apple.jpg"), word: "bird" },
  { id: "2", image: require("@/assets/images/logo.png"), word: "fence" },
  {
    id: "3",
    image: require("@/assets/images/flashcards/fireExtinguisher.jpg"),
    word: "fence",
  },
  { id: "4", image: require("@/assets/images/flashcards/scissors.png"), word: "bird" },
  { id: "5", image: require("@/assets/images/flashcards/teacher.jpg"), word: "Dog" },
  { id: "6", image: require("@/assets/images/dashImage/english.png"), word: "fence" },
  { id: "7", image: require("@/assets/images/dashImage/math.png"), word: "Cat" },
  { id: "8", image: require("@/assets/images/dashImage/social.png"), word: "Cherry" },
  { id: "9", image: require("@/assets/images/dashImage/speech.png"), word: "Rabbit" },
  { id: "10", image: require("@/assets/images/dashImage/speech.png"), word: "Apple" },
  { id: "11", image: require("@/assets/images/dashImage/speech.png"), word: "Lemon" },
  {
    id: "12",
    image: require("@/assets/images/dashImage/speech.png"),
    word: "Cucumber",
  },
];

const UNIQUE_WORDS = Array.from(new Set(Data.map((d) => d.word))); // audio

const bingo = () => {
  const router = useRouter();
  HeaderConfig("Bingo Cards");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCardPress = (id: string): void => {
    if (!matchedIds.includes(id)) {
      setMatchedIds([...matchedIds, id]);
    }
  };

  const goNext = useCallback(() => {
    if (currentIndex < UNIQUE_WORDS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      router.push("/subject/(sub-details)/scoreDetails");
    }
  }, [currentIndex, router]);

  const playAudio = useCallback(
    (duration = 5000) => {
      setIsPlaying(true);

      const timer = setTimeout(() => {
        setIsPlaying(false);
        goNext();
        console.log("Audio has finished playing.");
      }, duration);

      return () => clearTimeout(timer);
    },
    [goNext]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.difficulty}>Easy</Text>
      <FlatList
        style={styles.bingoCards}
        data={Data}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BingoCard
            image={item.image}
            isMatched={matchedIds.includes(item.id)}
            onPress={() => handleCardPress(item.id)}
          />
        )}
      />

      <View style={styles.playAudioContainer}>
        <TouchableOpacity
          style={[
            styles.speakerIcon,
            isPlaying
              ? { backgroundColor: "#FFBF18" }
              : { backgroundColor: "#DEDFE2" },
          ]}
          onPress={() => playAudio()}
        >
          <FontAwesome6 name="volume-high" size={25} color="#fff" />
        </TouchableOpacity>
        {isPlaying && <Text style={styles.listen}>Playing…</Text>}
      </View>
      <TouchableOpacity
        onPress={goNext}
        style={[
          styles.nextButton,
          !isPlaying && matchedIds.length > 1
            ? { backgroundColor: "#FFBF18" }
            : { backgroundColor: "#DEDFE2" },
        ]}
        disabled={isPlaying}
      >
        <Text style={styles.nextText}>
          {currentIndex < UNIQUE_WORDS.length - 1 ? "Next" : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 10,
  },
  difficulty: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    height: "5%",
    left: 5,
  },
  bingoCards: {
    margin: 10,
    left: 2,
    marginHorizontal: -5,
    height: "70%",
    marginTop: 10,
  },
  speakerIcon: {
    borderRadius: 180,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: -60,
    left: 5,
  },
  listen: {
    fontSize: 18,
    color: "#ffbf18",
    marginTop: -130,
  },
  playAudioContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    height: "8%",
  },
  nextButton: {
    padding: 17,
    borderRadius: 50,
    alignItems: "center",
    marginTop: -30,
    margin: 10,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(bingo);
