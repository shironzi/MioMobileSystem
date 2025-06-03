import React, { memo, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { router, useLocalSearchParams } from "expo-router";
import { createMatchingActivity } from "@/utils/auditory";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import Svg, { Line } from "react-native-svg";
import { useAudioPlayer } from "expo-audio";

const { width, height } = Dimensions.get("window");

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Items {
  id: string;
  file: FileInfo | null;
  image_path: string | null;
}

interface Audio {
  audio_path: string | null;
  audio: FileInfo | null;
}

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  audioId: number;
}

interface AudioRef {
  x: number;
  y: number;
}

interface ImageRef {
  x: number;
  y: number;
}

const MatchingPreview = () => {
  HeaderConfigQuiz("Matching Cards");

  const {
    subjectId,
    activityType,
    activityDifficulty,
    matchingAudio,
    matchingItems,
  } = useLocalSearchParams<{
    subjectId: string;
    activityType: string;
    activityDifficulty: string;
    matchingAudio: string;
    matchingItems: string;
  }>();

  const parsedMatchingAudio: Audio[] = JSON.parse(matchingAudio);
  const parsedMatchingItems: Items[] = JSON.parse(matchingItems);

  const [answers, setAnswers] = useState<
    { image_id: string; audio_id: string; image: FileInfo; audio: FileInfo }[]
  >([]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const audioPositions = useRef<{ [key: number]: AudioRef }>({});
  const imagePositions = useRef<{ [key: number]: ImageRef }>({});

  const player = useAudioPlayer();

  const handlePlayAudio = async (index: number) => {
    const uri = parsedMatchingAudio[index].audio?.uri;
    if (!uri) return;

    player.replace({ uri });

    player.play();
  };

  const handleSubmit = async () => {
    if (answers.length !== 5) {
      console.error("all items must be have connections");
      return;
    }

    if (answers.some((a) => !a.image_id || !a.audio_id)) {
      Alert.alert(
        "Error",
        "Each connection must have both an image and an audio.",
      );
      return;
    }

    try {
      const res = await createMatchingActivity(
        subjectId,
        activityType,
        activityDifficulty,
        answers,
      );

      if (res.success) {
        Alert.alert(
          "Success",
          "Successfully created the activity",
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
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  useEffect(() => {
    if (selectedAudio !== null && selectedImage !== null) {
      const audioPos = audioPositions.current[selectedAudio];
      const imagePos = imagePositions.current[selectedImage];

      if (audioPos && imagePos) {
        setConnections((prev) => {
          const filtered = prev.filter((c) => c.audioId !== selectedAudio);
          return [
            ...filtered,
            {
              x1: audioPos.x,
              y1: audioPos.y,
              x2: imagePos.x,
              y2: imagePos.y,
              audioId: selectedAudio,
            },
          ];
        });
      }

      setAnswers((prev) => {
        const audio_id = parsedMatchingAudio[selectedAudio].audio?.uri;
        const image_id = parsedMatchingItems[selectedImage].file?.uri;

        if (
          !audio_id ||
          !image_id ||
          !parsedMatchingItems[selectedImage].file ||
          !parsedMatchingAudio[selectedAudio].audio
        )
          return prev;

        const newEntry = {
          audio_id,
          image_id,
          image: parsedMatchingItems[selectedImage].file,
          audio: parsedMatchingAudio[selectedAudio].audio,
        };

        const exists = prev.some(
          (a) =>
            a.audio_id === newEntry.audio_id ||
            a.image_id === newEntry.image_id,
        );

        if (exists) return prev;

        return [...prev, newEntry];
      });

      setSelectedAudio(null);
      setSelectedImage(null);
    }
  }, [selectedAudio, selectedImage]);
  return (
    <View style={[globalStyles.container, { height: "100%" }]}>
      <View style={{ flex: 1 }}>
        <Svg
          height={height}
          width={width}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          {connections.map((line, idx) => (
            <Line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="blue"
              strokeWidth={3}
            />
          ))}
        </Svg>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flexDirection: "column", rowGap: 10 }}>
            {parsedMatchingAudio.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedAudio(index);
                  handlePlayAudio(index);
                }}
                style={[
                  {
                    padding: 20,
                    borderWidth: 1.5,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    marginVertical: 5,
                  },
                  selectedAudio === index
                    ? { borderColor: "#2264DC", borderWidth: 1.5 }
                    : { borderColor: "#00000024" },
                ]}
                onLayout={(e) => {
                  const { x, y, height } = e.nativeEvent.layout;
                  audioPositions.current[index] = {
                    x: x + 120,
                    y: y + height / 2,
                  };
                }}
              >
                <View
                  style={{
                    borderRadius: 12,
                    padding: 20,
                    margin: "auto",
                    backgroundColor: "#FFBF18",
                  }}
                >
                  <FontAwesome6 name="volume-high" size={25} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: "column", rowGap: 10 }}>
            {parsedMatchingItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImage(index);
                }}
                style={[
                  {
                    padding: 5,
                    borderWidth: 1,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    marginVertical: 5,
                  },
                  selectedImage === index
                    ? { borderColor: "#2264DC", borderWidth: 1.5 }
                    : { borderColor: "#00000024" },
                ]}
                onLayout={(e) => {
                  const { x, y, height } = e.nativeEvent.layout;
                  imagePositions.current[index] = {
                    x: x + 260,
                    y: y + height / 2,
                  };
                }}
              >
                <Image
                  source={{ uri: item.file?.uri || item.image_path || "" }}
                  style={{
                    width: 105,
                    height: 97,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={globalStyles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={globalStyles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(MatchingPreview);
