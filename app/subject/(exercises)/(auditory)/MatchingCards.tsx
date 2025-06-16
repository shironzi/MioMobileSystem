import React, { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { router, useLocalSearchParams } from "expo-router";
import {
  getAttemptActivityAuditory,
  submitMatchingActivity,
  takeAuditoryActivity,
} from "@/utils/auditory";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome6 } from "@expo/vector-icons";
import Svg, { Line } from "react-native-svg";
import { useAudioPlayer } from "expo-audio";
import getCurrentDateTime from "@/utils/DateFormat";

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

interface answerLog {
  audio_id: string;
  audio_played: string[];
  selected: string[];
  image_selected_at: string[];
}

const MatchingCards = () => {
  HeaderConfigQuiz("Matching Cards");

  const {
    subjectId,
    activity_type,
    difficulty,
    category,
    activityId,
    prevAttemptId,
  } = useLocalSearchParams<{
    subjectId: string;
    activity_type: string;
    difficulty: string;
    category: string;
    activityId: string;
    prevAttemptId: string;
  }>();

  const [activity, setActivity] = useState<
    { image_id: string; image_url: string }[]
  >([]);
  const [audio, setAudio] = useState<{ audio_id: string; audio_url: string }[]>(
    [],
  );
  const [total, setTotal] = useState<number>(0);
  const [attemptId, setAttemptId] = useState<string>();
  const [answers, setAnswers] = useState<
    { image_id: string; audio_id: string }[]
  >([]);
  const [answerLogs, setAnswerLogs] = useState<answerLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const audioPositions = useRef<{ [key: number]: AudioRef }>({});
  const imagePositions = useRef<{ [key: number]: ImageRef }>({});

  const player = useAudioPlayer();
  const handlePlayAudio = async (index: number) => {
    player.replace({ uri: audio[index].audio_url });
    player.play();

    const date = getCurrentDateTime();

    setAnswerLogs((prev) => {
      return prev.map((log) => {
        if (log.audio_id === audio[index].audio_id) {
          return {
            ...log,
            audio_id: audio[index].audio_id,
            audio_played: [...log.audio_played, date],
          };
        }
        return log;
      });
    });
  };

  const handleSubmit = async () => {
    try {
      if (!attemptId) return;

      const res = await submitMatchingActivity(
        subjectId,
        difficulty,
        activityId,
        attemptId,
        answerLogs,
        answers,
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
      const date = getCurrentDateTime();
      const audioId = audio[selectedAudio].audio_id;
      const imageId = activity[selectedImage].image_id;

      setAnswerLogs((prev) => {
        const existingIndex = prev.findIndex((log) => log.audio_id === audioId);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            selected: [...updated[existingIndex].selected, imageId],
            audio_played: [...updated[existingIndex].audio_played, date],
            image_selected_at: [
              ...updated[existingIndex].image_selected_at,
              date,
            ],
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              audio_id: audioId,
              audio_played: [date],
              selected: [imageId],
              image_selected_at: [date],
            },
          ];
        }
      });

      setAnswers((prev) => {
        const newEntry = {
          audio_id: audio[selectedAudio!].audio_id,
          image_id: activity[selectedImage!].image_id,
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
        console.log(prevAttemptId);
        const res = prevAttemptId
          ? await getAttemptActivityAuditory(
              subjectId,
              activity_type,
              activityId,
              prevAttemptId,
            )
          : await takeAuditoryActivity(
              subjectId,
              activity_type,
              difficulty,
              activityId,
            );

        console.log(res);

        setActivity(res.items);
        setAudio(res.audio);
        setAttemptId(res.attemptId);
        setTotal(res.total);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { height: "100%" }]}>
      <Text style={styles.difficulty}>{difficulty}</Text>
      <View style={{ flex: 1 }}>
        <Svg height={height} width={width} style={styles.connectionLines}>
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
        <View style={styles.cardContainer}>
          <View style={{ flexDirection: "column", rowGap: 10 }}>
            {activity.map((value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedAudio(index);
                  handlePlayAudio(index);
                }}
                style={[
                  styles.itemContainer,
                  { padding: 20 },
                  selectedAudio === index
                    ? styles.selected
                    : styles.notSelected,
                ]}
                onLayout={(e) => {
                  const { x, y, height } = e.nativeEvent.layout;
                  audioPositions.current[index] = {
                    x: x + 120,
                    y: y + height / 2,
                  };
                }}
              >
                <View style={styles.audioContainer}>
                  <FontAwesome6 name="volume-high" size={25} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: "column", rowGap: 10 }}>
            {activity.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImage(index);
                }}
                style={[
                  styles.itemContainer,
                  { padding: 5 },
                  selectedImage === index
                    ? styles.selected
                    : styles.notSelected,
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
                  key={index}
                  source={{ uri: item.image_url }}
                  style={styles.imageContainer}
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
  itemContainer: {
    borderWidth: 1.5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  imageContainer: {
    width: 105,
    height: 97,
    borderRadius: 15,
  },
  audioContainer: {
    borderRadius: 12,
    padding: 20,
    margin: "auto",
    backgroundColor: "#FFBF18",
  },
  selected: { borderColor: "#2264DC", borderWidth: 1.5 },
  notSelected: { borderColor: "#00000024" },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  connectionLines: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
});

export default memo(MatchingCards);
