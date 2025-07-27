import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createAnnouncement, editAnnouncement } from "@/utils/query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useState } from "react";
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
  const imageList: FileInfo[] = imageUrl ? JSON.parse(imageUrl) : [];
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateAnnouncement = async () => {
    setIsSubmitting(true);
    const res = announcementId
      ? await editAnnouncement(
          title,
          description,
          fileList,
          urlList,
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

    console.log(res);

    setIsSubmitting(false);

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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={[
          globalStyles.container,
          { flex: 1, paddingBottom: 70, height: "100%" },
        ]}
      >
        <View style={[globalStyles.cardContainer]}>
          <Text style={[styles.text, { top: 5, fontWeight: 500 }]}>
            {title}
          </Text>
          <Text
            style={[styles.text, { top: 10, fontSize: 16, marginBottom: 15 }]}
          >
            {description}
          </Text>

          {urlList.length > 0 && (
            <>
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
                source={{ uri: item.uri }}
                style={styles.image}
                contentFit="contain"
              />
            </View>
          ))}
          {fileList.map((file, idx) => (
            <Image
              source={{ uri: file.uri }}
              key={idx}
              style={styles.image}
              contentFit="contain"
            />
          ))}
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
              disabled={isSubmitting}
            >
              <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
                {announcementId
                  ? isSubmitting
                    ? "Updating..."
                    : "Update"
                  : isSubmitting
                    ? "Creating..."
                    : "Create"}
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
