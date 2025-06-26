import * as FileSystem from "expo-file-system";

const getMimeTypeFromFilename = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    zip: "application/zip",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    mp4: "video/mp4",
    txt: "text/plain",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
    rtf: "application/rtf",
    img: "image/*",
  };

  return (extension && mimeTypes[extension]) || "application/octet-stream";
};

export async function downloadAndSaveFile(work: string) {
  const filename = "download";
  const mimeTypeFromFilename = getMimeTypeFromFilename(work);

  const fileUri = FileSystem.documentDirectory + filename;

  const url = work;
  if (!url) {
    return;
  }

  const result = await FileSystem.downloadAsync(url, fileUri);

  const mimeType = result.headers["Content-Type"] || mimeTypeFromFilename;
  await saveFile(result.uri, filename, mimeType);
}

const saveFile = async (uri: string, filename: string, mimeType: string) => {
  const permission =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (permission.granted) {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (mimeType) {
      const savedUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        filename,
        mimeType,
      );

      await FileSystem.writeAsStringAsync(savedUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
  }
};
