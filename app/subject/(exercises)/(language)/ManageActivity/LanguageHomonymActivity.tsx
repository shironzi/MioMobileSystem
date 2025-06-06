import HomonymRenderItem from "@/app/subject/(exercises)/(language)/ManageActivity/HomonymRenderItem";
import React, { memo, useState } from "react";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

interface Props {
  item: HomonymItem;
  homonymItems: HomonymItem[];
  setHomonymItems: (prev: HomonymItem[]) => void;
  ItemsLength: number;
}

interface InputError {
  id: string | null;
  index: number[];
}

const LanguageHomonymActivity = ({
  item,
  homonymItems,
  setHomonymItems,
}: Props) => {
  const [inputError, setInputError] = useState<InputError[]>([]);
  const [answerErrorInput, setAnswerErrorInput] = useState<InputError[]>([]);
  const [audioErrorInput, setAudioErrorInput] = useState<InputError[]>([]);
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    { id: string | null; index: number | null }[]
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
    const inputErrors: InputError[] = [];
    const distractorErrors: { id: string | null; index: number | null }[] = [];
    const answerErrors: InputError[] = [];
    const audioErrors: InputError[] = [];

    for (let i = 0; i < homonymItems.length; i++) {
      const item = homonymItems[i];
      const inputIndexErrors: number[] = [];
      const answerIndexErrors: number[] = [];
      const audioIndexErrors: number[] = [];

      if (!item.text[0]?.trim()) inputIndexErrors.push(0);
      if (!item.text[1]?.trim()) inputIndexErrors.push(1);
      if (inputIndexErrors.length)
        inputErrors.push({ id: item.id, index: inputIndexErrors });

      if (!item.answer[0]?.trim()) answerIndexErrors.push(0);
      if (!item.answer[1]?.trim()) answerIndexErrors.push(1);
      if (answerIndexErrors.length)
        answerErrors.push({ id: item.id, index: answerIndexErrors });

      if (!item.audio[0] && item.audioType[0] !== "system")
        audioIndexErrors.push(0);
      if (!item.audio[1] && item.audioType[1] !== "system")
        audioIndexErrors.push(1);
      if (audioIndexErrors.length)
        audioErrors.push({ id: item.id, index: audioIndexErrors });

      item.distractors.forEach((dist, idx) => {
        if (!dist.trim()) {
          distractorErrors.push({ id: item.id, index: idx });
        }
      });
    }

    if (
      inputErrors.length > 0 ||
      distractorErrors.length > 0 ||
      answerErrors.length > 0 ||
      audioErrors.length > 0
    ) {
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
      text: ["", ""],
      answer: ["", ""],
      distractors: [""],
      audio: [],
      audioType: ["upload", "upload"],
    };

    setHomonymItems([...homonymItems, newItem]);
  };

  const handleTextInput = (id: string, value: string, index: number) => {
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
        distractor.trim().length === 0 ? { id, index } : null,
      )
      .filter(Boolean) as { id: string; index: number }[];

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
        const updatedAudio = [...item.audio];
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
        const updatedAudio = [...item.audio];
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
    audioType: "upload" | "record" | "system",
    index: number,
  ) => {
    const update = homonymItems.map((item) => {
      if (item.id === id) {
        const updatedAudio = [...item.audio];
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
        const updatedAudio = [...item.audio];
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
    />
  );
};

export default memo(LanguageHomonymActivity);
