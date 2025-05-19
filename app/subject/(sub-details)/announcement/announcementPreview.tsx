import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AnnouncementPreview = () => {
  useHeaderConfig("Announcement Preview");

  const { title, description, files } = useLocalSearchParams<{
    title: string;
    description: string;
    files?: string;
  }>();

  const fileList: FileInfo[] = files ? JSON.parse(files) : [];

  const [localUris, setLocalUris] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const uris = await Promise.all(
        fileList.map(async (file) => {
          try {
            const cached = await ExpoImage.getCachePathAsync(file.uri);
            return cached ?? file.uri;
          } catch {
            return file.uri;
          }
        })
      );
      setLocalUris(uris);
    })();
  }, [fileList]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <Text style={styles.text}>{title}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{description}</Text>

      {fileList.length > 0 && <Text style={styles.label}>Attachments:</Text>}

      {fileList.map((file, idx) => {
        const localUri = localUris[idx];
        const isImage = file.mimeType?.startsWith("image/");
        return (
          <View key={idx} style={styles.attachment}>
            {isImage && localUri ? (
              <ExpoImage
                source={localUri}
                style={styles.image}
                contentFit="contain"
              />
            ) : (
              <Text style={styles.fileName}>{file.name}</Text>
            )}
          </View>
        );
      })}
      <TouchableOpacity style={globalStyles.submitButton}>
        <Text style={globalStyles.submitButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    fontSize: 16,
  },
  text: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  attachment: {
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  fileName: {
    fontSize: 14,
    color: "#555",
  },
});

export default memo(AnnouncementPreview);
