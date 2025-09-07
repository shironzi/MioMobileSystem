import { Image, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import globalStyles from "@/styles/globalStyles";
import VideoScreen from "@/components/VideoScreen";
import React, { useState } from "react";
import WebView from "react-native-webview";

interface Props {
  url: string;
}

const FilePreview = ({ url }: Props) => {
  const [webViewUri, setWebViewUri] = useState<string | null>(null);

  const fileType = url.split(".").pop()?.split("?")[0];

  const handleOnPress = (url: string) => {
    if (url) {
      setWebViewUri(url);
    }
  };

  return (
    <View>
      {fileType === "png" ||
        (fileType === "jpg" && <Image source={{ uri: url }} />)}
      {(fileType === "pdf" || fileType === "ppt" || fileType === "pptx") && (
        <TouchableOpacity
          onPress={() => handleOnPress(url)}
          style={[
            {
              flexDirection: "row",
              alignSelf: "flex-start",
              marginBottom: -5,
            },
          ]}
        >
          <Feather name="download" size={20} color="#ffbf18" />
          <Text
            style={[
              globalStyles.submitButtonText,
              {
                color: "#ffbf18",
                left: 10,
                fontWeight: 400,
              },
            ]}
          >
            {fileType.toUpperCase()}
          </Text>
        </TouchableOpacity>
      )}
      {fileType === "mp4" && <VideoScreen videoSource={url} />}

      {webViewUri && (
        <WebView source={{ uri: webViewUri }} style={{ flex: 1 }} />
      )}
    </View>
  );
};

export default FilePreview;
