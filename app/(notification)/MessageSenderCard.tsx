import { Image, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AudioPlayer from "@/components/trainingActivities/AudioPlayer";

const MessageSenderCard = ({
  message,
  files,
}: {
  message: string;
  files: string[];
}) => {
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (files && files[0] && files[0].trim()) {
      const fileName = files[0].split("?")[0];
      const fileExtension = fileName.split(".").pop();
      setFileType(fileExtension ?? null);
    }
  }, [files]);

  async function downloadFile(url: string) {
    const fileName = url.split("/").pop();
    if (!FileSystem.documentDirectory) {
      return;
    }
    const localUri = FileSystem.documentDirectory + fileName;

    const { uri } = await FileSystem.downloadAsync(url, localUri);
    console.log("Download completed to", uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      console.log("Sharing is not available on this platform");
    }
  }

  return (
    <View
      style={[
        !fileType && { backgroundColor: "#2264DC" },
        {
          paddingVertical: 10,
          paddingHorizontal: 20,
          maxWidth: "75%",
          borderRadius: 12.5,
          borderBottomRightRadius: 0,
        },
      ]}
    >
      {fileType?.toLowerCase() === "jpg" ||
      fileType?.toLowerCase() === "png" ? (
        <Image
          source={{ uri: files[0] }}
          style={{ width: 150, height: 150, borderRadius: 5 }}
        />
      ) : fileType?.toLowerCase() === "mp3" ? (
        <View style={{ width: "100%" }}>
          <AudioPlayer uri={files[0]} />
        </View>
      ) : (
        fileType && (
          <TouchableOpacity onPress={() => downloadFile(files[0])}>
            <Text>Download</Text>
          </TouchableOpacity>
        )
      )}

      <Text style={{ color: "#fff", textAlign: "left", flexWrap: "wrap" }}>
        {message}
      </Text>
    </View>
  );
};

export default MessageSenderCard;
