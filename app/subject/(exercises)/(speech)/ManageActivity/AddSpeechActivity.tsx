import PhraseRenderItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Phrase/PhraseRenderItem";
import PictureRenderItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Picture/PictureRenderItem";
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

type Parameters = {
  subjectId: string;
  activity_type: string;
  difficulty: string;
  category: string;
  activityId: string;
};

const data = {
  id: "0",
  flashcard_id: null,
  text: "",
};

const picture = {
  id: "0",
  flashcard_id: null,
  file: null,
  text: "",
  image_url: "",
};

const AddSpeechActivity = () => {
  const { subjectId, activity_type, difficulty, activityId } =
    useLocalSearchParams<Parameters>();
  const [loading, setLoading] = useState<boolean>(true);
  const [activityType, setActivityType] = useState<string>("picture");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");
  const [activityTitle, setActivityTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);
  const [phraseFlashcard, setPhraseFlashcard] = useState<Flashcard[]>([data]);
  const [questionFlashcard, setQuestionFlashcard] = useState<Flashcard[]>([
    data,
  ]);
  const [pictureFlashcard, setPictureFlashcards] = useState<PictureItem[]>([
    picture,
  ]);

  // error handling
  const [pictureError, setPictureError] = useState<InputError[]>([]);
  const [questionError, setQuestionError] = useState<InputError[]>([]);
  const [phraseError, setPhraseError] = useState<InputError[]>([]);

  const header = (
    <SpeechHeader
      activityType={activityType}
      setActivityType={setActivityType}
      activityDifficulty={activityDifficulty}
      setActivityDifficulty={setActivityDifficulty}
      activityTitle={activityTitle}
      setActivityTitle={setActivityTitle}
      titleError={titleError}
      activityId={activityId}
    />
  );

  useEffect(() => {
    if (!activityId) return;

    const fetchActivity = async () => {
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
        }
      }

      setActivityTitle(res.title);
      setActivityDifficulty(difficulty);

      setLoading(false);
    };
    fetchActivity();
  }, []);

  useHeaderConfig(
    activityId ? "Update Speech Activity" : "Add Speech Activity",
  );

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

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
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
              activityTitle={activityTitle}
              titleError={setTitleError}
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
              activityTitle={activityTitle}
              titleError={setTitleError}
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
              activityTitle={activityTitle}
              titleError={setTitleError}
            />
          )}
          ListHeaderComponent={header}
        />
      )}
    </View>
  );
};

export default memo(AddSpeechActivity);
