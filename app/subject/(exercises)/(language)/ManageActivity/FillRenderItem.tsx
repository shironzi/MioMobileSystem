import LanguageFillActivity from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageFillActivity";
import React, { memo, useState } from "react";

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
interface InputError {
  name: string | null;
  index: number | null;
}

interface Props {
  item: FillItem;
  setFillItems: (items: FillItem[]) => void;
  fillItems: FillItem[];
  itemsLength: number;
}

const FillRenderItem = ({
  item,
  setFillItems,
  fillItems,
  itemsLength,
}: Props) => {
  const [inputError, setInputError] = useState<InputError>();
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    { id: string; index: number }[]
  >([]);

  const [answerErrorInput, setAnswerErrorInput] = useState<
    { id: string; index: number }[]
  >([]);

  const handleAddItem = () => {
    for (let i = 0; i < fillItems.length; i++) {
      if (fillItems[i].text.trim() === "") {
        setInputError({ name: "textInput", index: i });
        return;
      }
    }
    const newId = (
      fillItems.length > 0
        ? Math.max(...fillItems.map((item) => parseInt(item.id))) + 1
        : 0
    ).toString();

    const newItem: FillItem = {
      id: String(itemsLength),
      text: "",
      answers: [""],
      distractors: [""],
      audio: null,
      audioType: "upload",
    };

    setFillItems([...fillItems, newItem]);
    // setFillItems((prev) => {
    //   const newId = String(prev.length);
    //   const i = parseInt(index);
    //
    //   if (!prev[i]?.text.trim()) {
    //     setInputError({ name: "textInput", index: i });
    //     return prev;
    //   }
    //
    //   // if(answerErrorInput.length)
    //
    //   const invalids = prev[i].distractors
    //     .map((dist, idx) =>
    //       dist.trim().length === 0 ? { id: prev[i].id, index: idx } : null,
    //     )
    //     .filter(Boolean) as { id: string; index: number }[];
    //   setDistractorErrorInput(invalids);
    //
    //   if (invalids) {
    //     return prev;
    //   }
    //
    //   const hasAudio = prev[i].audio !== null || prev[i].audioType === "system";
    //
    //   if (!hasAudio) {
    //     setInputError({ name: "audio", index: i });
    //     return prev;
    //   }
    //
    //   setInputError({ name: null, index: null });
    //
    //   const newItem: FillItem = {
    //     id: newId,
    //     text: "",
    //     answers: [""],
    //     distractors: [""],
    //     audio: null,
    //     audioType: "upload",
    //   };
    //
    //   return [...prev, newItem];
    // });
  };

  const handleRemoveItem = (id: string) => {
    if (fillItems.length <= 1) return;
    const items = fillItems.filter((item) => item.id !== id);

    setFillItems(items);

    setInputError((prev) =>
      prev && prev.index !== null && fillItems[prev.index]?.id === id
        ? { name: null, index: null }
        : prev
    );

    setDistractorErrorInput((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSelectAudioType = (
    id: string,
    audioType: "upload" | "record" | "system"
  ) => {
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, audioType: audioType, audio: null } : item
    );
    setFillItems(update);
  };

  const handleAddAudio = (id: string, audio: FileInfo) => {
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, audio } : item
    );
    setFillItems(update);
  };

  const handleRemoveAudio = (id: string) => {
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, audio: null } : item
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
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, text: value } : item
    );
    setFillItems(update);
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

  const handleAddAnswer = (id: string) => {
    const item = fillItems.find((item) => item.id === id);
    if (!item) return;

    const invalids: { id: string; index: number }[] = [];
    item.answers.forEach((answer, index) => {
      if (answer.trim().length <= 0) {
        invalids.push({ id, index });
      }
    });

    setAnswerErrorInput(invalids);

    if (invalids.length > 0) return;

    const update = fillItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          answers: [...item.answers, ""],
        };
      }
      return item;
    });
    setFillItems(update);
  };

  const handleDistractorInput = (id: string, index: number, value: string) => {
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

  const handleAnswerInput = (id: string, index: number, value: string) => {
    const update = fillItems.map((item) => {
      if (item.id === id) {
        const updatedAnswers = [...(item.answers || [])];
        updatedAnswers[index] = value;

        return {
          ...item,
          answers: updatedAnswers,
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
          (_, i) => i !== index
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
      prev.filter((dist) => !(dist.id === id && dist.index === index))
    );
  };

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
      handleAddItem={() => handleAddItem()}
      handleAddDistractor={(id) => handleAddDistractor(id)}
      distractorErrorInput={distractorErrorInput.filter(
        (dis) => dis.id === item.id
      )}
      handleDistractorInput={(id, index, value) =>
        handleDistractorInput(id, index, value)
      }
      handleRemoveDistractor={(id, index) => handleRemoveDistractor(id, index)}
      handleAnswerInput={(id, index, value) =>
        handleAnswerInput(id, index, value)
      }
      handleAddAnswer={(id) => handleAddAnswer(id)}
    />
  );
};

export default memo(FillRenderItem);
