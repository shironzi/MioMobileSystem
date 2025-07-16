import { Picker } from "@react-native-picker/picker";
import { Text, TextInput, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import React, { useEffect } from "react";
import FileUpload from "@/components/FileUpload";

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
  modulePosition: string;
  setModulePosition: (value: string) => void;
  inputErrors: Error[];
  modules: string[];
}

const AddModuleHeader = ({
  title,
  setTitle,
  description,
  setDescription,
  setModuleFile,
  modulePosition,
  setModulePosition,
  inputErrors,
  modules,
}: Props) => {
  const lastModule = modules[modules.length - 1];
  const lastNumber = parseInt(lastModule.split(" ")[1]) || 0;
  const newNumber = lastNumber + 1;

  useEffect(() => {
    setModulePosition(newNumber.toString());
  }, []);

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
      <View>
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
              handleFiles={(file: FileInfo[]) => setModuleFile(file)}
            />
          </View>
        </View>
      </View>
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
                label={index + 1 + " - " + title}
                value={title}
                key={index.toString()}
              />
            ))}
            <Picker.Item
              label={newNumber + " - (Add to End)"}
              value={newNumber.toString()}
            />
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default AddModuleHeader;
