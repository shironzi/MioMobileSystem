import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getModuleById } from "@/utils/modules";
import Feather from "@expo/vector-icons/Feather";
import WebView from "react-native-webview";
import LoadingCard from "@/components/loadingCard";

interface Media {
  name: string;
  path: string;
  url: string;
}

interface Subsection {
  description: string;
  media: Media[];
  title: string;
}

interface Prerequisite {
  id: string;
  type: "quiz" | "assignment" | "module"; // Can be one of these types
}

interface File {
  name: string;
  path: string;
  url: string;
}

interface Module {
  description: string;
  files: File[];
  module_id: string;
  prereq_status: boolean;
  prerequisite: Prerequisite;
  subsections: Subsection[];
  title: string;
  visibility: "public" | "private";
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

      setLoading(false);
    };
    fetchModule();
  }, []);

  const handleOnPress = () => {
    const url = module?.files[0].url;
    console.log(url);
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
      {module?.module_id ? (
        <View>
          <View style={globalStyles.cardContainer1}>
            <Text style={globalStyles.text1}>
              [M{index} - Main] {title}
            </Text>
            <Text>{description}</Text>
            <TouchableOpacity
              onPress={handleOnPress}
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
              <Text style={globalStyles.submitButtonText}>Download</Text>
            </TouchableOpacity>
          </View>

          {webViewUri && (
            <WebView source={{ uri: webViewUri }} style={{ flex: 1 }} />
          )}
        </View>
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
