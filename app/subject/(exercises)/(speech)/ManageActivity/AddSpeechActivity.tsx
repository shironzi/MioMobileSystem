import PhraseRenderItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Phrase/PhraseRenderItem";
import PictureRenderItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Picture/PictureRenderItem";
import PronunciationRenderItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Pronunciation/PronunciationRenderItem";
import QuestionRenderItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Question/QuestionRenderItem";
import SpeechHeader from "@/app/subject/(exercises)/(speech)/ManageActivity/SpeechHeader";
import LoadingCard from "@/components/loadingCard";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActivityById } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface InputError {
  id: string;
  error: string;
}

interface PictureItem {
  id: string;
  flashcard_id: string | null;
  file: FileInfo | null;
  text: string;
  image_url: string;
}

interface Flashcard {
  id: string;
  flashcard_id: string | null;
  text: string;
}

const data = {
  id: "0",
  flashcard_id: null,
  text: "",
};

const AddSpeechActivity = () => {
  useHeaderConfig("Add Speech Activity");
  const [loading, setLoading] = useState<boolean>(true);
  const [activityType, setActivityType] = useState<string>("picture");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");

  const { subjectId, activity_type, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();

  const [phraseFlashcard, setPhraseFlashcard] = useState<Flashcard[]>([data]);
  const [questionFlashcard, setQuestionFlashcard] = useState<Flashcard[]>([
    data,
  ]);
  const [pronunciationFlashcard, setPronunciationFlashcard] = useState<
    Flashcard[]
  >([data]);
  const [pictureFlashcard, setPictureFlashcards] = useState<PictureItem[]>([
    {
      id: "0",
      flashcard_id: null,
      file: null,
      text: "",
      image_url: "",
    },
  ]);

  const [pictureError, setPictureError] = useState<InputError[]>([]);
  const [questionError, setQuestionError] = useState<InputError[]>([]);
  const [phraseError, setPhraseError] = useState<InputError[]>([]);
  const [pronunciationError, setPronunciationError] = useState<InputError[]>(
    [],
  );

  useEffect(() => {
    if (activityId) {
      const fetchActivity = () => {};

      fetchActivity();
    }
  });

  const header = !activityId ? (
    <SpeechHeader
      activityType={activityType}
      setActivityType={setActivityType}
      activityDifficulty={activityDifficulty}
      setActivityDifficulty={setActivityDifficulty}
    />
  ) : null;


  useEffect(() => {
    if (!activityId) return;

    const fetchActivity = async () => {
      try {
        const res = await getActivityById(
          subjectId,
          activity_type,
          difficulty,
          activityId,
        );

        const flashcards = res.items || res.flashcards || [];

        if (activity_type === "picture") {
          const formatted: PictureItem[] = Object.values(flashcards).map(
            (item: any) => ({
              id: item.flashcard_id, 
              flashcard_id: item.flashcard_id,
              file: null,
              image_url: item.image_url,
              text: item.text,
            }),
          );
          setPictureFlashcards(formatted);
          setActivityType("picture");
        } else {
          const formatted: Flashcard[] = Object.values(flashcards).map(
            (item: any) => ({
              id: item.flashcard_id,
              flashcard_id: item.flashcard_id,
              text: item.text,
            }),
          );

          if (activity_type === "question") {
            setQuestionFlashcard(formatted);
            setActivityType("question");
          } else if (activity_type === "phrase") {
            setPhraseFlashcard(formatted);
            setActivityType("phrase");
          } else if (activity_type === "pronunciation") {
            setPronunciationFlashcard(formatted);
            setActivityType("pronunciation");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };

    fetchActivity();
  }, []);


  if (loading && activityId) {
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


  // useHeaderConfig(activityId ? "Update Flashcard" : "Add Flashcard");

  return (
    <View style={{backgroundColor:"#fff"}}>
      {activityType === "picture" && (
        <FlatList
          data={pictureFlashcard}
          renderItem={({ item, index }) => (
            <PictureRenderItem
              item={item}
              items={pictureFlashcard}
              index={index}
              activityType={activityType}
              difficulty={activityDifficulty}
              setPictureItems={setPictureFlashcards}
              inputErrors={pictureError}
              setInputErrors={setPictureError}
              firstIndex={pictureFlashcard[0].id}
              lastIndex={pictureFlashcard[pictureFlashcard.length - 1]?.id}
              subjectId={subjectId}
              activityId={activityId}
            />
          )}
          ListHeaderComponent={header}
        />
      )}

      {activityType === "question" && (
        <FlatList
          data={questionFlashcard}
          renderItem={({ item, index }) => (
            <QuestionRenderItem
              item={item}
              items={questionFlashcard}
              index={index}
              activityType={activityType}
              difficulty={activityDifficulty}
              inputErrors={questionError}
              setInputErrors={setQuestionError}
              setPictureItems={setQuestionFlashcard}
              firstIndex={questionFlashcard[0].id}
              lastIndex={questionFlashcard[questionFlashcard.length - 1]?.id}
              subjectId={subjectId}
              activityId={activityId}
            />
          )}
          ListHeaderComponent={header}
        />
      )}

      {activityType === "phrase" && (
        <FlatList
          data={phraseFlashcard}
          renderItem={({ item, index }) => (
            <PhraseRenderItem
              item={item}
              items={phraseFlashcard}
              index={index}
              activityType={activityType}
              difficulty={activityDifficulty}
              inputErrors={phraseError}
              setInputErrors={setPhraseError}
              setPictureItems={setPhraseFlashcard}
              firstIndex={phraseFlashcard[0].id}
              lastIndex={phraseFlashcard[phraseFlashcard.length - 1]?.id}
              subjectId={subjectId}
              activityId={activityId}
            />
          )}
          ListHeaderComponent={header}
        />
      )}

      {activityType === "pronunciation" && (
        <FlatList
          data={pronunciationFlashcard}
          renderItem={({ item, index }) => (
            <PronunciationRenderItem
              item={item}
              items={pronunciationFlashcard}
              index={index}
              activityType={activityType}
              difficulty={activityDifficulty}
              inputErrors={pronunciationError}
              setInputErrors={setPronunciationError}
              setPictureItems={setPronunciationFlashcard}
              firstIndex={pronunciationFlashcard[0].id}
              lastIndex={
                pronunciationFlashcard[pronunciationFlashcard.length - 1]?.id
              }
              subjectId={subjectId}
              activityId={activityId}
            />
          )}
          ListHeaderComponent={header}
        />
      )}
    </View>
  );
};

export default memo(AddSpeechActivity);
