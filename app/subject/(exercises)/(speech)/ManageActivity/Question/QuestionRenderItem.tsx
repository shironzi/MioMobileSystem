import React, { memo } from "react";
import useHeaderConfig from "@/utils/HeaderConfig";
import PronunciationItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Pronunciation/PronunciationItem";
import QuestionItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Question/QuestionItem";
import { router } from "expo-router";

interface InputError {
  id: string;
  error: string;
}

interface PronunciationItem {
  id: string;
  flashcard_id: string | null;
  text: string;
}

interface Props {
  item: PronunciationItem;
  items: PronunciationItem[];
  index: number;
  setPictureItems: (items: PronunciationItem[]) => void;
  inputErrors: InputError[];
  setInputErrors: (errors: InputError[]) => void;
  firstIndex: string;
  lastIndex: string;
  activityType: string;
  difficulty: string;
  subjectId: string;
  activityId: string;
  activityTitle: string;
  titleError: (value: boolean) => void;
}

const QuestionRenderItem = ({
  item,
  items,
  index,
  setPictureItems,
  setInputErrors,
  inputErrors,
  firstIndex,
  lastIndex,
  activityType,
  difficulty,
  subjectId,
  activityId,
  activityTitle,
  titleError,
}: Props) => {
  useHeaderConfig("Add Flashcard");

  const handleAddPicture = (item: PronunciationItem) => {
    const errors: InputError[] = [];

    if (errors.length > 0) {
      setInputErrors(errors);
      return;
    }

    setPictureItems([...items, item]);
  };

  const handleRemove = (id: string) => {
    const update =
      items.length > 1 ? items.filter((item) => item.id !== id) : items;
    setPictureItems(update);

    const inErrors = inputErrors.filter((item) => item.id !== id);
    setInputErrors(inErrors);
  };

  const handleTextInput = (id: string, value: string) => {
    if (value.length > 30) {
      const update = [
        ...inputErrors.filter(
          (e) => !(e.id === id && e.error === "text length"),
        ),
        { id, error: "text length" },
      ];
      setInputErrors(update);

      return;
    } else {
      const update = inputErrors.filter(
        (e) => !(e.id === id && e.error === "text length"),
      );

      setInputErrors(update);
    }

    setPictureItems(
      items.map((item) => (item.id === id ? { ...item, text: value } : item)),
    );
  };

  const handlePreview = () => {
    const errors: InputError[] = [];

    if (!activityTitle.trim()) {
      errors.push({ id: "", error: "title" });
      titleError(true);

      console.log(activityTitle);
    }

    items.forEach((item) => {
      if (!item.text.trim()) {
        errors.push({ id: item.id, error: "word" });
      }
    });

    if (errors.length > 0) {
      setInputErrors(errors);
      return;
    }
    titleError(false);

    const encodedItems = encodeURIComponent(JSON.stringify(items)) ?? [];
    router.push({
      pathname: "/subject/(exercises)/(speech)/ManageActivity/SpeechPreview",
      params: {
        data: encodedItems,
        subjectId: subjectId,
        activity_type: activityType,
        difficulty: difficulty,
        activityId: activityId,
        title: activityTitle,
      },
    });
  };

  return (
    <QuestionItem
      item={item}
      index={index}
      firstIndex={firstIndex}
      lastIndex={lastIndex}
      hasError={inputErrors.filter((err: { id: string }) => err.id === item.id)}
      handleAddItem={(item) => handleAddPicture(item)}
      handleRemove={(id) => handleRemove(id)}
      handleTextInput={(id, value) => handleTextInput(id, value)}
      handlePreview={() => handlePreview()}
      activityId={activityId}
    />
  );
};

export default memo(QuestionRenderItem);
