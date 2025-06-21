import LanguageAudioUpload from "@/app/subject/(exercises)/(language)/ManageActivity/Fill/LanguageAudioUpload";
import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  item_id: string | null;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
  audioType: "upload" | "record";
}

interface InputError {
  id: string | null;
  index: number | null;
  errorMessage: string;
}

interface Props {
  item: FillItem;
  firstIndex: string;
  lastIndex: string;
  distractorErrorInput: InputError[];
  handleRemoveItem: (id: string) => void;
  inputError: InputError[];
  handleTextInput: (id: string, value: string) => void;
  handleAddAudio: (id: string, file: FileInfo) => void;
  handleAudioRecording: (id: string, uri: string | null) => void;
  handleSelectAudioType: (type: string, value: "upload" | "record") => void;
  handleRemoveAudio: (id: string) => void;
  handleAddItem: () => void;
  handleAddDistractor: (id: string) => void;
  handleDistractorInput: (id: string, index: number, value: string) => void;
  handleRemoveDistractor: (id: string, index: number) => void;
  audioError: { id: string | null }[];
  handleSubmit: () => void;
}

const LanguageFillActivity = ({
  item,
  firstIndex,
  lastIndex,
  handleRemoveItem,
  inputError,
  handleTextInput,
  handleAddAudio,
  handleAudioRecording,
  handleSelectAudioType,
  handleRemoveAudio,
  handleAddItem,
  handleAddDistractor,
  distractorErrorInput,
  handleDistractorInput,
  handleRemoveDistractor,
  audioError,
  handleSubmit,
}: Props) => {
  const item_id = parseInt(item.id);
  const [descHeight, setDescHeight] = useState<number>(100);

  const textError = inputError.find((e) => e.id === item.id)?.errorMessage;
  const audioErrors = audioError.find((e) => e.id === item.id);

  const getDistractorError = (index: number) => {
    return distractorErrorInput.find(
      (err) => err.id === item.id && err.index === index,
    )?.errorMessage;
  };

  const router = useRouter();

  return (
    <GestureHandlerRootView>
      <View
        style={[
          styles.itemContainer,
          item.id === firstIndex && styles.itemTopRounded,
          item.id === lastIndex && styles.itemBottomRounded,
        ]}
      >
        {item_id === 0 && (
          <View style={styles.headerContainer}>
            <Text style={[globalStyles.text1,{ marginTop:5 }]}>
              Fill in the Blank
            </Text>
            <View style={[globalStyles.divider, { marginVertical: 10, width: 340, left: -10 }]} />
          </View>
        )}
        <View style={styles.itemBodyContainer}>
          <View style={[styles.itemHeaderRow]}>
            <Text style={globalStyles.text1}>Sentence</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <AntDesign name="close" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
          {textError && <Text style={styles.errorText}>{textError}</Text>}
          <TextInput
            style={[
              styles.textInputContainer,
              { height: Math.min(Math.max(descHeight, 100), 200) },
              !!textError && styles.errorBorder,
            ]}
            placeholder="Type a sentence with a blank for the answer (e.g., The sun _____ in the east.)"
            multiline={true}
            onContentSizeChange={(e) =>
              setDescHeight(e.nativeEvent.contentSize.height)
            }
            textAlignVertical="top"
            value={item.text}
            onChangeText={(value: string) => handleTextInput(item.id, value)}
          />
        </View>
        <View style={{ marginBottom: 20, rowGap: 10 }}>
          {item.distractors.map((value, index) => (
            <View key={index}>
              {index === 0 && (
                <Text style={[globalStyles.text1, { marginVertical:10, marginTop:-5 }]}>Distractors</Text>
              )}
              <View style={styles.distractorRow}>
                <View style={{ width: "90%" }}>
                  {getDistractorError(index) && (
                    <Text style={styles.errorText}>
                      {getDistractorError(index)}
                    </Text>
                  )}
                  <TextInput
                    style={[
                      styles.textInputContainer,
                      getDistractorError(index) && styles.errorBorder,
                    ]}
                    placeholder={"E.g., 'bare' for 'bear'"}
                    value={value}
                    onChangeText={(value) =>
                      handleDistractorInput(item.id, index, value)
                    }
                  />
                </View>
                {index !== 0 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveDistractor(item.id, index)}
                  >
                    <AntDesign name="close" size={20} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addItemRow}
            onPress={() => handleAddDistractor(item.id)}
          >
            <MaterialIcons name="add" size={20} color="#FFBF18" />
            <Text style={styles.addFileText}>Add distractor</Text>
          </TouchableOpacity>
        </View>
        <LanguageAudioUpload
          item={item}
          isTextEmpty={item.text.trim().length < 1}
          handleAddAudio={(id, file) => handleAddAudio(id, file)}
          inputError={!!audioErrors}
          handleAudioRecording={(id, uri) => handleAudioRecording(id, uri)}
          handleSelectAudioType={(id, value) =>
            handleSelectAudioType(id, value)
          }
          handleRemoveAudio={(id) => handleRemoveAudio(id)}
        />
            <View style={[globalStyles.divider, { marginVertical: 10, width: 340, left: -10 }]} />
            {item.id === lastIndex && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.addItemRow}
              onPress={() => handleAddItem()}
            >
              <MaterialIcons name="add" size={20} color="#FFBF18" />
              <Text style={styles.addFileText}>Add Item</Text>
            </TouchableOpacity>

            <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:10}}>
            <TouchableOpacity
              style={[globalStyles.inactivityButton, {width:"48%"}]}
              onPress={() => router.back()}
            >
              <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[ globalStyles.submitButton, {width:"48%"} ]}
              onPress={handleSubmit}
            >
              <Text style={[globalStyles.submitButtonText, {top:3}]}>Submit</Text>
            </TouchableOpacity>
            </View>

            
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 20,
    marginHorizontal: 25,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius:20
  },
  itemTopRounded: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemBottomRounded: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  headerContainer: {
    paddingTop: 10,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    width:"100%"
  },
  errorBorder: {
    borderColor: "#db4141",
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
  headerText: {
    paddingVertical: 10,
  },
  itemBodyContainer: {
    marginBottom: 15,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:0,
    marginVertical: 10,
  },
  footerContainer: {
    backgroundColor: "#fff",
    rowGap: 15,
    paddingBottom: 20,
  },
  addItemRow: {
    flexDirection: "row",
    marginVertical:5
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  distractorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7.5,
  },
});

export default memo(LanguageFillActivity);
