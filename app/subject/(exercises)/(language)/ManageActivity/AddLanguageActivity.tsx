import React, { memo, useState } from "react";
import { FlatList, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import LanguageHeader from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageHeader";
import LanguageHomonymActivity from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageHomonymActivity";
import FillRenderItem from "@/app/subject/(exercises)/(language)/ManageActivity/FillRenderItem";

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

  const renderFillItems = (item: FillItem) => (
    <FillRenderItem
      item={item}
      fillItems={fillItems}
      setFillItems={(items) => setFillItems(items)}
    />
  );

  const renderHomonymsItems = (item: HomonymItem) => (
    <LanguageHomonymActivity
      item={item}
      homonymItems={homonymItems}
      setHomonymItems={(prev: HomonymItem[]) => setHomonymItems(prev)}
      ItemsLength={homonymItems.length}
    />
  );

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
          renderItem={({ item }) => renderFillItems(item)}
          keyExtractor={(item) => item.id}
        />
      )}

      {activityType === "homonyms" && (
        <FlatList
          data={homonymItems}
          ListHeaderComponent={header}
          renderItem={({ item }) => renderHomonymsItems(item)}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default memo(AddLanguageActivity);
