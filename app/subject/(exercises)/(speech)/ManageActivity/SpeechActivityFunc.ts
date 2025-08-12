import { Flashcard } from "@/app/subject/(exercises)/(speech)/SpeechDataTypes";

// interface InputError {
//   id: string;
//   error: string;
// }

export default function addFlashcard(flashcards: Flashcard[]): Flashcard[] {
  const index = flashcards.length.toString();

  return [
    ...flashcards,
    {
      flashcard_id: index,
      text: "",
      image_url: "",
    },
  ];
}

// export function handleError(pictureFlashcard: Flashcard[]) {
//   const errors: InputError[] = [];
//
//   pictureFlashcard.map((item) => {
//     if (!item.text.trim()) {
//       errors.push({ id: item.id, error: "word" });
//     }
//     if (!item.file) {
//       errors.push({ id: item.id, error: "image" });
//     }
//   });
//
//   return errors;
// }

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
  console.log("Updated");

  return flashcards.map((item) =>
    item.flashcard_id === id ? { ...item, image_url: uri } : item,
  );
}

export function flashcardText(
  id: string,
  text: string,
  flashcards: Flashcard[],
): Flashcard[] {
  return flashcards.map((item) =>
    item.flashcard_id === id ? { ...item, text } : item,
  );
}

export function getActivityType(activityType: string) {
  if (activityType === "picture") {
    return "Picture Flashcards";
  } else if (activityType === "phrase") {
    return "Reading Flashcards";
  } else if (activityType === "question") {
    return "Word Flashcards";
  } else {
    return "Flashcards";
  }
}
