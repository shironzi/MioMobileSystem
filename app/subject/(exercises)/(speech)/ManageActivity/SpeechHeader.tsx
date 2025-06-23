import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SpeechHeader = (props: {
  activityType: string;
  setActivityType: (value: string) => void;
  activityDifficulty: string;
  setActivityDifficulty: (value: string) => void;
}) => (
  <View style={{ padding: 20, paddingBottom: 0 }}>
    <View style={globalStyles.cardContainer}>
      <Text style={{ fontSize: 16, fontWeight: 500 }}>Type of Exercise</Text>
      <View style={styles.picker}>
        <Picker
          //
          mode="dropdown"
          selectedValue={props.activityType}
          onValueChange={(value) => {
            props.setActivityType(value);
          }}
        >
          <Picker.Item label="Picture Flashcards" value="picture" />
          <Picker.Item label="Word Flashcards" value="question" />
          <Picker.Item label="Reading Flashcards" value="phrase" />
          {/* <Picker.Item
          label="Readme: Pronunciation Challenge"
          value="pronunciation"
        /> */}
        </Picker>
      </View>

      <Text style={{ fontSize: 16, fontWeight: 500 }}>Difficulty Level</Text>
      <View style={styles.picker}>
        <Picker
          mode="dropdown"
          selectedValue={props.activityDifficulty}
          onValueChange={props.setActivityDifficulty}
          // style={{borderRadius:20, borderColor:"#000", borderWidth:3, height:100}}
        >
          <Picker.Item label="Easy" value="easy" />
          <Picker.Item label="Average" value="average" />
          <Picker.Item label="Difficult" value="difficult" />
          <Picker.Item label="Challenge" value="challenge" />
        </Picker>
      </View>
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

export default SpeechHeader;
