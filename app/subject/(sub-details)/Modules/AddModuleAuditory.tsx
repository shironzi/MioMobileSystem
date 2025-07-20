import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import AuditoryWord from "@/app/subject/(sub-details)/Modules/AuditoryWord";
import { router, useLocalSearchParams } from "expo-router";
import { addRemedialAuditory } from "@/utils/modules";
import FileUploadSingle from "@/components/FileUploadSingle";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  files: FileInfo[];
  videoLink?: string[];
}

interface Word {
  id: string;
  word: string;
  media: FileInfo | null;
  video_link: string;
}

const word = {
  id: "1",
  word: "",
  media: null,
  video_link: "",
};

const AddModuleAuditory = () => {
  useHeaderConfig("Modules");

  const {
    subjectId,
    title,
    description,
    moduleFiles,
    subSections,
    targetModule,
    encodedWordList,
  } = useLocalSearchParams<{
    subjectId: string;
    title: string;
    description: string;
    moduleFiles: string;
    subSections: string;
    targetModule: string;
    encodedWordList: string;
  }>();

  const specializedWordList = useMemo<Word[]>(() => {
    try {
      const parsed: Omit<Word, "id">[] = JSON.parse(encodedWordList || "[]");

      return parsed.map(
        (item: { word: string; media: any; video_link: string }, index) => ({
          id: index.toString(),
          word: item.word,
          media: item.media
            ? {
                name: item.media.name,
                uri: item.media.url,
              }
            : null,
          video_link: item.video_link,
        }),
      );
    } catch {
      return [];
    }
  }, [encodedWordList]);

  const [wordList, setWordList] = useState<Word[]>(
    specializedWordList ?? [word],
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const setFiles = (id: string, files: FileInfo) => {
    setWordList((prevList) =>
      prevList.map((w) => (w.id === id ? { ...w, media: files } : w)),
    );
  };

  const setWord = (id: string, value: string) => {
    setWordList((prevList) =>
      prevList.map((w) => (w.id === id ? { ...w, word: value } : w)),
    );
  };

  const addVideoLink = (id: string, newLink: string) => {
    setWordList((prevList) =>
      prevList.map((w) => (w.id === id ? { ...w, video_link: newLink } : w)),
    );
  };

  const addItem = () => {
    setWordList((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        word: "",
        media: null,
        video_link: "",
      },
    ]);
  };

  const moduleFileList = useMemo<FileInfo[]>(() => {
    try {
      const parsed: FileInfo[] = JSON.parse(moduleFiles || "[]");
      return parsed;
    } catch {
      return [];
    }
  }, [moduleFiles]);

  const subsectionsList = useMemo<ModuleSection[]>(() => {
    try {
      const parsed: ModuleSection[] = JSON.parse(subSections || "[]");
      return parsed;
    } catch {
      return [];
    }
  }, [subSections]);

  const handleCreate = async () => {
    setIsSubmitting(true);
    const res = await addRemedialAuditory(
      subjectId,
      title,
      description,
      moduleFileList,
      subsectionsList,
      targetModule,
      wordList,
    );

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
      Alert.alert("Failed", res.message);
    }

    console.log(res);
  };

  const Footer = (
    <ScrollView>
      <TouchableOpacity
        style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
        onPress={addItem}
      >
        <Text style={globalStyles.submitButtonText}>Add Word</Text>
      </TouchableOpacity>
      <View style={[globalStyles.cardContainer1]}>
        <Text style={globalStyles.text1}>Word List</Text>
        {wordList.map((item, index) => (
          <AuditoryWord text={item.word} key={index} />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 70,
        }}
      >
        <TouchableOpacity
          style={[globalStyles.inactivityButton, { marginHorizontal: "auto" }]}
        >
          <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={handleCreate}
          disabled={isSubmitting}
        >
          <Text style={globalStyles.submitButtonText}>
            {isSubmitting ? "Creating..." : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ height: "100%", backgroundColor: "#fff" }}>
      <FlatList
        data={wordList}
        ListFooterComponent={Footer}
        renderItem={({ item }) => (
          <View style={[globalStyles.cardContainer1]}>
            <View>
              <Text style={globalStyles.text1}>Word</Text>
              <View style={globalStyles.textInputContainer}>
                <TextInput
                  value={item.word}
                  onChangeText={(value: string) => setWord(item.id, value)}
                />
              </View>
            </View>
            {!item.video_link.trim().length && (
              <View>
                <Text style={globalStyles.text1}>Video</Text>
                <FileUploadSingle
                  handleFile={(file: FileInfo) => setFiles(item.id, file)}
                  fileTypes={["mp4"]}
                  showAddFile={false}
                />
              </View>
            )}

            {!item.media && (
              <View>
                <Text style={globalStyles.text1}>Video Link</Text>
                <View style={globalStyles.textInputContainer}>
                  <TextInput
                    value={item.video_link}
                    onChangeText={(value: string) =>
                      addVideoLink(item.id, value)
                    }
                  />
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default AddModuleAuditory;
