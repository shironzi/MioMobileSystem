import ActivityProgress from "@/components/activityProgress";
import LoadingCard from "@/components/loadingCard";
import AudioPlayer from "@/components/trainingActivities/AudioPlayer";
import FlashcardMicrophone from "@/components/trainingActivities/speech/FlashcardMicrophone";
import HeaderConfigQuiz from "@/utils/HeaderConfigQuiz";
import { startActivity, submitAnswer } from "@/utils/specialized";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FeedbackAlert from "@/components/FeedbackAlert";
import {
  defaultSchedule,
  Flashcard,
  Schedule,
} from "@/app/subject/(exercises)/(speech)/SpeechDataTypes";
import globalStyles from "@/styles/globalStyles";
import SpeechStyles from "@/styles/SpeechStyles";
import Colors from "@/styles/Colors";
import RemedialSchedule from "@/components/modals/RemedialSchedule";

type Parameters = {
  activity_type: string;
  difficulty: string;
  subjectId: string;
  activityId: string;
  phoneme: string;
};

const Flashcards = () => {
  const router = useRouter();

  HeaderConfigQuiz("Flashcards");

  const { subjectId, difficulty, activity_type, activityId, phoneme } =
    useLocalSearchParams<Parameters>();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | undefined>();
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleNextCard = async () => {
    if (!attemptId) return;
    if (!recordingAudio) return;
    setIsSending(true);

    console.log("working here");

    const res = await submitAnswer(
      subjectId,
      activity_type,
      activityId,
      attemptId,
      cards[currentCard].flashcard_id,
      recordingAudio,
      phoneme,
    );

    console.log(res);

    if (res.feedbacks) {
      setFeedback(res.feedbacks);
    }

    setTimeout(() => {
      if (currentCard === cards.length - 1) {
        router.push({
          pathname: "/subject/(sub-details)/scoreDetails",
          params: {
            subjectId,
            activity_type,
            difficulty,
            activityId,
            attemptId,
          },
        });
        return;
      }

      if (res.success) {
        setCurrentCard(currentCard + 1);
        setIsAnswered(false);
      }
      setIsSending(false);
    }, 5000);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await startActivity(
        subjectId,
        activity_type,
        difficulty,
        activityId,
        phoneme,
      );

      if (res.success) {
        setAttemptId(res.attemptId);
        setCards(Object.values(res.flashcards));
        setCurrentCard(res.currentItem ?? 0);
        setLoading(false);
      } else if (!res.success) {
        setShowSchedule(true);
        setSchedule({
          message: res.message,
          has_schedule: res.has_schedule,
          date: res.date,
          end_time: res.end_time,
          start_time: res.start_time,
        });
      } else {
        Alert.alert("Message", res.message, [
          {
            text: "OK",
            onPress: () => {
              router.back();
              router.back();
            },
          },
        ]);
      }
    };
    fetchActivity();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  if (showSchedule) {
    return (
      <RemedialSchedule
        message={schedule?.message}
        has_schedule={schedule?.has_schedule}
        date={schedule.date}
        end_time={schedule.end_time}
        start_time={schedule.start_time}
      />
    );
  }

  return (
    <GestureHandlerRootView>
      <ScrollView style={globalStyles.container}>
        <ActivityProgress
          difficulty={difficulty}
          totalItems={cards.length}
          completedItems={currentCard}
          instruction={
            "Look at the word. Tap and hold the microphone and read the word out\n loud. Try to pronounce it clearly."
          }
        />

        <View style={SpeechStyles.flashcardContainer}>
          <Image
            source={require("@/assets/images/face/echo.png")}
            style={{ width: 90, height: 50 }}
            resizeMode="contain"
          />
          {feedback && (
            <FeedbackAlert
              message={feedback}
              onHide={() => setFeedback(null)}
            />
          )}

          <View style={SpeechStyles.textContainer}>
            {cards[currentCard].image_url ? (
              <Image
                source={{ uri: cards[currentCard].image_url }}
                style={SpeechStyles.imageContainer}
                resizeMode="contain"
              />
            ) : (
              <Text style={SpeechStyles.flashcardText}>
                {cards[currentCard]?.text}
              </Text>
            )}
          </View>
        </View>

        <View style={{ rowGap: 5, marginTop: 15 }}>
          <FlashcardMicrophone
            onStop={(uri) => {
              setIsRecording(false);
              setIsAnswered(true);
              setRecordingAudio(uri);
            }}
          />
          {recordingAudio && (
            <View style={{ marginTop: 10 }}>
              <AudioPlayer uri={recordingAudio} />
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity
            style={[
              SpeechStyles.continueButton,
              isAnswered && !isRecording ? Colors.yellow : Colors.white,
            ]}
            disabled={!isAnswered || isRecording || isSending}
            onPress={handleNextCard}
          >
            <Text style={SpeechStyles.continueButtonText}>
              {isSending ? "Submitting...." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default memo(Flashcards);
