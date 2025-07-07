import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Activity {
  activity_id: string;
  activity_title: string;
}

const SpeechHeader = (props: {
  activityType: string;
  setActivityType: (value: string) => void;
  activityDifficulty: string;
  setActivityDifficulty: (value: string) => void;
  activityTitle: string;
  setActivityTitle: (value: string) => void;
  titleError: boolean;
  activityId: string;
  isRemedial: boolean;
  setIsRemedial: (value: boolean) => void;
  pictureActivities: Activity[];
  phraseActivities: Activity[];
  questionActivities: Activity[];
}) => (
  <View style={{ padding: 20, paddingBottom: 0 }}>
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
              <Picker.Item label="Picture Flashcards" value="picture" />
              <Picker.Item label="Word Flashcards" value="question" />
              <Picker.Item label="Reading Flashcards" value="phrase" />
            </Picker>
          </View>

          <TouchableOpacity
            style={{
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 5,
            }}
            onPress={() => props.setIsRemedial(!props.isRemedial)}
          >
            {props.isRemedial ? (
              <Ionicons name="checkbox" size={24} color="#FFBF18" />
            ) : (
              <Ionicons name="checkbox-outline" size={24} color="black" />
            )}

            <Text style={{ fontStyle: "italic" }}>Remedial activity?</Text>
          </TouchableOpacity>

          {!props.isRemedial ? (
            <View>
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
          ) : (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                Select Activity
              </Text>
              <View style={styles.picker}>
                <Picker
                  mode="dropdown"
                  selectedValue={props.activityDifficulty}
                  onValueChange={props.setActivityDifficulty}
                >
                  {props.activityType === "picture" &&
                    props.pictureActivities?.map((item) => (
                      <Picker.Item
                        label={item.activity_title}
                        value={item.activity_title}
                        key={item.activity_id}
                      />
                    ))}

                  {props.activityType === "phrase" &&
                    props.phraseActivities?.map((item) => (
                      <Picker.Item
                        label={item.activity_title}
                        value={item.activity_title}
                        key={item.activity_id}
                      />
                    ))}

                  {props.activityType === "question" &&
                    props.questionActivities?.map((item) => (
                      <Picker.Item
                        label={item.activity_title}
                        value={item.activity_title}
                        key={item.activity_id}
                      />
                    ))}
                </Picker>
              </View>
            </View>
          )}
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

export default SpeechHeader;
