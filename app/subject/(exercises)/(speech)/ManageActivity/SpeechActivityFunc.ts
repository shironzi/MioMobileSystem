import { Flashcard } from "@/app/subject/(exercises)/(speech)/SpeechDataTypes";
import { FileType } from "@/utils/DataTypes";

interface PictureItem {
  id: string;
  flashcard_id: string | null;
  file: FileType | null;
  text: string;
  image_url: string;
}

interface InputError {
  id: string;
  error: string;
}

export default function addPicture(id: string) {
  const newId = parseInt(id) + 1;

  const item: PictureItem = {
    id: newId.toString(),
    flashcard_id: null,
    file: null,
    text: "",
    image_url: "",
  };

  return item;
}

export function handleError(pictureFlashcard: PictureItem[]) {
  const errors: InputError[] = [];

  pictureFlashcard.map((item) => {
    if (!item.text.trim()) {
      errors.push({ id: item.id, error: "word" });
    }
    if (!item.file) {
      errors.push({ id: item.id, error: "image" });
    }
  });

  return errors;
}

export function removeFlashcard(
  id: string,
  flashcards: Flashcard[],
): Flashcard[] {
  return flashcards.filter((item) => item.flashcard_id !== id);
}

export function flashcardFileUpload(
  id: string,
  uri: string,
  flashcards: Flashcard[],
): Flashcard[] {
  flashcards.forEach((item) => {
    if (item.flashcard_id === id) {
      item.image_url = uri;
      return;
    }
  });

  return flashcards;
}

export function flashcardText(
  id: string,
  text: string,
  flashcards: Flashcard[],
): Flashcard[] {
  flashcards.forEach((item) => {
    if (item.flashcard_id === id) {
      item.text = text;
      return;
    }
  });

  console.log(flashcards);

  return flashcards;
}
