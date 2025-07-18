import HomonymAudioUpload from "@/app/subject/(exercises)/(language)/ManageActivity/Homonyms/HomonymAudioUpload";
import globalStyles from "@/styles/globalStyles";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  item_id: string | null;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audio_path: string[];
  filename: string[];
  audioType: ("upload" | "record")[];
}

interface Props {
  inputErrorMessage: any;
  audioErrorMessage: any;
  answerErrorMessage: any;
  item: HomonymItem;
  item_index: number;
  handleTextInput: (id: string, value: string, index: number) => void;
  handleAnswerInput: (id: string, value: string, index: number) => void;
  handleAddAudio: (id: string, file: FileInfo, index: number) => void;
  handleAudioRecording: (id: string, uri: string | null, index: number) => void;
  handleSelectAudioType: (
    id: string,
    value: "upload" | "record",
    index: number,
  ) => void;
  handleRemoveAudio: (id: string, index: number) => void;
}

const HomonymItem = ({
  inputErrorMessage,
  audioErrorMessage,
  answerErrorMessage,
  item,
  item_index,
  handleTextInput,
  handleAnswerInput,
  handleAddAudio,
  handleAudioRecording,
  handleSelectAudioType,
  handleRemoveAudio,
}: Props) => {
  const [descHeight, setDescHeight] = useState<number>(100);

  return (
    <View >
      <View>
        <Text style={[globalStyles.text1,{marginBottom:10, marginTop:-5}]}>
          Sentence {item_index + 1}
        </Text>
        {inputErrorMessage && (
          <Text style={styles.errorText}>{inputErrorMessage}</Text>
        )}
        <TextInput
          style={[
            styles.textInputContainer,
            { height: Math.max(descHeight, 150) },
            inputErrorMessage && styles.errorBorder,
            {fontSize:14}
          ]}
          placeholder="Type the sentence here. (e.g., The ____ rises in the east."
          multiline={true}
          onContentSizeChange={(e) =>
            setDescHeight(e.nativeEvent.contentSize.height)
          }
          textAlignVertical="top"
          value={item.text[item_index]}
          onChangeText={(value: string) =>
            handleTextInput(item.id, value, item_index)
          }
        />
      </View>
      <View>
        <Text style={[globalStyles.text1, {marginVertical:10}]}>Answer</Text>
        {answerErrorMessage && (
          <Text style={styles.errorText}>{answerErrorMessage}</Text>
        )}
        <TextInput
          style={[
            styles.textInputContainer,
            answerErrorMessage && styles.errorBorder,
            {fontSize:14, borderRadius:10}
          ]}
          placeholder={"Enter homonym word (e.g., 'flower')"}
          value={item.answer[item_index]}
          onChangeText={(value) =>
            handleAnswerInput(item.id, value, item_index)
          }
        />
      </View>
      <HomonymAudioUpload
        item={item}
        isTextEmpty={item.text[item_index].trim().length < 1}
        errorMessage={audioErrorMessage}
        itemIndex={item_index}
        handleAddAudio={(id, file) => handleAddAudio(id, file, item_index)}
        inputError={!!audioErrorMessage}
        handleAudioRecording={(id, uri) =>
          handleAudioRecording(id, uri, item_index)
        }
        handleSelectAudioType={(id, value) =>
          handleSelectAudioType(id, value, item_index)
        }
        handleRemoveAudio={(id) => handleRemoveAudio(id, item_index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default memo(HomonymItem);
