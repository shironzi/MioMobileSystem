import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Svg, { Line } from "react-native-svg";
import HeaderConfig from "@/components/HeaderConfig";

const Data = [
  { id: "1", image: require("@/assets/flashcards/apple.jpg"), word: "bird" },
  { id: "2", image: require("@/assets/logo.png"), word: "fence" },
  {
    id: "3",
    image: require("@/assets/flashcards/fireExtinguisher.jpg"),
    word: "fence",
  },
  { id: "4", image: require("@/assets/flashcards/scissors.png"), word: "bird" },
  { id: "5", image: require("@/assets/flashcards/teacher.jpg"), word: "Dog" },
];

const { width, height } = Dimensions.get("window");

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  audioId: string;
}

interface AudioRef {
  x: number;
  y: number;
}

interface ImageRef {
  x: number;
  y: number;
}

const MatchingCards = () => {
  HeaderConfig("Matching Cards");

  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [answers, setAnswers] = useState<
    { audioId: string; imageId: string }[]
  >([]); // audio id to image id
  const audioRefs = useRef<Record<string, { x: number; y: number }>>({});
  const imageRefs = useRef<Record<string, { x: number; y: number }>>({});

  const handleImageTap = (imageId: string): void => {
    if (
      selectedAudioId &&
      audioRefs.current[selectedAudioId] &&
      imageRefs.current[imageId]
    ) {
      const start: AudioRef = audioRefs.current[selectedAudioId];
      const end: ImageRef = imageRefs.current[imageId];

      setConnections((prev: Connection[]) => [
        ...prev.filter((line) => line.audioId !== selectedAudioId),
        {
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          audioId: selectedAudioId,
        },
      ]);

      setAnswers((prev) => {
        const already = prev.some((a) => a.audioId === selectedAudioId);
        if (already) {
          // update existing pair
          return prev.map((a) =>
            a.audioId === selectedAudioId
              ? { audioId: selectedAudioId, imageId }
              : a
          );
        }
        return [...prev, { audioId: selectedAudioId, imageId }];
      });

      setSelectedAudioId(null);
    }
  };

  const handleSubmit = () => {
    console.log(answers.length);
  };

  return (
    <View style={{ flex: 1 }}>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        {connections.map((line, idx) => (
          <Line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="blue"
            strokeWidth="3"
          />
        ))}
      </Svg>

      <View style={{ padding: 20 }}>
        {Data.map((item, index) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={styles.itemContainer}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                audioRefs.current[item.id] = {
                  x: x + 125,
                  y: y + height / 2 + index * 120,
                };
              }}
            >
              <TouchableOpacity
                style={[
                  styles.icon,
                  selectedAudioId === item.id && styles.selectedIcon,
                ]}
                onPress={() => setSelectedAudioId(item.id)}
              >
                <FontAwesome6 name="volume-high" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View
              style={styles.itemContainer}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                imageRefs.current[item.id] = {
                  x: x + 25,
                  y: y + height / 2 + index * 120,
                };
              }}
            >
              <TouchableOpacity onPress={() => handleImageTap(item.id)}>
                <Image source={item.image} style={styles.image} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.button,
            answers.length >= 5
              ? { backgroundColor: "#FFBF18" }
              : { backgroundColor: "#ddd" },
          ]}
          onPress={handleSubmit}
          disabled={answers.length < 5}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 116,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#FFBF18",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 180,
  },
  selectedIcon: {
    borderWidth: 3,
    borderColor: "#004aad",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
  },
});

export default MatchingCards;
