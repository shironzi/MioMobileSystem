import React, { memo } from "react";
import PictureItem from "@/app/subject/(exercises)/(speech)/ManageActivity/Picture/PictureItem";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router } from "expo-router";

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

interface Props {
  item: PictureItem;
  items: PictureItem[];
  index: number;
  setPictureItems: (items: PictureItem[]) => void;
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
  // isRemedial: boolean;
  // selectedActivityId: string;
}

const AddSpeechActivity = ({
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
  // isRemedial,
  // selectedActivityId,
}: Props) => {
  useHeaderConfig("Add Flashcard");

  const handleAddPicture = (item: PictureItem) => {
    const errors: InputError[] = [];

    items.forEach((item) => {
      if (!item.text.trim()) {
        errors.push({ id: item.id, error: "word" });
      }
      if (!item.file && !item.image_url) {
        errors.push({ id: item.id, error: "image" });
      }
    });

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

  const handleImageUpload = (id: string, file: FileInfo) => {
    const update = items.map((item) =>
      item.id === id ? { ...item, file } : item,
    );

    setPictureItems(update);
    const inErrors = inputErrors.filter((item) => item.id !== id);
    setInputErrors(inErrors);
  };

  const handleImageRemove = (id: string) => {
    const update = items.map((item) =>
      item.id === id ? { ...item, file: null, image_url: "" } : item,
    );
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
    }

    items.forEach((item) => {
      if (!item.text.trim()) {
        errors.push({ id: item.id, error: "word" });
      }
      if (!item.file && !item.image_url) {
        errors.push({ id: item.id, error: "image" });
      }
    });

    if (errors.length > 0) {
      setInputErrors(errors);
      return;
    }

    titleError(false);

    const encodedItems = encodeURIComponent(JSON.stringify(items)) ?? [];
    router.push({
      pathname: "/subject/(exercises)/(speech)/ManageActivity/PicturePreview",
      params: {
        data: encodedItems,
        subjectId: subjectId,
        activity_type: activityType,
        activityId: activityId,
        difficulty: difficulty,
        title: activityTitle,
        // isRemedial: isRemedial.toString(),
        // selectedActivityId: selectedActivityId,
      },
    });
  };

  return (
    <PictureItem
      item={item}
      index={index}
      firstIndex={firstIndex}
      lastIndex={lastIndex}
      hasError={inputErrors.filter((err: { id: string }) => err.id === item.id)}
      handleAddItem={(item) => handleAddPicture(item)}
      handleRemove={(id) => handleRemove(id)}
      handleImageUpload={(id, file) => handleImageUpload(id, file)}
      handleImageRemove={(id) => handleImageRemove(id)}
      handleTextInput={(id, value) => handleTextInput(id, value)}
      handlePreview={() => handlePreview()}
      activityId={activityId}
    />
  );
};

export default memo(AddSpeechActivity);
