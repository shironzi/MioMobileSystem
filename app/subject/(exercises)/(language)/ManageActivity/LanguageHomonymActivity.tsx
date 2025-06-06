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
  name: string | null;
  index: number | null;
  item: number | null;
}

const LanguageHomonymActivity = ({
  item,
  homonymItems,
  setHomonymItems,
}: Props) => {
  const [inputError, setInputError] = useState<InputError>({
    name: null,
    index: null,
    item: null,
  });
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    { id: string; index: number }[]
  >([]);

  const handleRemoveItem = (id: string) => {
    if (homonymItems.length <= 1) return;

    const update = homonymItems.filter((item) => item.id !== id);
    setHomonymItems(update);

    setInputError((prev) =>
      prev && prev.index !== null && homonymItems[prev.index]?.id === id
        ? { name: null, index: null, item: null }
        : prev
    );

    setDistractorErrorInput((prev) => prev.filter((e) => e.id !== id));
  };

  const handleTextInput = (id: string, value: string, index: number) => {
    const update = homonymItems.map((item) =>
      item.id === id
        ? {
            ...item,
            text: item.text.map((text, i) => (i === index ? value : text)),
          }
        : item
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
        : item
    );
    setHomonymItems(update);
  };

  const handleAddItem = (index: string) => {
    const i = parseInt(index);
    const item = homonymItems[i];

    if (!item?.text[0]?.trim() || item.text[0].trim().length < 2) {
      setInputError({ name: "textInput", index: i, item: 0 });
      return;
    }

    if (!item?.text[1]?.trim() || item.text[1].trim().length < 2) {
      setInputError({ name: "textInput", index: i, item: 1 });
      return;
    }

    const hasEmptyDistractor = item.distractors.some(
      (dist) => dist.trim().length === 0
    );

    if (!item.answer[0]?.trim()) {
      setInputError({ name: "answer", index: i, item: 0 });
    }

    if (!item.answer[1]?.trim()) {
      setInputError({ name: "answer", index: i, item: 1 });
    }

    if (hasEmptyDistractor) {
      const invalids = item.distractors
        .map((dist, idx) =>
          dist.trim().length === 0 ? { id: item.id, index: idx } : null
        )
        .filter(Boolean) as { id: string; index: number }[];

      setDistractorErrorInput(invalids);
      return;
    }

    setDistractorErrorInput([]);

    if (!item.audio[0] && item.audioType[0] !== "system") {
      setInputError({ name: "audio", index: i, item: 0 });
      return;
    }

    if (!item.audio[1] && item.audioType[1] !== "system") {
      setInputError({ name: "audio", index: i, item: 1 });
      return;
    }

    setInputError({ name: null, index: null, item: null });

    const newItem: HomonymItem = {
      id: String(homonymItems.length),
      text: ["", ""],
      answer: ["", ""],
      distractors: [""],
      audio: [],
      audioType: ["upload", "upload"],
    };

    const update = [...homonymItems, newItem];
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
          (_, i) => i !== index
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
      prev.filter((dist) => !(dist.id === id && dist.index === index))
    );
  };

  const handleAddDistractor = (id: string) => {
    const item = homonymItems.find((item) => item.id === id);
    if (!item) return;

    const invalids = item.distractors
      .map((distractor, index) =>
        distractor.trim().length === 0 ? { id, index } : null
      )
      .filter(Boolean) as { id: string; index: number }[];

    setDistractorErrorInput(invalids);
    if (invalids.length > 0) return;

    const update = homonymItems.map((item) =>
      item.id === id
        ? { ...item, distractors: [...item.distractors, ""] }
        : item
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
    index: number
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
    index: number
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
      ItemsLength={homonymItems.length}
      handleAddItem={(id) => handleAddItem(id)}
      item={item}
      handleRemoveItem={(id) => handleRemoveItem(id)}
      inputError={inputError}
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
      distractorErrorInput={distractorErrorInput}
      handleRemoveDistractor={(id, index) => handleRemoveDistractor(id, index)}
      handleAddDistractor={(id) => handleAddDistractor(id)}
    />
  );
};

export default memo(LanguageHomonymActivity);
