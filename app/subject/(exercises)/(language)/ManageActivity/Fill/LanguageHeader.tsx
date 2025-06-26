import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const LanguageHeader = (props: {
  activityType: string;
  setActivityType: (value: string) => void;
  activityDifficulty: string;
  setActivityDifficulty: (value: string) => void;
  titleError: boolean;
  activityTitle: string;
  setActivityTitle: (value: string) => void;
  activityId: string;
}) => (
  <View style={{ marginHorizontal: 25, marginTop: 20 }}>
    <View style={globalStyles.cardContainer}>
      <Text style={{ fontSize: 16, fontWeight: 500 }}>Title</Text>
      <View style={{ marginVertical: 10 }}>
        {props.titleError && (
          <Text style={globalStyles.errorText}>This field is required</Text>
        )}
        <TextInput
          style={[
            globalStyles.textInputContainer,
            { paddingVertical: 15 },
            props.titleError && { borderColor: "red" },
          ]}
          placeholder={"Enter Title"}
          value={props.activityTitle}
          onChangeText={(value) => props.setActivityTitle(value)}
        />
      </View>
      {!props.activityId && (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 500 }}>
            Type of Exercise
          </Text>
          <View style={styles.picker}>
            <Picker
              mode="dropdown"
              selectedValue={props.activityType}
              onValueChange={(value) => {
                props.setActivityType(value);
              }}
            >
              <Picker.Item label="Fill in the Blank" value="fill" />
              <Picker.Item label="Homonyms" value="homonyms" />
            </Picker>
          </View>

          <Text style={globalStyles.text1}>Difficulty Level</Text>
          <View style={styles.picker}>
            <Picker
              mode="dropdown"
              selectedValue={props.activityDifficulty}
              onValueChange={props.setActivityDifficulty}
            >
              <Picker.Item label="Easy" value="easy" />
              <Picker.Item label="Average" value="average" />
              <Picker.Item label="Difficult" value="difficult" />
              <Picker.Item label="Challenge" value="challenge" />
            </Picker>
          </View>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 3,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    marginBottom: -5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  picker: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default LanguageHeader;
