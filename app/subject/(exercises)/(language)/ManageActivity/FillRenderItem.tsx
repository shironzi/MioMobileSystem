import React, { memo, useEffect, useState } from "react";
import LanguageFillActivity from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageFillActivity";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  audioType: "upload" | "record" | "system";
}

interface InputError {
  name: string | null;
  index: number | null;
}

interface Props {
  item: FillItem;
  setItems: (items: FillItem[]) => void;
  items: FillItem[];
}

const FillRenderItem = ({ item, setItems, items }: Props) => {
  const [fillItems, setFillItems] = useState<FillItem[]>(items);
  const [inputError, setInputError] = useState<InputError>();
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    { id: string; index: number }[]
  >([]);

  const handleAddItem = (index: string) => {
    setFillItems((prev) => {
      const newId = String(prev.length);
      const i = parseInt(index);

      if (!prev[i]?.text.trim() || prev[i].text.trim().length < 2) {
        setInputError({ name: "textInput", index: i });
        return prev;
      }

      const hasEmptyDistractor = prev[i].distractors.some(
        (dist) => dist.trim().length === 0,
      );

      if (hasEmptyDistractor) {
        const invalids = prev[i].distractors
          .map((dist, idx) =>
            dist.trim().length === 0 ? { id: prev[i].id, index: idx } : null,
          )
          .filter(Boolean) as { id: string; index: number }[];

        setDistractorErrorInput(invalids);
        return prev;
      }

      setDistractorErrorInput([]);

      const hasAudio = prev[i].audio !== null || prev[i].audioType === "system";

      if (!hasAudio) {
        setInputError({ name: "audio", index: i });
        return prev;
      }

      setInputError({ name: null, index: null });

      const newItem: FillItem = {
        id: newId,
        text: "",
        distractors: [""],
        audio: null,
        audioType: "upload",
      };

      return [...prev, newItem];
    });
  };

  const handleRemoveItem = (id: string) => {
    if (fillItems.length <= 1) return;
    setFillItems((prev) => prev.filter((item) => item.id !== id));

    setInputError((prev) =>
      prev && prev.index !== null && fillItems[prev.index]?.id === id
        ? { name: null, index: null }
        : prev,
    );

    setDistractorErrorInput((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSelectAudioType = (
    id: string,
    audioType: "upload" | "record" | "system",
  ) => {
    setFillItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, audioType: audioType, audio: null } : item,
      ),
    );
  };

  const handleAddAudio = (id: string, audio: FileInfo) => {
    setFillItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, audio } : item)),
    );
  };

  const handleRemoveAudio = (id: string) => {
    setFillItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, audio: null } : item)),
    );
  };

  const handleAudioRecording = (id: string, uri: string | null) => {
    setFillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            audio: uri
              ? {
                  uri,
                  name: `recording-${id}.mp3`,
                  mimeType: "audio/mpeg",
                }
              : null,
            audioType: "record",
          };
        }
        return item;
      }),
    );
  };

  const handleTextInput = (id: string, value: string) => {
    setFillItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item)),
    );
  };

  const handleAddDistractor = (id: string) => {
    const item = fillItems.find((item) => item.id === id);
    if (!item) return;

    const invalids: { id: string; index: number }[] = [];
    item.distractors.forEach((distractor, index) => {
      if (distractor.trim().length <= 0) {
        invalids.push({ id, index });
      }
    });

    setDistractorErrorInput(invalids);

    if (invalids.length > 0) return;

    setFillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            distractors: [...item.distractors, ""],
          };
        }
        return item;
      }),
    );
  };

  const handleDistractorInput = (id: string, index: number, value: string) => {
    setFillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedDistractors = [...item.distractors];
          updatedDistractors[index] = value;

          return {
            ...item,
            distractors: updatedDistractors,
          };
        }
        return item;
      }),
    );
  };

  const handleRemoveDistractor = (id: string, index: number) => {
    setFillItems((prev) =>
      prev.map((item) => {
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
      }),
    );

    setDistractorErrorInput((prev) =>
      prev.filter((dist) => !(dist.id === id && dist.index === index)),
    );
  };

  useEffect(() => {
    setItems(fillItems);
  }, [fillItems]);

  return (
    <LanguageFillActivity
      item={item}
      fillItemsLength={fillItems.length}
      handleRemoveItem={(id) => handleRemoveItem(id)}
      inputError={inputError}
      handleTextInput={(id, value) => handleTextInput(id, value)}
      handleAddAudio={(id, file) => handleAddAudio(id, file)}
      handleAudioRecording={(id, uri) => handleAudioRecording(id, uri)}
      handleSelectAudioType={(id, value) => handleSelectAudioType(id, value)}
      handleRemoveAudio={(id) => handleRemoveAudio(id)}
      handleAddItem={(id) => handleAddItem(id)}
      handleAddDistractor={(id) => handleAddDistractor(id)}
      distractorErrorInput={distractorErrorInput.filter(
        (dis) => dis.id === item.id,
      )}
      handleDistractorInput={(id, index, value) =>
        handleDistractorInput(id, index, value)
      }
      handleRemoveDistractor={(id, index) => handleRemoveDistractor(id, index)}
    />
  );
};

export default memo(FillRenderItem);
