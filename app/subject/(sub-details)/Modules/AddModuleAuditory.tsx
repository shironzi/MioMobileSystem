import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import FileUpload from "@/components/FileUpload";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Word {
  id: string;
  word: string;
  media: FileInfo[];
  video_link: string;
}

const word = {
  id: "1",
  word: "",
  media: [],
  video_link: "",
};

const AddModuleAuditory = () => {
  useHeaderConfig("Modules");
  const [wordList, setWordList] = useState<Word[]>([word]);

  const setFiles = (id: string, files: FileInfo[]) => {
    setWordList((prevList) =>
      prevList.map((w) => (w.id === id ? { ...w, media: files } : w)),
    );
  };

  const setWord = (id: string, value: string) => {
    setWordList((prevList) =>
      prevList.map((w) => (w.id === id ? { ...w, word: value } : w)),
    );
  };

  const setVideoLink = (id: string, value: string) => {
    setWordList((prevList) =>
      prevList.map((w) => (w.id === id ? { ...w, video_link: value } : w)),
    );
  };

  const addItem = () => {};

  const Header = (
    <View style={[globalStyles.cardContainer1]}>
      <Text style={globalStyles.text1}>Word List</Text>
    </View>
  );

  const Footer = (
    <View style={{ marginTop: 20 }}>
      <View>
        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={addItem}
        >
          <Text style={globalStyles.submitButtonText}>Add Word</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ height: "100%", backgroundColor: "#fff" }}>
      <FlatList
        data={wordList}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        renderItem={({ item }) => (
          <View style={[globalStyles.cardContainer1, { marginVertical: 0 }]}>
            <View>
              <Text style={globalStyles.text1}>Word</Text>
              <View style={globalStyles.textInputContainer}>
                <TextInput
                  value={item.word}
                  onChangeText={(value: string) => setWord(item.id, value)}
                />
              </View>
            </View>
            <View>
              <FileUpload handleFiles={(files) => setFiles(item.id, files)} />
            </View>

            <View>
              <Text style={globalStyles.text1}>Video Link</Text>
              <View style={globalStyles.textInputContainer}>
                <TextInput
                  value={item.video_link}
                  onChangeText={(value: string) => setVideoLink(item.id, value)}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default AddModuleAuditory;
