import { Picker } from "@react-native-picker/picker";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import React, { useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Error {
  name: string;
  id?: string;
  index?: number;
}

interface Props {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  setModuleFile: (file: FileInfo[]) => void;
  moduleFile: FileInfo[];
  modulePosition: string;
  setModulePosition: (value: string) => void;
  inputErrors: Error[];
  modules: { title: string; id: string }[];
  moduleId: string;
  isRemedial: boolean;
  setIsRemedial: (value: boolean) => void;
  focusedIpa: string;
  setFocusedIpa: (value: string) => void;
  specializedType: string;
}

const ipaToPhoneme = {
  ɑ: "aa",
  æ: "ae",
  ə: "ah0",
  ʌ: "ah1",
  ɔ: "ao",
  aʊ: "aw",
  aɪ: "ay",
  b: "b",
  tʃ: "ch",
  d: "d",
  ð: "dh",
  ɛ: "eh",
  ɚ: "er",
  eɪ: "ey",
  f: "f",
  g: "g",
  h: "hh",
  ɪ: "ih",
  i: "iy",
  dʒ: "jh",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  ŋ: "ng",
  oʊ: "ow",
  ɔɪ: "oy",
  p: "p",
  r: "r",
  s: "s",
  ʃ: "sh",
  t: "t",
  θ: "th",
  ʊ: "uh",
  u: "uw",
  v: "v",
  w: "w",
  j: "y",
  z: "z",
  ʒ: "zh",
};

const AddModuleHeader = ({
  title,
  setTitle,
  description,
  setDescription,
  setModuleFile,
  moduleFile,
  modulePosition,
  setModulePosition,
  inputErrors,
  modules,
  moduleId,
  isRemedial,
  setIsRemedial,
  focusedIpa,
  setFocusedIpa,
  specializedType,
}: Props) => {
  const modulesLen = modules.length + 1;

  useEffect(() => {
    if (modulePosition) return;
    setModulePosition(modulesLen.toString());
  }, []);

  const ipaList = Object.entries(ipaToPhoneme).map(([ipa, phoneme]) => ({
    label: `/${ipa}/`,
    value: phoneme,
  }));

  return (
    <View style={globalStyles.cardContainer1}>
      <View>
        <Text style={globalStyles.text1}>Title</Text>
        {inputErrors.some((err) => err.name === "title") && (
          <Text style={globalStyles.errorText}>This field is required</Text>
        )}
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[
            globalStyles.inputContainer,
            inputErrors.some((err) => err.name === "title") && {
              borderColor: "red",
            },
          ]}
        />
      </View>
      <View>
        <Text style={globalStyles.text1}>Description</Text>
        {inputErrors.some((err) => err.name === "description") && (
          <Text style={globalStyles.errorText}>This field is required</Text>
        )}
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[
            globalStyles.inputContainer,
            { minHeight: 150, textAlignVertical: "top" },
            inputErrors.some((err) => err.name === "description") && {
              borderColor: "red",
            },
          ]}
          multiline
        />
      </View>
      <View style={{ marginBottom: 50 }}>
        <Text style={globalStyles.text1}>Module Files</Text>
        <Text style={globalStyles.text2}>
          Accepts PDF, PPT, video, images, etc. (Max: 100MB per file)
        </Text>
        <View style={{ width: "95%" }}>
          {inputErrors.some((err) => err.name === "moduleFile") && (
            <Text style={globalStyles.errorText}>This field is required</Text>
          )}
          <View
            style={{
              marginBottom: -75,
              width: "90%",
              marginHorizontal: "auto",
            }}
          >
            <FileUpload
              FileUploads={moduleFile}
              handleFiles={(file: FileInfo[]) => setModuleFile(file)}
            />
          </View>
        </View>
      </View>
      {!moduleId && (
        <TouchableOpacity
          onPress={() => setIsRemedial(!isRemedial)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {isRemedial ? (
            <MaterialIcons name="check-box" size={24} color="black" />
          ) : (
            <MaterialIcons
              name="check-box-outline-blank"
              size={24}
              color="black"
            />
          )}
          <Text style={{ fontStyle: "italic", color: "#1a1a1a" }}>
            Supplementary Module?
          </Text>
        </TouchableOpacity>
      )}
      {!isRemedial ? (
        <View>
          <Text style={globalStyles.text1}>Module Position</Text>
          <View style={globalStyles.dropdownStyle}>
            <Picker
              selectedValue={modulePosition}
              onValueChange={setModulePosition}
              mode={"dropdown"}
            >
              {modules.map((title, index) => (
                <Picker.Item
                  label={index + 1 + " - " + title.title}
                  value={index.toString()}
                  key={index.toString()}
                />
              ))}
              {!moduleId && (
                <Picker.Item
                  label={modulesLen + " - (Add to End)"}
                  value={modulesLen.toString()}
                />
              )}
            </Picker>
          </View>
        </View>
      ) : (
        <View>
          {specializedType === "auditory" ? (
            <View></View>
          ) : (
            <View>
              <Text style={globalStyles.text1}>Focus IPA</Text>
              {inputErrors.some((err) => err.name === "focus_ipa") && (
                <Text style={globalStyles.errorText}>
                  This field is required
                </Text>
              )}
              <View
                style={[
                  globalStyles.dropdownStyle,
                  inputErrors.some((err) => err.name === "focus_ipa") && {
                    borderColor: "red",
                  },
                ]}
              >
                <Picker
                  selectedValue={focusedIpa}
                  onValueChange={setFocusedIpa}
                  mode="dropdown"
                >
                  <Picker.Item
                    label="Select"
                    value=""
                    enabled={focusedIpa === ""}
                  />
                  {ipaList.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label} // shows /ɑ/
                      value={item.value} // returns "aa"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AddModuleHeader;
