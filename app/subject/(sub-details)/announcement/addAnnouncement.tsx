import FileUpload from "@/components/FileUpload";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getAnnouncementById } from "@/utils/query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDate } from "@/utils/DateFormat";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface UrlError {
  index: number;
}

const addAnnouncement = () => {
  useHeaderConfig("Announcement");
  const router = useRouter();

  const { subjectId, announcementId } = useLocalSearchParams<{
    subjectId: string;
    announcementId: string;
  }>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [descHeight, setDescHeight] = useState<number>(200);
  const [files, setFiles] = useState<FileInfo[] | string[]>([]);
  const [imageUrl, setImageUrl] = useState<{ url: string; name: string }[]>([]);
  const [urls, setUrls] = useState<string[]>([""]);
  const [urlError, setUrlError] = useState<UrlError[]>([]);
  const [inputError, setInputError] = useState<{ error: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePreview = () => {
    const errors: { error: string }[] = [];

    if (!title?.trim()) {
      errors.push({ error: "title" });
    }

    if (!description?.trim()) {
      errors.push({ error: "description" });
    }

    if (errors.length > 0) {
      setInputError(errors);
      return;
    }

    const formattedDate = getDate(date);
    router.push({
      pathname: "/subject/(sub-details)/announcement/announcementPreview",
      params: {
        title,
        description,
        files: JSON.stringify(files),
        urls: JSON.stringify(urls),
        imageUrl: JSON.stringify(imageUrl),
        subjectId,
        announcementId,
        formattedDate,
      },
    });
  };

  const handleFileUpload = (files: FileInfo[]) => {
    setFiles(files);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddUrl = () => {
    const errors: UrlError[] = [];

    urls.forEach((url, index) => {
      if (!url.trim()) {
        errors.push({ index });
      }
    });

    if (errors.length > 0) {
      setUrlError(errors);
      return;
    }

    setUrlError([]);
    setUrls((prev) => [...prev, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length === 1) return;

    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageRemove = (index: number) => {
    setImageUrl((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!announcementId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await getAnnouncementById(subjectId, announcementId);
        const data = res.announcement;

        setTitle(data.title);
        setDescription(data.description);
        setDate(new Date(data.date_posted));
        setUrls(data.links);

        data.files.forEach((item: any) => {
          setImageUrl((prev) => [...prev, { url: item.url, name: item.name }]);
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId, announcementId]);

  if (loading) {
    return (
      <View>
        <Text>Loading......</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Title</Text>
            {inputError.some((item) => item.error === "title") && (
              <Text style={globalStyles.errorText}>This field is required</Text>
            )}
            <TextInput
              placeholder="Enter title"
              style={[
                styles.input,
                inputError.some((err) => err.error === "title") &&
                  styles.inputError,
              ]}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShow(true)}
            >
              <Text>{date.toDateString()}</Text>
              {show && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="calendar"
                  onChange={onChange}
                  maximumDate={new Date(2100, 12, 31)}
                  minimumDate={new Date(2000, 0, 1)}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            {inputError.some((item) => item.error === "description") && (
              <Text style={globalStyles.errorText}>This field is required</Text>
            )}
            <TextInput
              style={[
                styles.descriptionInput,
                { height: Math.max(descHeight, 200) },
                inputError.some((err) => err.error === "description") &&
                  styles.inputError,
              ]}
              placeholder="Enter description..."
              multiline
              onContentSizeChange={(e) =>
                setDescHeight(e.nativeEvent.contentSize.height)
              }
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>URLs</Text>
            {urls.map((url, index) => (
              <View key={index} style={styles.urlRow}>
                <TextInput
                  value={url}
                  placeholder="Enter a URL"
                  onChangeText={(value) =>
                    setUrls((prev) =>
                      prev.map((u, i) => (i === index ? value : u)),
                    )
                  }
                  style={[
                    styles.urlInput,
                    urlError.find((e) => e.index === index) &&
                      styles.inputError,
                  ]}
                />
                <TouchableOpacity onPress={() => handleRemoveUrl(index)}>
                  <AntDesign
                    name="close"
                    size={24}
                    color="#aaa"
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={handleAddUrl}
              style={styles.addUrlButton}
            >
              <Text style={styles.addUrlText}>+ Add URL</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.contentPadding}>
            {imageUrl.map((item, index) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <Text>{item.name}</Text>
                <TouchableOpacity onPress={() => handleImageRemove(index)}>
                  <AntDesign
                    name="close"
                    size={24}
                    color="#aaa"
                    style={{ left: 20 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <FileUpload handleFiles={handleFileUpload} />
          </View>

          <TouchableOpacity
            style={globalStyles.submitButton}
            onPress={handlePreview}
          >
            <Text style={globalStyles.submitButtonText}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 15,
  },
  card: {
    ...globalStyles.contentPadding,
    ...globalStyles.cardContainer,
  },
  section: {
    marginVertical: 10,
  },
  label: {
    fontWeight: "500",
    fontSize: 16,
  },
  input: {
    ...globalStyles.inputContainer,
  },
  inputError: {
    borderColor: "red",
  },
  dateInput: {
    ...globalStyles.inputContainer,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  urlInput: {
    flex: 1,
    ...globalStyles.inputContainer,
  },
  urlInputError: {
    borderColor: "red",
  },
  closeIcon: {
    marginLeft: 10,
  },
  addUrlText: {
    color: "#FFBF18",
    fontWeight: "bold",
  },
  submitButton: {
    width: "100%",
    elevation: 5,
  },
  submitButtonText: {
    ...globalStyles.submitButtonText,
    fontWeight: "bold",
  },
  addUrlButton: {
    marginTop: 10,
  },
});

export default memo(addAnnouncement);
