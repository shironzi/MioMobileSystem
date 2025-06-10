import LanguageFillActivity from "@/app/subject/(exercises)/(language)/ManageActivity/Fill/LanguageFillActivity";
import React, { memo, useState } from "react";
import { validateFillItems } from "@/app/subject/(exercises)/(language)/ManageActivity/languageValidations";
import { router } from "expo-router";

interface FileInfo {
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

interface InputError {
  id: string | null;
  index: number | null;
  errorMessage: string;
}

interface Props {
  item: FillItem;
  setFillItems: (items: FillItem[]) => void;
  fillItems: FillItem[];
  itemsLength: number;
  activityType: string;
  difficulty: string;
  subjectId: string;
  activityId: string;
}

const FillRenderItem = ({
  item,
  setFillItems,
  fillItems,
  activityType,
  difficulty,
  subjectId,
  activityId,
}: Props) => {
  const [inputError, setInputError] = useState<InputError[]>([]);
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    InputError[]
  >([]);
  const [audioError, setAudioError] = useState<InputError[]>([]);

  const handleAddItem = () => {
    const { inputErrors, distractorErrors, audioErrors } =
      validateFillItems(fillItems);
    const hasErrors =
      inputErrors.length || distractorErrors.length || audioErrors.length;

    if (hasErrors) {
      setInputError(inputErrors);
      setDistractorErrorInput(distractorErrors);
      setAudioError(audioErrors);
      return;
    }

    setInputError([]);
    setDistractorErrorInput([]);
    setAudioError([]);

    const newId =
      (fillItems.length > 0
        ? Math.max(...fillItems.map((item) => parseInt(item.id)))
        : -1) + 1;

    const newItem: FillItem = {
      id: String(newId),
      item_id: null,
      text: "",
      distractors: [""],
      audio: null,
      filename: null,
      audio_path: null,
      audioType: "upload",
    };

    setFillItems([...fillItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (fillItems.length <= 1) return;
    const items = fillItems.filter((item) => item.id !== id);

    setFillItems(items);

    setInputError((prev) => prev?.filter((e) => e.id !== id));
    setDistractorErrorInput((prev) => prev.filter((e) => e.id !== id));
    setAudioError((prev) => prev?.filter((e) => e.id !== id));
  };

  const handleSelectAudioType = (
    id: string,
    audioType: "upload" | "record",
  ) => {
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, audioType: audioType, audio: null } : item,
    );
    setFillItems(update);
  };

  const handleAddAudio = (id: string, audio: FileInfo) => {
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, audio } : item,
    );
    setFillItems(update);
  };

  const handleRemoveAudio = (id: string) => {
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, audio: null } : item,
    );
    setFillItems(update);
  };

  const handleAudioRecording = (id: string, uri: string | null) => {
    const update = fillItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          audio: uri
            ? {
                uri,
                name: `recording-${id}-${Date.now()}.mp3`,
                mimeType: "audio/mpeg",
              }
            : null,
          audioType: "record" as "record",
        };
      }
      return item;
    });
    setFillItems(update);
  };

  const handleTextInput = (id: string, value: string) => {
    if (value.length > 200) {
      setInputError((prev) => [
        ...prev,
        {
          id,
          index: null,
          errorMessage: "Maximum 100 characters only.",
        },
      ]);
      return;
    }

    setInputError((prev) => prev.filter((err) => err.id !== id));
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, text: value } : item,
    );
    setFillItems(update);
  };

  const handleAddDistractor = (id: string) => {
    const item = fillItems.find((item) => item.id === id);
    if (!item) return;

    const invalids: InputError[] = [];
    item.distractors.forEach((distractor, index) => {
      if (distractor.trim().length <= 0) {
        invalids.push({ id, index, errorMessage: "This field is required" });
      }
    });

    setDistractorErrorInput(invalids);

    if (invalids.length > 0) return;

    const update = fillItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          distractors: [...item.distractors, ""],
        };
      }
      return item;
    });

    setFillItems(update);
  };

  const handleDistractorInput = (id: string, index: number, value: string) => {
    if (value.length > 30) {
      setDistractorErrorInput((prev) => [
        ...prev,
        {
          id,
          index: index,
          errorMessage: "Maximum 30 characters only.",
        },
      ]);
      return;
    }

    setDistractorErrorInput((prev) =>
      prev.filter((err) => err.id !== id && err.index !== index),
    );

    const update = fillItems.map((item) => {
      if (item.id === id) {
        const updatedDistractors = [...item.distractors];
        updatedDistractors[index] = value;
        return {
          ...item,
          distractors: updatedDistractors,
        };
      }
      return item;
    });
    setFillItems(update);
  };

  const handleRemoveDistractor = (id: string, index: number) => {
    const update = fillItems.map((item) => {
      if (item.id === id && item.distractors.length > 1) {
        const updatedDistractors = item.distractors.filter(
          (_, i) => i !== index,
        );
        return {
          ...item,
          distractors: updatedDistractors,
        };
      }
      return item;
    });

    setFillItems(update);
    setDistractorErrorInput((prev) =>
      prev.filter((dist) => !(dist.id === id && dist.index === index)),
    );
  };

  const handleSubmit = () => {
    const { inputErrors, audioErrors, distractorErrors } =
      validateFillItems(fillItems);

    if (inputErrors || audioErrors || distractorErrors) {
      setInputError(inputErrors);
      setDistractorErrorInput(distractorErrors);
      setAudioError(audioErrors);
    }

    setInputError([]);
    setDistractorErrorInput([]);
    setAudioError([]);

    const fillData = encodeURIComponent(JSON.stringify(fillItems));

    router.push({
      pathname: "/subject/ManageActivity/Fill/FillPreview",
      params: {
        data: fillData,
        subjectId: subjectId,
        activityType: activityType,
        difficulty: difficulty,
        activityId: activityId,
      },
    });
  };
  return (
    <LanguageFillActivity
      item={item}
      handleRemoveItem={(id) => handleRemoveItem(id)}
      inputError={inputError}
      handleTextInput={(id, value) => handleTextInput(id, value)}
      handleAddAudio={(id, file) => handleAddAudio(id, file)}
      handleAudioRecording={(id, uri) => handleAudioRecording(id, uri)}
      handleSelectAudioType={(id, value) => handleSelectAudioType(id, value)}
      handleRemoveAudio={(id) => handleRemoveAudio(id)}
      handleAddItem={() => handleAddItem()}
      handleAddDistractor={(id) => handleAddDistractor(id)}
      distractorErrorInput={distractorErrorInput}
      handleDistractorInput={(id, index, value) =>
        handleDistractorInput(id, index, value)
      }
      handleRemoveDistractor={(id, index) => handleRemoveDistractor(id, index)}
      firstIndex={fillItems[0]?.id}
      lastIndex={fillItems[fillItems.length - 1]?.id ?? 0}
      audioError={audioError}
      handleSubmit={handleSubmit}
    />
  );
};

export default memo(FillRenderItem);
