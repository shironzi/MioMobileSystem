import { StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import React from "react";

const LanguageHeader = (props: {
  activityType: string;
  setActivityType: (value: string) => void;
  activityDifficulty: string;
  setActivityDifficulty: (value: string) => void;
}) => (
  <View style={styles.header}>
    <View style={globalStyles.cardContainer}>
      <Text>Type of Exercise</Text>
      <Picker
        mode="dropdown"
        selectedValue={props.activityType}
        onValueChange={(value) => {
          props.setActivityType(value);
        }}
      >
        <Picker.Item label="Fill in the Blanks" value="fill" />
        <Picker.Item label="Homonyms" value="homonyms" />
      </Picker>

      <Text>Difficulty</Text>
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
);

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LanguageHeader;
