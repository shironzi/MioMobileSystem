import SpeechHeader from "@/app/subject/(exercises)/(speech)/ManageActivity/SpeechHeader";
import LoadingCard from "@/components/loadingCard";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActivityById } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import FlashcardItem from "@/app/subject/(exercises)/(speech)/ManageActivity/FlashcardItem";
import { Flashcard } from "@/app/subject/(exercises)/(speech)/SpeechDataTypes";
import addFlashcard, {
  flashcardFileUpload,
  flashcardText,
  removeFlashcard,
} from "@/app/subject/(exercises)/(speech)/ManageActivity/SpeechActivityFunc";
import globalStyles from "@/styles/globalStyles";

type Parameters = {
  subjectId: string;
  activity_type: string;
  difficulty: string;
  category: string;
  activityId: string;
};

const item = {
  flashcard_id: "0",
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

      const flashcards: Flashcard[] = Object.values(res.flashcards).map(
        (item: any) => ({
          flashcard_id: item.flashcard_id,
          image_url: item.image_url,
          text: item.text,
        }),
      );
      setFlashcards(flashcards);
      setActivityType(activity_type);
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

  const footer = (
    <View
      style={[globalStyles.alignRowCenter, { justifyContent: "space-around" }]}
    >
      <TouchableOpacity style={globalStyles.inactivityButton}>
        <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.submitButton} onPress={() => {}}>
        <Text style={globalStyles.submitButtonText}>Preview</Text>
      </TouchableOpacity>
    </View>
  );

  const flashcardItem = (item: Flashcard, index: number) => (
    <FlashcardItem
      item={item}
      index={index}
      lastItem={index === flashcards.length - 1}
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
      handleTextInput={(value: string) => {
        setFlashcards(flashcardText(item.flashcard_id, value, flashcards));
      }}
      handleAdd={() => setFlashcards(addFlashcard(flashcards))}
    />
  );

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.flashcard_id}
        renderItem={({ item, index }) => flashcardItem(item, index)}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
      />
    </View>
  );
};

export default memo(AddSpeechActivity);
