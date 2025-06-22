import globalStyles from "@/styles/globalStyles";
import {
  createMatchingActivity,
  updateMatchingActivity,
} from "@/utils/auditory";
import useHeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Items {
  image_id: string;
  file: FileInfo | null;
  image_path: string | null;
}

interface Audio {
  audio_id: string | null;
  audio_path: string | null;
  audio: FileInfo | null;
}

interface Answers {
  image_id: string;
  audio_id: string;
}

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  audioId: number;
}

interface Answer {
  image_id: string | null;
  audio_id: string | null;
  image: FileInfo | null;
  audio: FileInfo | null;
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
  useHeaderConfig("Matching Cards");

  const {
    subjectId,
    activityType,
    activityId,
    activityDifficulty,
    matchingAudio,
    matchingItems,
    matchingAnswers,
  } = useLocalSearchParams<{
    subjectId: string;
    activityType: string;
    activityId: string;
    activityDifficulty: string;
    matchingAudio: string;
    matchingItems: string;
    matchingAnswers: string;
  }>();

  const parsedMatchingItems = useMemo<Items[]>(() => {
    try {
      return JSON.parse(matchingItems || "[]");
    } catch {
      return [];
    }
  }, [matchingItems]);

  const parsedMatchingAudio = useMemo<Audio[]>(() => {
    try {
      return JSON.parse(matchingAudio || "[]");
    } catch {
      return [];
    }
  }, [matchingAudio]);

  const parsedAnswers = useMemo<Answers[]>(() => {
    try {
      return JSON.parse(matchingAnswers || "[]");
    } catch {
      return [];
    }
  }, [matchingAnswers]);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const audioPositions = useRef<{ [key: number]: AudioRef }>({});
  const imagePositions = useRef<{ [key: number]: ImageRef }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const player = useAudioPlayer();

  const handlePlayAudio = async (index: number) => {
    const uri =
      parsedMatchingAudio[index].audio?.uri ??
      parsedMatchingAudio[index].audio_path;
    if (!uri) return;
    player.replace({ uri });
    player.play();
  };

  const handleSubmit = async () => {
    if (answers.length !== 5) {
      console.error("all items must be have connections");
      return;
    }
    try {
      const res = activityId
        ? await updateMatchingActivity(
            subjectId,
            activityDifficulty,
            activityId,
            answers,
          )
        : await createMatchingActivity(
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
    if (activityId) {
      const audioReady =
        Object.keys(audioPositions.current).length ===
        parsedMatchingAudio.length;
      const imageReady =
        Object.keys(imagePositions.current).length ===
        parsedMatchingItems.length;

      if (!audioReady || !imageReady || parsedAnswers.length === 0) return;

      const initialConnections: Connection[] = [];
      const initialAnswers: Answer[] = [];

      parsedAnswers.forEach((ans, index) => {
        const audioPos = audioPositions.current[index];
        const imagePos = imagePositions.current[index];

        initialConnections.push({
          x1: audioPos.x,
          y1: audioPos.y,
          x2: imagePos.x,
          y2: imagePos.y,
          audioId: index,
        });

        initialAnswers.push({
          audio_id: ans.audio_id,
          image_id: ans.image_id,
          image: parsedMatchingItems[index].file,
          audio: parsedMatchingAudio[index].audio,
        });
      });

      setConnections(initialConnections);
      setAnswers(initialAnswers);
    }
  }, [loading]);

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
        const audioData = parsedMatchingAudio[selectedAudio];
        const imageData = parsedMatchingItems[selectedImage];

        const newEntry = {
          audio_id: audioData.audio_id,
          image_id: imageData.image_id,
          image: imageData.file,
          audio: audioData.audio,
        };

        if (prev.length === 0) return [...prev, newEntry];
        const filtered = prev.filter((a) => {
          const sameAudioId =
            audioData.audio_id !== null && a.audio_id === audioData.audio_id;

          const sameImageId =
            imageData.image_id !== null && a.image_id === imageData.image_id;

          const sameImageUri =
            imageData.file?.uri && a.image?.uri === imageData.file.uri;

          const sameAudioUri =
            audioData.audio?.uri && a.audio?.uri === audioData.audio.uri;

          return !(sameAudioId || sameImageId || sameImageUri || sameAudioUri);
        });

        return [...filtered, newEntry];
      });
      setSelectedAudio(null);
      setSelectedImage(null);
    }
  }, [selectedAudio, selectedImage]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  });

  return (
    <View style={[globalStyles.container, { flex: 1}]}>
      <View style={{ flex: 1 }}>
        <Svg
          height={height}
          width={width}
          style={{
            position: "absolute",
            top: 0,
            left: -22,
            zIndex: 1,
          }}
        >
          {connections.map((line, idx) => (
            <Line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#2264dc"
              strokeWidth={2}
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
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    marginVertical: 2,
                  },
                  selectedAudio === index
                    ? { borderColor: "#ffbf18", borderWidth: 1 }
                    : { borderColor: "#ddd" },
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
                    padding: 18,
                    margin: 3,
                    backgroundColor: "#FFBF18",
                  }}
                >
                  <FontAwesome6 name="volume-high" size={20} color="#fff" />
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
                    padding: 2,
                    borderWidth: 1,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    marginVertical: 2,
                    // marginVertical: 5,
                  },
                  selectedImage === index
                    ? { borderColor: "#2264DC", borderWidth: 1 }
                    : { borderColor: "#ddd" },
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
                  resizeMode="contain"
                  source={{ uri: item.file?.uri || item.image_path || "" }}
                  style={{
                    width: 100,
                    height: 80,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:10, bottom:10}}>
      <TouchableOpacity
        style={[globalStyles.inactivityButton, {width:"48%"}]}
        onPress={handleSubmit}
      >
        <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={[globalStyles.submitButton, {width:"48%"}]}
        onPress={handleSubmit}
      >
        <Text style={[globalStyles.submitButtonText, {top:3}]}>Update</Text>
      </TouchableOpacity>

      </View>
     
    </View>
  );
};

export default memo(MatchingPreview);
