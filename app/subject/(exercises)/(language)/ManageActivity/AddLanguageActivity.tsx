import FillRenderItem from "@/app/subject/(exercises)/(language)/ManageActivity/Fill/FillRenderItem";
import LanguageHeader from "@/app/subject/(exercises)/(language)/ManageActivity/Fill/LanguageHeader";
import LanguageHomonymActivity from "@/app/subject/(exercises)/(language)/ManageActivity/Homonyms/LanguageHomonymActivity";
import LoadingCard from "@/components/loadingCard";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getFillActivity, getHomonymActivity } from "@/utils/language";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  item_id: string | null;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
  audioType: "upload" | "record";
}

interface HomonymItem {
  id: string;
  item_id: string | null;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audio_path: string[];
  filename: string[];
  audioType: ("upload" | "record")[];
}

const AddLanguageActivity = () => {
  useHeaderConfig("Add Language Activity");

  const { subjectId, activity_type, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();
  const [fillItems, setFillItems] = useState<FillItem[]>([
    {
      id: "0",
      item_id: null,
      text: "",
      audio: null,
      filename: null,
      audio_path: null,
      distractors: [""],
      audioType: "upload",
    },
  ]);
  const [homonymItems, setHomonymItems] = useState<HomonymItem[]>([
    {
      id: "0",
      item_id: null,
      text: ["", ""],
      answer: ["", ""],
      distractors: [""],
      audio: [],
      audio_path: [],
      filename: [],
      audioType: ["upload", "upload"],
    },
  ]);
  const [activityType, setActivityType] = useState<string>("fill");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");
  const [loading, setLoading] = useState<boolean>(false);
  const [activityTitle, setActivityTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);

  const header = (
    <LanguageHeader
      activityType={activityType}
      setActivityType={(value: string) => setActivityType(value)}
      activityDifficulty={activityDifficulty}
      setActivityDifficulty={(value: string) => setActivityDifficulty(value)}
      titleError={titleError}
      activityTitle={activityTitle}
      setActivityTitle={setActivityTitle}
      activityId={activityId}
    />
  );

  useEffect(() => {
    if (activityId) {
      setLoading(true);

      const fetchActivity = async () => {
        if (activity_type === "fill") {
          const res = await getFillActivity(
            subjectId,
            activity_type,
            difficulty,
            activityId,
          );

          setActivityTitle(res.title);
          const items: FillItem[] = [];
          Object.entries(res.items).forEach(
            ([key, value]: [string, any], index) => {
              items.push({
                id: index.toString(),
                item_id: key,
                text: value.sentence,
                audio: null,
                filename: value.filename,
                audio_path: value.audio_path,
                distractors: value.distractors,
                audioType: "upload",
              });
            },
          );
          setFillItems(items);
        } else if (activity_type === "homonyms") {
          const res = await getHomonymActivity(
            subjectId,
            activity_type,
            difficulty,
            activityId,
          );

          setActivityTitle(res.title);
          const items: HomonymItem[] = [];
          Object.entries(res.items).forEach(
            ([key, value]: [string, any], index) => {
              const text = [
                value.sentence_1 || value.setence_1 || "",
                value.sentence_2 || value.setence_2 || "",
              ];

              const answer = [value.answer_1, value.answer_2];
              const audio_path = [value.audio_path_1, value.audio_path_2];
              const filenames = [value.filename_1, value.filename_2];
              const audioType = ["upload", "upload"] as any;

              items.push({
                id: index.toString(),
                item_id: key,
                text,
                answer,
                distractors: value.distractors ?? [],
                audio: [],
                audio_path,
                filename: filenames,
                audioType: audioType,
              });
            },
          );
          setHomonymItems(items);
          setActivityType("homonyms");
        }

        setLoading(false);
      };
      fetchActivity();
    }
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
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff" }}>
      {activityType === "fill" && (
        <FlatList
          data={fillItems}
          ListHeaderComponent={header}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <FillRenderItem
              item={item}
              fillItems={fillItems}
              setFillItems={setFillItems}
              itemsLength={fillItems.length}
              subjectId={subjectId}
              activityId={activityId}
              activityType={activityType}
              difficulty={difficulty ? difficulty : activityDifficulty}
              activityTitle={activityTitle}
              setTitleError={setTitleError}
              titleError={titleError}
            />
          )}
        />
      )}

      {activityType === "homonyms" && (
        <FlatList
          data={homonymItems}
          ListHeaderComponent={header}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LanguageHomonymActivity
              item={item}
              homonymItems={homonymItems}
              setHomonymItems={(prev: HomonymItem[]) => setHomonymItems(prev)}
              ItemsLength={homonymItems.length}
              subjectId={subjectId}
              activityId={activityId}
              activityType={activityType}
              difficulty={difficulty ? difficulty : activityDifficulty}
              activityTitle={activityTitle}
              setTitleError={setTitleError}
              titleError={titleError}
            />
          )}
        />
      )}
    </View>
  );
};

export default memo(AddLanguageActivity);
