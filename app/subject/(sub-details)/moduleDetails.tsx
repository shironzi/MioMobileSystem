import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import React, { memo, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getModuleById } from "@/utils/modules";
import Feather from "@expo/vector-icons/Feather";
import WebView from "react-native-webview";
import LoadingCard from "@/components/loadingCard";
import YoutubeVideoPlayer from "@/components/YoutubeVideoPlayer";
import { Ionicons } from "@expo/vector-icons";
import AuditoryWord from "@/app/subject/(sub-details)/Modules/AuditoryWord";
import VideoScreen from "@/components/VideoScreen";

interface File {
  name: string;
  url: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  remedial_module?: boolean;
}

interface Subsection {
  description: string;
  media: File[];
  video_links: string[];
  title: string;
}

interface word {
  word: string;
  media: File | null;
  video_link: string;
}

interface Module {
  description: string;
  files: File[];
  module_id: string;
  subsections: Subsection[];
  title: string;
  prereq_status: boolean;
  visibility: string;
  focus_ipa: string;
  remedial_for: string;
  words: word[];
}

const moduleDetails = () => {
  HeaderConfig("Module");

  const [module, setModule] = useState<Module>();
  const [webViewUri, setWebViewUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [position, setPosition] = useState<number>();

  const {
    id,
    title,
    description,
    subjectId,
    index,
    role,
    modules,
    assignments,
    specialized,
    isRemedial,
    specializedType,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    subjectId: string;
    index: string;
    role: string;
    modules: string;
    assignments: string;
    specialized: string;
    isRemedial: string;
    specializedType: string;
  }>();

  useEffect(() => {
    const fetchModule = async () => {
      const res = await getModuleById(subjectId, id);

      if (res.success) {
        setModule(res.module);
        setPosition(res.position);

        console.log(position);
      }
      setLoading(false);
    };
    fetchModule();
  }, []);

  const handleOnPress = (url: string) => {
    if (url) {
      setWebViewUri(url);
    }
  };

  const editModule = () => {
    const encodedModulesFiles =
      encodeURIComponent(JSON.stringify(module?.files)) ?? [];
    const encodedSubSections =
      encodeURIComponent(JSON.stringify(module?.subsections)) ?? [];
    const encodedWordList =
      encodeURIComponent(JSON.stringify(module?.words)) ?? [];
    if (isRemedial === "true") {
      router.push({
        pathname: "/subject/(sub-details)/Modules/AddModules",
        params: {
          moduleId: id,
          subjectId,
          moduleTitle: module?.title,
          moduleDescription: module?.description,
          encodedModulesFiles,
          encodedSubSections,
          remedialModule: isRemedial,
          focus_ipa: module?.focus_ipa,
          specializedType: specializedType,
          encodedWordList: encodedWordList,
        },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/Modules/AddModules",
        params: {
          moduleId: id,
          subjectId,
          modules,
          assignments,
          specialized,
          moduleTitle: module?.title,
          moduleDescription: module?.description,
          position: position?.toString(),
          encodedModulesFiles,
          encodedSubSections,
          prereq_status: module?.prereq_status.toString(),
          visibility: module?.visibility,
          specializedType: specializedType,
        },
      });
    }
  };

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
    <View style={styles.container}>
      {module ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {role === "teacher" && (
            <TouchableOpacity style={styles.addButton} onPress={editModule}>
              <View
                style={{
                  top: 20,
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                <Ionicons name="add-circle" size={20} color="#ffbf18" />
                <Text style={styles.addText}>
                  Edit {isRemedial === "true" ? "Remedial" : "Module"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <View style={globalStyles.cardContainer1}>
            <Text style={globalStyles.text1}>
              [M{index} - Main] {title}
            </Text>
            <Text style={globalStyles.text2}>{description}</Text>
            {module.files?.map((item, index) => {
              let fileType = "unknown";
              const lastSegment = item.url.split(".").pop();
              if (lastSegment) {
                fileType = lastSegment.split("?")[0];
              }

              return (
                <View key={index}>
                  {fileType === "png" ||
                    (fileType === "jpg" && (
                      <Image source={{ uri: fileType }} />
                    ))}
                  {(fileType === "pdf" ||
                    fileType === "ppt" ||
                    fileType === "pptx") && (
                    <TouchableOpacity
                      onPress={() => handleOnPress(item.url)}
                      style={[
                        globalStyles.submitButton,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          columnGap: 10,
                        },
                      ]}
                    >
                      <Feather name="download" size={20} color="#fff" />
                      <Text style={globalStyles.submitButtonText}>
                        Download ({fileType.toUpperCase()})
                      </Text>
                    </TouchableOpacity>
                  )}
                  {fileType === "mp4" && <VideoScreen videoSource={item.url} />}
                </View>
              );
            })}
          </View>
          <View style={{ rowGap: 20, marginBottom: 70 }}>
            {module.subsections?.map((item, index) => (
              <View
                style={[globalStyles.cardContainer1, { marginVertical: 0 }]}
                key={index}
              >
                <Text style={globalStyles.text1}>{item.title}</Text>
                <Text style={globalStyles.text2}>{item.description}</Text>
                {item.media?.map((item, index) => {
                  let fileType = "unknown";
                  const lastSegment = item.url.split(".").pop();
                  if (lastSegment) {
                    fileType = lastSegment.split("?")[0];
                  }

                  return (
                    <View key={index}>
                      {fileType === "png" ||
                        (fileType === "jpg" && (
                          <Image source={{ uri: fileType }} />
                        ))}
                      {(fileType === "pdf" ||
                        fileType === "ppt" ||
                        fileType === "pptx") && (
                        <TouchableOpacity
                          onPress={() => handleOnPress(item.url)}
                          style={[
                            globalStyles.submitButton,
                            {
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              columnGap: 10,
                            },
                          ]}
                        >
                          <Feather name="download" size={20} color="#fff" />
                          <Text style={globalStyles.submitButtonText}>
                            Download ({fileType.toUpperCase()})
                          </Text>
                        </TouchableOpacity>
                      )}
                      {fileType === "mp4" && (
                        <VideoScreen videoSource={item.url} />
                      )}
                    </View>
                  );
                })}
                {item.video_links?.map((item, index) => (
                  <YoutubeVideoPlayer video_url={item} key={index} />
                ))}
              </View>
            ))}
          </View>

          {module.words.length > 0 && (
            <View>
              <View style={globalStyles.cardContainer1}>
                <Text style={globalStyles.text1}>🎧 Listen and Repeat!</Text>
                <Text style={{ fontWeight: "bold" }}>
                  Let’s practice saying words clearly!🗣️
                </Text>
                <Text style={{ fontSize: 13 }}>
                  <Text style={{ fontWeight: "bold" }}>Need help?</Text> Tap the
                  question mark{" "}
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>(?)</Text>{" "}
                  button to watch a short video. It will show you how to move
                  your mouth and lips to say the word the right way.
                </Text>
              </View>
              {module?.words.map((item, index) => (
                <View
                  style={[
                    globalStyles.cardContainer1,
                    { marginVertical: "auto" },
                  ]}
                  key={index}
                >
                  <AuditoryWord text={item.word} video_link={item.video_link} />
                </View>
              ))}
            </View>
          )}

          {webViewUri && (
            <WebView source={{ uri: webViewUri }} style={{ flex: 1 }} />
          )}
        </ScrollView>
      ) : (
        <View>
          <Text>There was no modules yet!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2264dc",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: "#000",
    textAlign: "justify",
    lineHeight: 20,
    width: "100%",
    marginBottom: 10,
    fontWeight: 300,
  },
  addButton: {
    backgroundColor: "#fcefcc",
    borderColor: "#ffbf18",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    marginBottom: 20,
    height: 60,
    marginTop: 20,
  },
  addText: {
    color: "#ffbf18",
    fontWeight: 500,
    marginHorizontal: 10,
  },
});

export default memo(moduleDetails);
