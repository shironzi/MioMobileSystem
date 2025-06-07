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

interface InputError {
  id: string | null;
  index: number[];
  error: string | null;
}

export function validateHomonymItems(items: HomonymItem[]) {
  const inputErrors: InputError[] = [];
  const distractorErrors: {
    id: string | null;
    index: number | null;
    error: string;
  }[] = [];
  const answerErrors: InputError[] = [];
  const audioErrors: InputError[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const inputIndexErrors: number[] = [];
    const answerIndexErrors: number[] = [];
    const audioIndexErrors: number[] = [];

    if (!item.text[0]?.trim() || !item.text[0].includes("_"))
      inputIndexErrors.push(0);
    if (!item.text[1]?.trim() || !item.text[1].includes("_"))
      inputIndexErrors.push(1);
    if (inputIndexErrors.length)
      inputErrors.push({
        id: item.id,
        index: inputIndexErrors,
        error: "This field is required and must contain an underscore (_).",
      });

    if (!item.answer[0]?.trim()) answerIndexErrors.push(0);
    if (!item.answer[1]?.trim()) answerIndexErrors.push(1);
    if (answerIndexErrors.length)
      answerErrors.push({
        id: item.id,
        index: answerIndexErrors,
        error: "This field is required.",
      });

    if (!item.audio[0] && item.audioType[0] !== "system")
      audioIndexErrors.push(0);
    if (!item.audio[1] && item.audioType[1] !== "system")
      audioIndexErrors.push(1);
    if (audioIndexErrors.length)
      audioErrors.push({
        id: item.id,
        index: audioIndexErrors,
        error: "This field is required.",
      });

    item.distractors.forEach((dist, idx) => {
      if (!dist.trim()) {
        distractorErrors.push({
          id: item.id,
          index: idx,
          error: "This field is required.",
        });
      }
    });
  }

  return {
    inputErrors,
    distractorErrors,
    answerErrors,
    audioErrors,
    hasErrors:
      inputErrors.length > 0 ||
      distractorErrors.length > 0 ||
      answerErrors.length > 0 ||
      audioErrors.length > 0,
  };
}
