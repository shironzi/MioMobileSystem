import FileUpload from "@/components/FileUpload";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { getDate } from "@/utils/DateFormat";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getAnnouncementById } from "@/utils/query";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import getAnnouncementTemplate, {
  getTemplateType,
} from "@/app/subject/(sub-details)/announcement/AnnouncementTemplates";

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
  const [descHeight, setDescHeight] = useState<number>(200);
  const [files, setFiles] = useState<FileInfo[] | string[]>([]);
  const [imageUrl, setImageUrl] = useState<{ url: string; name: string }[]>([]);
  const [urls, setUrls] = useState<string[]>([""]);
  const [urlError, setUrlError] = useState<UrlError[]>([]);
  const [inputError, setInputError] = useState<{ error: string }[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("");

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
    if (announcementId) return;
    const { title: templateTitle, description: templateDesc } =
      getAnnouncementTemplate(template, date);
    setTitle(templateTitle);
    setDescription(templateDesc);
  }, [template, date]);

  useEffect(() => {
    if (!announcementId) return;
    setLoading(true);
    (async () => {
      const res = await getAnnouncementById(subjectId, announcementId);
      const data = res.announcement;

      setTitle(data.title);
      setDescription(data.description);
      setDate(new Date(data.date_posted));
      setUrls(data.links);

      const dataTemplate: string = await getTemplateType(data.title);
      console.log(dataTemplate);
      setTemplate(dataTemplate);
      setLoading(false);
    })();
  }, [subjectId, announcementId]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.label}>Title</Text>
              {inputError.some((item) => item.error === "title") && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <View>
                <TextInput
                  placeholder="Enter Announcement Title"
                  style={[
                    styles.input,
                    { paddingRight: 35 },
                    inputError.some((err) => err.error === "title") &&
                      styles.inputError,
                  ]}
                  value={title}
                  multiline={true}
                  onChangeText={setTitle}
                />
                <FontAwesome
                  name="pencil-square-o"
                  size={20}
                  color="#ffbf18"
                  style={styles.iconInsideInput}
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Template</Text>
              <View style={globalStyles.dropdownStyle}>
                <Picker
                  selectedValue={template}
                  onValueChange={(itemValue) => setTemplate(itemValue)}
                  mode={"dropdown"}
                >
                  <Picker.Item label="-- Select Template --" value="" />
                  <Picker.Item label="No Classes" value="no_class" />
                  <Picker.Item label="Emergency" value="emergency" />
                  <Picker.Item
                    label="Assignment Reminder"
                    value="reminder_assignment"
                  />
                  <Picker.Item label="Quiz Reminder" value="reminder_quiz" />
                </Picker>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={globalStyles.text1}>Date</Text>
              <View style={{ width: "100%" }}>
                {inputError.some((err) => err.error === "date") && (
                  <Text style={globalStyles.errorText}>
                    This field is required!
                  </Text>
                )}
                <View style={[globalStyles.cardContainer]}>
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={[
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text style={{ color: date ? "#000" : "#aaa" }}>
                      {date ? date.toDateString() : "Select date"}
                    </Text>
                    <MaterialIcons
                      name="date-range"
                      size={22}
                      color="#ffbf18"
                    />
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={date ?? new Date()}
                      mode={"date"}
                      display="default"
                      minimumDate={new Date()}
                      onChange={(event, selected) => {
                        setShowPicker(false);
                        if (event.type !== "dismissed" && selected) {
                          setDate(selected);
                        }
                      }}
                    />
                  )}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              {inputError.some((item) => item.error === "description") && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
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
                      { marginVertical: 5 },
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
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 10,
                    marginTop: 0,
                  }}
                >
                  <MaterialIcons name="add" size={20} color="#FFBF18" />
                  <Text style={styles.addUrlText}>Add URL</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[globalStyles.contentPadding]}>
              {imageUrl.map((item, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    marginTop: 0,
                  }}
                  key={index}
                >
                  <Text style={globalStyles.text1}>
                    {item.name ?? "unnamed"}
                  </Text>
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                bottom: 0,
                marginTop: -70,
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
                onPress={handlePreview}
              >
                <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
                  Preview
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 15,
    backgroundColor: "#fff",
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
    marginBottom: 15,
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
    borderColor: "#db4141",
  },
  closeIcon: {
    marginLeft: 10,
  },
  addUrlText: {
    color: "#FFBF18",
    fontSize: 16,
    marginLeft: 5,
    // marginBottom: 10,
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
  inputIconWrapper: {
    position: "relative",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
  },

  iconInsideInput: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});

export default memo(addAnnouncement);
