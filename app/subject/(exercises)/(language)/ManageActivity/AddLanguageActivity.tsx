import React, { memo, useState } from "react";
import { FlatList, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import LanguageHeader from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageHeader";
import LanguageHomonymActivity from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageHomonymActivity";
import FillRenderItem from "@/app/subject/(exercises)/(language)/ManageActivity/FillRenderItem";
import { useLocalSearchParams } from "expo-router";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  text: string;
  answers: string[];
  distractors: string[];
  audio: FileInfo | null;
  audioType: "upload" | "record" | "system";
}

interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

const AddLanguageActivity = () => {
  useHeaderConfig("Add Language Activity");

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  const [fillItems, setFillItems] = useState<FillItem[]>([
    {
      id: "0",
      text: "",
      answers: [""],
      audio: null,
      distractors: [""],
      audioType: "upload",
    },
  ]);
  const [homonymItems, setHomonymItems] = useState<HomonymItem[]>([
    {
      id: "0",
      text: ["", ""],
      answer: ["", ""],
      distractors: [""],
      audio: [],
      audioType: ["upload", "upload"],
    },
  ]);
  const [activityType, setActivityType] = useState<string>("fill");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");

  const header = () => (
    <LanguageHeader
      activityType={activityType}
      setActivityType={(value: string) => setActivityType(value)}
      activityDifficulty={activityDifficulty}
      setActivityDifficulty={(value: string) => setActivityDifficulty(value)}
    />
  );

  return (
    <View>
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
              activityType={activityType}
              difficulty={activityDifficulty}
            />
          )}
        />
      )}
    </View>
  );
};

export default memo(AddLanguageActivity);
