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
import { useLocalSearchParams } from "expo-router";
import { getModuleById } from "@/utils/modules";
import Feather from "@expo/vector-icons/Feather";
import WebView from "react-native-webview";
import LoadingCard from "@/components/loadingCard";

interface Subsection {
  description: string;
  media: string[];
  video_links: string[];
  title: string;
}

interface Module {
  description: string;
  files: string[];
  module_id: string;
  subsections: Subsection[];
  title: string;
}

const moduleDetails = () => {
  HeaderConfig("Module");

  const [module, setModule] = useState<Module>();
  const [webViewUri, setWebViewUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { id, title, description, subjectId, index } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    subjectId: string;
    index: string;
  }>();

  useEffect(() => {
    const fetchModule = async () => {
      const res = await getModuleById(subjectId, id);

      if (res.success) {
        setModule(res.module);
      }

      console.log(res);

      setLoading(false);
    };
    fetchModule();
  }, []);

  const handleOnPress = (url: string) => {
    if (url) {
      setWebViewUri(url);
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
          <View style={globalStyles.cardContainer1}>
            <Text style={globalStyles.text1}>
              [M{index} - Main] {title}
            </Text>
            <Text>{description}</Text>
            {module.files.map((item, index) => {
              let fileType = "unknown";
              const lastSegment = item.split(".").pop();
              if (lastSegment) {
                fileType = lastSegment.split("?")[0];
              }

              return (
                <View key={index}>
                  {fileType === "png" ||
                    (fileType === "jpg" && (
                      <Image source={{ uri: fileType }} />
                    ))}
                  {fileType === "pdf" && (
                    <TouchableOpacity
                      onPress={() => handleOnPress(item)}
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
                </View>
              );
            })}
          </View>
          {module.subsections.map((item) => (
            <View style={[globalStyles.cardContainer1, { marginVertical: 0 }]}>
              <Text style={globalStyles.text1}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          ))}

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
    padding: 10,
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
});

export default memo(moduleDetails);
