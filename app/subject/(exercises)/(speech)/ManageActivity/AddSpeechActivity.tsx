import SpeechHeader from "@/app/subject/(exercises)/(speech)/ManageActivity/SpeechHeader";
import LoadingCard from "@/components/loadingCard";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActivityById } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import FlashcardItem from "@/app/subject/(exercises)/(speech)/ManageActivity/FlashcardItem";
import { Flashcard } from "@/app/subject/(exercises)/(speech)/SpeechDataTypes";
import {
  flashcardFileUpload,
  flashcardText,
  removeFlashcard,
} from "@/app/subject/(exercises)/(speech)/ManageActivity/SpeechActivityFunc";

type Parameters = {
  subjectId: string;
  activity_type: string;
  difficulty: string;
  category: string;
  activityId: string;
};

const item = {
  flashcard_id: "0",
  file: null,
  text: "",
  image_url: "",
};

const AddSpeechActivity = () => {
  const { subjectId, activity_type, difficulty, activityId } =
    useLocalSearchParams<Parameters>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activityType, setActivityType] = useState<string>("picture");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");
  const [activityTitle, setActivityTitle] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([item]);

  const header = (
    <SpeechHeader
      activityType={activityType}
      setActivityType={setActivityType}
      activityDifficulty={activityDifficulty}
      setActivityDifficulty={setActivityDifficulty}
      activityTitle={activityTitle}
      setActivityTitle={setActivityTitle}
      titleError={false}
      activityId={activityId}
    />
  );

  useEffect(() => {
    if (!activityId) return;

    setLoading(true);
    const fetchActivity = async () => {
      const res = await getActivityById(
        subjectId,
        activity_type,
        difficulty,
        activityId,
      );

      const formatted: Flashcard[] = Object.values(res.flashcards).map(
        (item: any) => ({
          id: item.flashcard_id,
          flashcard_id: item.flashcard_id,
          file: null,
          image_url: item.image_url,
          text: item.text,
        }),
      );
      setFlashcards(formatted);
      setActivityType("picture");
      setActivityTitle(res.title);
      setActivityDifficulty(difficulty);

      setLoading(false);
    };
    fetchActivity();
  }, []);

  useHeaderConfig(
    activityId ? "Update Speech Activity" : "Add Speech Activity",
  );

  if (loading) {
    return <LoadingCard />;
  }

  const flashcardItem = (item: Flashcard, index: number) => (
    <FlashcardItem
      item={item}
      index={index}
      activityType={activityType}
      handleRemove={() =>
        setFlashcards(removeFlashcard(item.flashcard_id, flashcards))
      }
      handleImageUpload={(uri: string) =>
        setFlashcards(flashcardFileUpload(item.flashcard_id, uri, flashcards))
      }
      handleImageRemove={function (): void {
        throw new Error("Function not implemented.");
      }}
      handleTextInput={(value: string) =>
        setFlashcards(flashcardText(item.flashcard_id, value, flashcards))
      }
    />
  );

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.flashcard_id}
        renderItem={({ item, index }) => flashcardItem(item, index)}
        ListHeaderComponent={header}
      />
    </View>
  );
};

export default memo(AddSpeechActivity);
