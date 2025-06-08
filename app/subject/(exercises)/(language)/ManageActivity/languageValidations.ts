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
  audioType: ("upload" | "record")[];
}

interface InputError {
  id: string | null;
  index: number[];
  error: string | null;
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

export default function validateHomonymItems(items: HomonymItem[]) {
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

    if (!item.audio?.[0] && !item.audio_path?.[0]) {
      audioIndexErrors.push(0);
    }

    if (!item.audio?.[1] && !item.audio_path?.[1]) {
      audioIndexErrors.push(1);
    }
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

interface FillInputError {
  id: string | null;
  index: number | null;
  errorMessage: string;
}

export function validateFillItems(items: FillItem[]) {
  const inputErrors: FillInputError[] = [];
  const distractorErrors: FillInputError[] = [];
  const audioErrors: FillInputError[] = [];

  for (let item of items) {
    if (!item.text.trim()) {
      inputErrors.push({
        id: item.id,
        index: null,
        errorMessage: "This field is required",
      });
    }

    item.distractors.forEach((dis, idx) => {
      if (!dis.trim()) {
        distractorErrors.push({
          id: item.id,
          index: idx,
          errorMessage: "This field is required",
        });
      }
    });

    if (!item.audio) {
      audioErrors.push({
        id: item.id,
        index: null,
        errorMessage: "This field is required",
      });
    }
  }

  return { inputErrors, distractorErrors, audioErrors };
}
