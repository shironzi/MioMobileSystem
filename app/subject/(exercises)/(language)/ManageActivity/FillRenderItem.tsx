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
  id: string | null;
  index: number | null;
}

interface Props {
  item: FillItem;
  setFillItems: (items: FillItem[]) => void;
  fillItems: FillItem[];
  itemsLength: number;
}

const FillRenderItem = ({ item, setFillItems, fillItems }: Props) => {
  const [inputError, setInputError] = useState<{ id: string }[]>([]);
  const [distractorErrorInput, setDistractorErrorInput] = useState<
    InputError[]
  >([]);
  const [answerErrorInput, setAnswerErrorInput] = useState<InputError[]>([]);
  const [audioError, setAudioError] = useState<{ id: string }[]>([]);

  const handleAddItem = () => {
    const inputErrors: { id: string }[] = [];
    const answerErrors: { id: string; index: number }[] = [];
    const distractorErrors: { id: string; index: number }[] = [];
    const audioErrors: { id: string }[] = [];

    for (let i = 0; i < fillItems.length; i++) {
      const item = fillItems[i];

      if (item.text.trim() === "") {
        inputErrors.push({ id: item.id });
      }

      item.answers.forEach((ans, index) => {
        if (ans.trim() === "") {
          answerErrors.push({ id: item.id, index });
        }
      });

      item.distractors.forEach((dis, index) => {
        if (dis.trim() === "") {
          distractorErrors.push({ id: item.id, index });
        }
      });

      if (item.audioType !== "system" && item.audio === null) {
        audioErrors.push({ id: item.id });
      }
    }

    if (
      inputErrors.length > 0 ||
      answerErrors.length > 0 ||
      distractorErrors.length > 0 ||
      audioErrors.length > 0
    ) {
      setInputError(inputErrors);
      setAnswerErrorInput(answerErrors);
      setDistractorErrorInput(distractorErrors);
      setAudioError(audioErrors);
      return;
    }

    setInputError([]);
    setAnswerErrorInput([]);
    setDistractorErrorInput([]);
    setAudioError([]);

    const newId =
      (fillItems.length > 0
        ? Math.max(...fillItems.map((item) => parseInt(item.id)))
        : -1) + 1;

    const newItem: FillItem = {
      id: String(newId),
      text: "",
      answers: [""],
      distractors: [""],
      audio: null,
      audioType: "upload",
    };

    setFillItems([...fillItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (fillItems.length <= 1) return;
    const items = fillItems.filter((item) => item.id !== id);

    setFillItems(items);

    setInputError((prev) => prev?.filter((e) => e.id !== id));
    setAnswerErrorInput((prev) => prev?.filter((e) => e.id !== id));
    setDistractorErrorInput((prev) => prev.filter((e) => e.id !== id));
    setAudioError((prev) => prev?.filter((e) => e.id !== id));
  };

  const handleSelectAudioType = (
    id: string,
    audioType: "upload" | "record" | "system",
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
    const update = fillItems.map((item) =>
      item.id === id ? { ...item, text: value } : item,
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

  const handleRemoveAnswer = (id: string, index: number) => {
    const update = fillItems.map((item) => {
      if (item.id === id && item.answers.length > 1) {
        const updatedAnswers = item.answers.filter((_, i) => i !== index);
        return {
          ...item,
          answers: updatedAnswers,
        };
      }
      return item;
    });

    setFillItems(update);
    setAnswerErrorInput((prev) =>
      prev.filter((ans) => !(ans.id === id && ans.index === index)),
    );
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
      handleAnswerInput={(id, index, value) =>
        handleAnswerInput(id, index, value)
      }
      handleAddAnswer={(id) => handleAddAnswer(id)}
      firstIndex={fillItems[0]?.id}
      lastIndex={fillItems[fillItems.length - 1]?.id ?? 0}
      audioError={audioError}
      answerInputError={answerErrorInput}
      handleRemoveAnswer={(id: string, index: number) =>
        handleRemoveAnswer(id, index)
      }
    />
  );
};

export default memo(FillRenderItem);
