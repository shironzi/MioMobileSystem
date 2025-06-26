import HomonymRenderItem from "@/app/subject/(exercises)/(language)/ManageActivity/Homonyms/HomonymRenderItem";
import React, { memo, useState } from "react";
import { router } from "expo-router";
import validateHomonymItems from "@/app/subject/(exercises)/(language)/ManageActivity/languageValidations";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
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

interface InputError {
  id: string | null;
  index: number[];
  error: string | null;
}

interface Props {
  item: HomonymItem;
  homonymItems: HomonymItem[];
  setHomonymItems: (prev: HomonymItem[]) => void;
  ItemsLength: number;
  activityType: string;
  difficulty: string;
  subjectId: string;
  activityId: string;
  activityTitle: string;
  setTitleError: (value: boolean) => void;
  titleError: boolean;
}

const LanguageHomonymActivity = ({
  item,
  homonymItems,
  setHomonymItems,
  activityType,
  difficulty,
  subjectId,
  activityId,
  activityTitle,
  setTitleError,
  titleError,
}: Props) => {
  const [inputError, setInputError] = useState<InputError[]>([]);
  const [answerErrorInput, setAnswerErrorInput] = useState<InputError[]>([]);
  const [audioErrorInput, setAudioErrorInput] = useState<InputError[]>([]);
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    { id: string | null; index: number | null; error: string }[]
  >([]);

  const handleRemoveItem = (id: string) => {
    if (homonymItems.length <= 1) return;

    const update = homonymItems.filter((item) => item.id !== id);
    setHomonymItems(update);

    setInputError((prev) => prev.filter((e) => e.id !== id));
    setAnswerErrorInput((prev) => prev.filter((e) => e.id !== id));
    setAudioErrorInput((prev) => prev.filter((e) => e.id !== id));
    setDistractorErrorInput((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddItem = () => {
    const {
      inputErrors,
      distractorErrors,
      answerErrors,
      audioErrors,
      hasErrors,
    } = validateHomonymItems(homonymItems);

    if (hasErrors) {
      setInputError(inputErrors);
      setDistractorErrorInput(distractorErrors);
      setAnswerErrorInput(answerErrors);
      setAudioErrorInput(audioErrors);
      return;
    }

    setInputError([]);
    setDistractorErrorInput([]);
    setAnswerErrorInput([]);
    setAudioErrorInput([]);

    const newItem: HomonymItem = {
      id: String(homonymItems.length),
      item_id: null,
      text: ["", ""],
      answer: ["", ""],
      distractors: [""],
      audio: [],
      filename: [],
      audio_path: [],
      audioType: ["upload", "upload"],
    };

    setHomonymItems([...homonymItems, newItem]);
  };

  const handleTextInput = (id: string, value: string, index: number) => {
    if (value.length > 300) {
      setInputError((prev) => {
        const filtered = prev.filter(
          (e) => e.id !== id || !e.index.includes(index),
        );
        return [
          ...filtered,
          { id, index: [index], error: "Maximum of 300 characters only." },
        ];
      });
      return;
    }
    const update = homonymItems.map((item) =>
      item.id === id
        ? {
            ...item,
            text: item.text.map((text, i) => (i === index ? value : text)),
          }
        : item,
    );
    setHomonymItems(update);
  };

  const handleAnswerInput = (id: string, value: string, index: number) => {
    if (value.length > 30) {
      setAnswerErrorInput((prev) => {
        const filtered = prev.filter(
          (e) => e.id !== id || !e.index.includes(index),
        );
        return [
          ...filtered,
          { id, index: [index], error: "Maximum of 30 characters only." },
        ];
      });
      return;
    }
    const update = homonymItems.map((item) =>
      item.id === id
        ? {
            ...item,
            answer: item.answer.map((ans, i) => (i === index ? value : ans)),
          }
        : item,
    );
    setHomonymItems(update);
  };

  const handleDistractorInput = (id: string, index: number, value: string) => {
    if (value.length > 30) {
      setDistractorErrorInput((prev) => {
        const filtered = prev.filter((e) => e.id !== id || e.index !== index);
        return [
          ...filtered,
          {
            id,
            index,
            error: "Maximum of 30 characters only.",
          },
        ];
      });
      return;
    }

    const update = homonymItems.map((item) => {
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
    setHomonymItems(update);
  };

  const handleRemoveDistractor = (id: string, index: number) => {
    const update = homonymItems.map((item) => {
      if (item.id === id) {
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
    setHomonymItems(update);
    setDistractorErrorInput((prev) =>
      prev.filter((dist) => !(dist.id === id && dist.index === index)),
    );
  };

  const handleAddDistractor = (id: string) => {
    const item = homonymItems.find((item) => item.id === id);
    if (!item) return;
    const invalids = item.distractors
      .map((distractor, index) =>
        distractor.trim().length === 0
          ? { id, index, error: "This field is required." }
          : null,
      )
      .filter(Boolean) as { id: string; index: number; error: string }[];

    setDistractorErrorInput(invalids);
    if (invalids.length > 0) return;

    const update = homonymItems.map((item) =>
      item.id === id
        ? { ...item, distractors: [...item.distractors, ""] }
        : item,
    );
    setHomonymItems(update);
  };

  const handleAddAudio = (id: string, audio: FileInfo, index: number) => {
    const update = homonymItems.map((item) => {
      if (item.id === id) {
        const updatedAudio = [...(item.audio ?? [])];
        updatedAudio[index] = audio;
        return { ...item, audio: updatedAudio };
      }
      return item;
    });
    setHomonymItems(update);
  };

  const handleAudioRecording = (
    id: string,
    uri: string | null,
    index: number,
  ) => {
    const update = homonymItems.map((item) => {
      if (item.id === id) {
        const updatedAudio = [...(item.audio ?? [])];
        if (uri) {
          updatedAudio[index] = {
            uri,
            name: `recording-${id}-${index}.mp3`,
            mimeType: "audio/mpeg",
          };
        }
        return {
          ...item,
          audio: updatedAudio,
        };
      }
      return item;
    });
    setHomonymItems(update);
  };

  const handleSelectAudioType = (
    id: string,
    audioType: "upload" | "record",
    index: number,
  ) => {
    const update = homonymItems.map((item) => {
      if (item.id === id) {
        const updatedAudio = [...(item.audio ?? [])];
        updatedAudio[index] = undefined as any;

        const updatedAudioType = [...item.audioType];
        updatedAudioType[index] = audioType;

        return {
          ...item,
          audio: updatedAudio,
          audioType: updatedAudioType,
        };
      }
      return item;
    });
    setHomonymItems(update);
  };

  const handleRemoveAudio = (id: string, index: number) => {
    const update = homonymItems.map((item) => {
      if (item.id === id) {
        const updatedAudio = [...(item.audio ?? [])];
        updatedAudio.splice(index, 1);
        return {
          ...item,
          audio: updatedAudio,
        };
      }
      return item;
    });
    setHomonymItems(update);
  };

  const handleSubmit = () => {
    const {
      inputErrors,
      distractorErrors,
      answerErrors,
      audioErrors,
      hasErrors,
    } = validateHomonymItems(homonymItems);

    if (!activityTitle.trim()) {
      setTitleError(true);
      console.log("hello");
    }

    if (hasErrors || !activityTitle.trim()) {
      setInputError(inputErrors);
      setDistractorErrorInput(distractorErrors);
      setAnswerErrorInput(answerErrors);
      setAudioErrorInput(audioErrors);
      return;
    }

    setTitleError(false);

    setInputError([]);
    setDistractorErrorInput([]);
    setAnswerErrorInput([]);
    setAudioErrorInput([]);

    const homonymsData = encodeURIComponent(JSON.stringify(homonymItems));
    router.push({
      pathname:
        "/subject/(exercises)/(language)/ManageActivity/Homonyms/HomonymPreview",
      params: {
        data: homonymsData,
        activityType: activityType,
        difficulty: difficulty,
        subjectId: subjectId,
        activityId: activityId,
        title: activityTitle,
      },
    });
  };

  return (
    <HomonymRenderItem
      handleAddItem={() => handleAddItem()}
      item={item}
      handleRemoveItem={(id) => handleRemoveItem(id)}
      inputError={inputError}
      distractorErrorInput={distractorErrorInput}
      answerErrorInput={answerErrorInput}
      audioErrorInput={audioErrorInput}
      handleTextInput={(id, value, index) => handleTextInput(id, value, index)}
      handleAnswerInput={(id, value, index) =>
        handleAnswerInput(id, value, index)
      }
      handleAddAudio={(id, audio, index) => handleAddAudio(id, audio, index)}
      handleDistractorInput={(id, index, value) =>
        handleDistractorInput(id, index, value)
      }
      handleAudioRecording={(id, uri, index) =>
        handleAudioRecording(id, uri, index)
      }
      handleSelectAudioType={(id, value, index) =>
        handleSelectAudioType(id, value, index)
      }
      handleRemoveAudio={(id, index) => handleRemoveAudio(id, index)}
      handleRemoveDistractor={(id, index) => handleRemoveDistractor(id, index)}
      handleAddDistractor={(id) => handleAddDistractor(id)}
      firstIndex={homonymItems[0]?.id}
      lastIndex={homonymItems[homonymItems.length - 1]?.id ?? 0}
      handleSubmit={() => handleSubmit()}
    />
  );
};

export default memo(LanguageHomonymActivity);
