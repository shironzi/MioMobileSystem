import React, { memo, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { router, useLocalSearchParams } from "expo-router";
import { submitMatchingActivity, takeAuditoryActivity } from "@/utils/auditory";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import Svg, { Line } from "react-native-svg";
import { useAudioPlayer } from "expo-audio";

const { width, height } = Dimensions.get("window");

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

const MatchingCards = () => {
  HeaderConfigQuiz("Matching Cards");

  const { subjectId, activity_type, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();

  const [images, setImages] = useState<string[]>([]);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [originalImagesPaths, setOriginalImagesPaths] = useState<
    {
      image_ids: string;
    }[]
  >([]);
  const [originalAudioPaths, setOriginalAudioPaths] = useState<
    {
      audio_ids: string;
    }[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string>();
  const [answers, setAnswers] = useState<
    { image_id: string; audio_id: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const audioPositions = useRef<{ [key: number]: AudioRef }>({});
  const imagePositions = useRef<{ [key: number]: ImageRef }>({});

  const player = useAudioPlayer();

  const handlePlayAudio = async (index: number) => {
    const uri = audioFiles[index];

    player.replace({ uri });

    player.play();
  };

  const handleSubmit = async () => {
    try {
      if (!attemptId) return;

      const payload = {
        answers,
      };

      const res = await submitMatchingActivity(
        subjectId,
        difficulty,
        activityId,
        attemptId,
        payload,
      );

      if (!res.success) {
        console.error("failed to submit");
        return;
      }

      router.push({
        pathname: "/subject/(exercises)/AuditoryScores",
        params: {
          score: res.score,
          totalItems: total,
          activity_type,
          difficulty,
        },
      });
    } catch (err) {
      console.error("Submission failed:", err);
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
        const newEntry = {
          audio_id: originalAudioPaths[selectedAudio!].audio_ids,
          image_id: originalImagesPaths[selectedImage!].image_ids,
        };

        const exists = prev.some((a) => a.audio_id === newEntry.audio_id);
        if (exists) {
          return prev;
        }

        return [...prev, newEntry];
      });

      setSelectedAudio(null);
      setSelectedImage(null);
    }
  }, [selectedAudio, selectedImage]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await takeAuditoryActivity(
          subjectId,
          activity_type,
          difficulty,
          activityId,
        );

        const images_url: string[] = [];
        const audio_url: string[] = [];
        const originalImages: { image_ids: string }[] = [];
        const originalAudios: { audio_ids: string }[] = [];

        res.items.map(
          async (item: {
            image_url: string;
            audio_url: string;
            image_ids: string;
            audio_ids: string;
          }) => {
            images_url.push(item.image_url);
            audio_url.push(item.audio_url);
            originalImages.push({ image_ids: item.image_ids });
            originalAudios.push({ audio_ids: item.audio_ids });
          },
        );

        setImages(images_url);
        setAudioFiles(audio_url);
        setOriginalImagesPaths(originalImages);
        setOriginalAudioPaths(originalAudios);
        setAttemptId(res.attemptId);
        setTotal(res.total);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };

    fetchActivity();
  }, []);

  if (!audioFiles) {
    return (
      <View style={globalStyles.container}>
        <Text>audio available.</Text>
      </View>
    );
  }

  if (!images) {
    return (
      <View style={globalStyles.container}>
        <Text>image available.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <Text>loading.......</Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { height: "100%" }]}>
      <Text style={styles.difficulty}>{difficulty}</Text>

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
            {audioFiles.map((value, index) => (
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
                  const { x, y, width, height } = e.nativeEvent.layout;
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
            {images.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImage(index);
                }}
                style={[
                  {
                    padding: 5,
                    borderWidth: 1.5,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    marginVertical: 5,
                  },
                  selectedImage === index
                    ? { borderColor: "#2264DC" }
                    : { borderColor: "#00000024" },
                ]}
                onLayout={(e) => {
                  const { x, y, width, height } = e.nativeEvent.layout;
                  imagePositions.current[index] = {
                    x: x + 260,
                    y: y + height / 2,
                  };
                }}
              >
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
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

        <View>
          <TouchableOpacity
            onPress={handleSubmit}
            style={globalStyles.submitButton}
          >
            <Text style={globalStyles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  difficulty: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    height: "5%",
    left: 5,
  },
  speakerIcon: {
    borderRadius: 180,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 12,
    padding: 100,
  },
});

export default memo(MatchingCards);
