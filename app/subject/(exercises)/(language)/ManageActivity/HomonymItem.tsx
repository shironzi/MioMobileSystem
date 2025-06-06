import React, { memo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import HomonymAudioUpload from "@/app/subject/(exercises)/(language)/ManageActivity/HomonymAudioUpload";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}
interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

interface InputError {
  id: string | null;
  index: number[];
}

interface Props {
  inputError: InputError[];
  audioErrors: InputError[];
  answerErrors: InputError[];
  item: HomonymItem;
  item_index: number;
  handleTextInput: (id: string, value: string, index: number) => void;
  handleAnswerInput: (id: string, value: string, index: number) => void;
  handleAddAudio: (id: string, file: FileInfo, index: number) => void;
  handleAudioRecording: (id: string, uri: string | null, index: number) => void;
  handleSelectAudioType: (
    id: string,
    value: "upload" | "record" | "system",
    index: number,
  ) => void;
  handleRemoveAudio: (id: string, index: number) => void;
}

const HomonymItem = ({
  inputError,
  audioErrors,
  answerErrors,
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

  const hasAnswerError = answerErrors.find(
    (e) => e.id === item.id && e.index.includes(item_index),
  );

  return (
    <View>
      <View>
        <Text style={globalStyles.text1}>Homonym 1</Text>
        <TextInput
          style={[
            styles.textInputContainer,
            { height: Math.max(descHeight, 100) },
            inputError.some(
              (e) => e.id === item.id && e.index.includes(item_index),
            ) && styles.errorBorder,
          ]}
          placeholder="Write the sentence (e.g., The sun rises in the east.)"
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
        <Text style={[globalStyles.text1]}>Answer</Text>
        <TextInput
          style={[
            styles.textInputContainer,
            hasAnswerError && styles.errorBorder,
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
        itemIndex={item_index}
        handleAddAudio={(id, file) => handleAddAudio(id, file, item_index)}
        inputError={audioErrors.some(
          (e) => e.id === item.id && e.index.includes(item_index),
        )}
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
});

export default memo(HomonymItem);
