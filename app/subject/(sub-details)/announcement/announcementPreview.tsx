import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createAnnouncement, editAnnouncement } from "@/utils/query";
import { Image as ExpoImage, Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  Linking,
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

  const router = useRouter();

  const {
    title,
    description,
    files,
    urls,
    imageUrl,
    subjectId,
    announcementId,
    formattedDate,
  } = useLocalSearchParams<{
    title: string;
    description: string;
    files: string;
    urls: string;
    imageUrl: string;
    subjectId: string;
    announcementId: string;
    formattedDate: string;
  }>();

  const fileList: FileInfo[] = files ? JSON.parse(files) : [];
  const urlList: string[] = urls ? JSON.parse(urls) : [];
  const imageList: { url: string; name: string }[] = imageUrl
    ? JSON.parse(imageUrl)
    : [];
  const [localUris, setLocalUris] = useState<string[]>([]);

  const handleCreateAnnouncement = async () => {
    const res = announcementId
      ? await editAnnouncement(
          title,
          description,
          fileList,
          urlList,
          imageList,
          subjectId,
          announcementId,
          formattedDate,
        )
      : await createAnnouncement(
          title,
          description,
          fileList,
          urlList,
          subjectId,
          formattedDate,
        );

    if (res.success) {
      Alert.alert(
        "Success",
        res.message,
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
              router.back();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

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
        }),
      );
      setLocalUris(uris);
    })();
  }, [fileList]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, height: "100%" }}
    >
      <View
        style={[
          globalStyles.container,
          { flex: 1, paddingBottom: 500, height: "100%" },
        ]}
      >
        <View style={[globalStyles.cardContainer]}>
          {/* <Text style={[styles.label, { color: "#2264dc" }]}>Title</Text> */}
          <Text style={[styles.text, { top: 5, fontWeight: 500 }]}>
            {title}
          </Text>

          {/* <Text style={[styles.label, { color: "#2264dc", top: 5 }]}>
            Description
          </Text> */}
          <Text
            style={[styles.text, { top: 10, fontSize: 16, marginBottom: 15 }]}
          >
            {description}
          </Text>
          {/* 
          {fileList.length > 0 && (
            <Text style={[styles.label, { color: "#2264dc", top: 10 }]}>
              Attachments
            </Text>
          )} */}

          {urlList.length > 0 && (
            <>
              {/* <Text style={[styles.label, { color: "#2264dc", top: 10 }]}>
                URLs
              </Text> */}
              {urlList.map((url, index) => (
                <Text
                  key={index}
                  style={[
                    styles.text,
                    {
                      color: "#2264dc",
                      textDecorationLine: "underline",
                      fontSize: 16,
                      fontStyle: "italic",
                    },
                  ]}
                  onPress={() => {
                    Linking.openURL(url);
                  }}
                >
                  {url}
                </Text>
              ))}
            </>
          )}
          {imageList.map((item, index) => (
            <View key={index}>
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                contentFit="contain"
              />
            </View>
          ))}
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
                  <Text style={[styles.text]}>{file.name}</Text>
                )}
              </View>
            );
          })}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 30,
              top: 20,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={[globalStyles.inactivityButton, { width: "48%" }]}
              onPress={() => router.back()}
            >
              <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.submitButton, { width: "48%" }]}
              onPress={handleCreateAnnouncement}
            >
              <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
                {announcementId ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  label: {
    fontWeight: 600,
    marginTop: 12,
    fontSize: 18,
  },
  text: {
    marginTop: 4,
    fontSize: 19,
    fontWeight: 300,
    textAlign: "justify",
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
