import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Remedial {
  id: string;
  title: string;
}

const ListHeader = (props: {
  activityType: string;
  setActivityType: (value: string) => void;
  activityDifficulty: string;
  setActivityDifficulty: (value: string) => void;
  titleError: boolean;
  setActivityTitle: (value: string) => void;
  activityTitle: string;
  activityId: string;
  remedialList: Remedial[];
  setRemedialId: (value: string) => void;
  remedialId: string;
  remedialIdError: boolean;
}) => (
  <View style={{ margin: 25, marginBottom: 0 }}>
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
              <Picker.Item label="Piddie Says" value="bingo" />
              <Picker.Item label="Matching Cards" value="matching" />
            </Picker>
          </View>

          <Text style={{ fontSize: 16, fontWeight: 500 }}>
            Difficulty Level
          </Text>
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
      <View>
        <Text style={globalStyles.text1}>Supplementary Module</Text>
        {props.remedialIdError && (
          <Text style={globalStyles.errorText}>This field is required</Text>
        )}
        <View style={styles.picker}>
          <Picker
            mode="dropdown"
            selectedValue={props.remedialId}
            onValueChange={props.setRemedialId}
          >
            <Picker.Item
              label="Select"
              value=""
              enabled={props.remedialId === ""}
            />
            {props.remedialList.map((item) => (
              <Picker.Item label={item.title} value={item.id} key={item.id} />
            ))}
          </Picker>
        </View>
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
    marginBottom: 5,
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

export default ListHeader;
