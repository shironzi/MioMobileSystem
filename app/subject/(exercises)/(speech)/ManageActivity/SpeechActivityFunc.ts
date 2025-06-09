interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface PictureItem {
  id: string;
  flashcard_id: string | null;
  file: FileInfo | null;
  text: string;
  image_url: string;
}

interface InputError {
  id: string;
  error: string;
}

export function addPicture(id: string) {
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
