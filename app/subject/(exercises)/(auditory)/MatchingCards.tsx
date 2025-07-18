import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { submitMatchingActivity, takeAuditoryActivity } from "@/utils/auditory";
import getCurrentDateTime from "@/utils/DateFormat";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Line } from "react-native-svg";
import { VolumeManager } from "react-native-volume-manager";

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

  const router = useRouter();
  const { subjectId, activity_type, difficulty, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      activityId: string;
    }>();

  const [isSending, setIsSending] = useState(false);

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const getInstruction =
    "Click a speaker to hear a word. Then, drag a line to the image that matches what you heard. Listen and make the correct match.\n";

  useEffect(() => {
    if (status.playing) {
      setIsPlaying(true);
    } else if (status.didJustFinish) {
      setIsPlaying(false);
    }
  }, [status.playing, status.didJustFinish]);

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
    if (!attemptId) return;
    if (answers.length < activity.length) return;

    setIsSending(true);
    console.log(answers);

    const res = await submitMatchingActivity(
      subjectId,
      difficulty,
      activityId,
      attemptId,
      answerLogs,
      answers,
    );

    if (!res.success) {
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

    setIsSending(false);
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
      const res = await takeAuditoryActivity(
        subjectId,
        activity_type,
        difficulty,
        activityId,
      );

      if (res.success) {
        setActivity(res.items);
        setAudio(res.audio_paths);
        setAttemptId(res.attemptId);
        setTotal(res.total);
      } else {
        Alert.alert("", res.message, [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }

      setLoading(false);
    };

    fetchActivity();
  }, []);

  const setVolume = async () => {
    let volume = 1;

    if (difficulty === "average") {
      volume = 0.95;
    } else if (difficulty === "difficulty") {
      volume = 0.85;
    } else if (difficulty === "challenge") {
      volume = 0.75;
    }

    await VolumeManager.setVolume(volume);
  };

  setVolume();

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
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <ScrollView style={[globalStyles.container, { flex: 1, paddingTop: 10 }]}>
      <View style={{ flex: 1 }}>
        <Svg height={height} width={width} style={[styles.connectionLines, {}]}>
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
        <View>
          <View
            style={{
              marginHorizontal: 10,
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 10,
              marginBottom: 15,
              marginTop: 20,
              left: -5,
            }}
          >
            <Text
              style={{
                marginHorizontal: 10,
                textAlign: "justify",
                fontWeight: "500",
                fontSize: 16,
                color: "#2264dc",
                marginTop: 10,
              }}
            >
              Piddie Tips!
            </Text>

            <Text
              style={{
                marginTop: 5,
                margin: 10,
                textAlign: "justify",
                fontWeight: "300",
              }}
            >
              {getInstruction}
            </Text>
          </View>
        </View>
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
                  { padding: 10 },
                  selectedAudio === index
                    ? { borderColor: "#ffbf18", borderWidth: 1 }
                    : { borderColor: "#ddd" },
                ]}
                onLayout={(e) => {
                  const { x, y } = e.nativeEvent.layout;
                  audioPositions.current[index] = {
                    x: x + 100,
                    y: y + 200,
                  };
                }}
              >
                <View style={styles.audioContainer}>
                  <FontAwesome6 name="volume-high" size={30} color="#fff" />
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
                  { padding: 2 },
                  selectedImage === index
                    ? { borderColor: "#2264DC", borderWidth: 1 }
                    : { borderColor: "#ddd" },
                ]}
                onLayout={(e) => {
                  const { x, y } = e.nativeEvent.layout;
                  imagePositions.current[index] = {
                    x: x + 300,
                    y: y + 200,
                  };
                }}
              >
                <Image
                  key={index}
                  source={{ uri: item.image_url }}
                  resizeMode="contain"
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={[globalStyles.submitButton, { width: "100%" }]}
            onPress={handleSubmit}
            disabled={
              isSending || isPlaying || answers.length < activity.length
            }
          >
            <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
              {isSending ? "Submitting" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginVertical: 2,
  },
  imageContainer: {
    width: 105,
    height: 97,
    borderRadius: 15,
  },
  audioContainer: {
    borderRadius: 12,
    padding: 13,
    margin: 3,
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
    left: -22,
    zIndex: -1,
  },
});

export default memo(MatchingCards);
