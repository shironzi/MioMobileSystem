import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Time from "@/components/DateAndTIme/Time";
import * as SecureStore from "expo-secure-store";
import { CreateRemedialSchedule } from "@/utils/specialized";

interface Remedial {
  activity_title: string;
  remedialId: string;
  activityType: string;
  remedials: string[];
}

interface Error {
  id: string;
  type?: string;
}

const AddRemedialSchedule = () => {
  useHeaderConfig("Remedial Schedule");
  const { subjectId, studentId, activeRemedials, studentName, activityTypes } =
    useLocalSearchParams<{
      subjectId: string;
      studentId: string;
      activeRemedials: string;
      studentName: string;
      activityTypes: string;
    }>();
  const parsedActiveRemedials: Remedial[] = JSON.parse(activeRemedials);
  const parsedActivityTypes: string[] = JSON.parse(activityTypes);
  const [remedialType, setRemedialType] = useState<string>(
    parsedActivityTypes[0],
  );
  const [filteredRemedial, setFilteredRemedial] = useState<Remedial[]>([]);
  const [remedialActivity, setRemedialActivity] = useState<string>("");
  const [mode, setMode] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [errorInputs, setErrorInputs] = useState<Error[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreate = async () => {
    const errors: Error[] = [];

    if (!mode.trim().length) {
      errors.push({ id: "mode" });
    }
    if (mode === "faceToFace" && !room.trim().length) {
      errors.push({ id: "room" });
    }
    if (mode === "online" && !meetingLink.trim().length) {
      errors.push({ id: "meetingLink" });
    }
    if (!date) {
      errors.push({ id: "date", type: "empty" });
    }
    if (!startTime) {
      errors.push({ id: "startTime", type: "empty" });
    } else {
      const now = new Date();
      const selectedDate = date ?? now;

      const sameDay = selectedDate.toDateString() === now.toDateString();

      if (sameDay && startTime < now) {
        errors.push({ id: "startTime", type: "invalid" });
      }

      const startHour = startTime.getHours();
      if (startHour < 7 || startHour >= 17) {
        errors.push({ id: "startTime", type: "outOfRange" });
      }
    }

    if (!endTime) {
      errors.push({ id: "endTime", type: "empty" });
    } else {
      const now = new Date();
      const selectedDate = date ?? now;

      const sameDay = selectedDate.toDateString() === now.toDateString();

      if (sameDay && endTime < now) {
        errors.push({ id: "endTime", type: "invalid" });
      }

      const endHour = endTime.getHours();
      if (endHour < 7 || endHour >= 17) {
        errors.push({ id: "endTime", type: "outOfRange" });
      }

      if (startTime && endTime <= startTime) {
        errors.push({ id: "endTime", type: "lessThanStart" });
      }

      if (startTime && endTime > startTime) {
        const diffMs = endTime.getTime() - startTime.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        if (diffMinutes < 15) {
          errors.push({ id: "endTime", type: "tooShort" });
        } else if (diffMinutes > 30) {
          errors.push({ id: "endTime", type: "tooLong" });
        }
      }
    }
    if (!message.trim().length) {
      errors.push({ id: "message" });
    }

    if (errors.length > 0) {
      setErrorInputs(errors);
      return;
    }

    setErrorInputs([]);
    if (!date || !startTime || !endTime) return;

    setIsCreating(true);
    const res = await CreateRemedialSchedule(
      studentId,
      subjectId,
      remedialActivity,
      date,
      startTime,
      endTime,
      message,
      remedialType,
      mode,
      room,
      meetingLink,
    );

    setIsCreating(false);

    if (res.success) {
      Alert.alert(
        "Success",
        res.message,
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
              router.back();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert("Error", res.message);
    }
  };

  useEffect(() => {
    const getTeacherName = async () => {
      const name = await SecureStore.getItemAsync("name");
      setTeacherName(name);
    };

    getTeacherName();

    const filtered = parsedActiveRemedials.filter(
      (remedial) => remedial.activityType === remedialType,
    );
    setFilteredRemedial(filtered);
    if (filtered.length > 0) {
      setRemedialActivity(filtered[0].remedialId);
    } else {
      setRemedialActivity("");
    }
  }, [remedialType]);

  useEffect(() => {
    setMessage(
      `Hi ${studentName},\n` +
        "\n" +
        "You have been scheduled for a remedial session to help you strengthen your skills in [Remedial Activity]. Please make sure to attend at the scheduled time below:\n" +
        "\n" +
        `🗓 Date: ${date ? date.toDateString() : ""}  \n` +
        `⏰ Time: ${
          startTime
            ? startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
        } — ${
          endTime
            ? endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""
        }  \n` +
        `📍 ${mode === "faceToFace" ? `Location: ${room}` : `Location: Online`}  \n` +
        `🔗 Link: ${meetingLink}  \n` +
        `💡 Type: ${remedialType}  \n` +
        `👤 Teacher: ${teacherName ? teacherName : ""}\n` +
        "\n" +
        "Please come prepared and bring any materials you might need.\n" +
        "\n" +
        "If you have any questions or concerns, feel free to reach out to your teacher in advance.\n" +
        "\n" +
        "Let’s work together to help you master this activity!\n" +
        "\n" +
        "Best regards,  \n" +
        "Philippine institute for the Deaf  \n",
    );
  }, [
    remedialActivity,
    studentName,
    date,
    startTime,
    endTime,
    mode,
    room,
    meetingLink,
    remedialType,
    teacherName,
  ]);

  return (
    <ScrollView style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={[globalStyles.cardContainer1, { rowGap: 20 }]}>
        <View style={{ rowGap: 5 }}>
          <Text style={globalStyles.text1}>Remedial Type</Text>
          <View style={globalStyles.dropdownStyle}>
            <Picker
              selectedValue={remedialType}
              onValueChange={(itemValue) => setRemedialType(itemValue)}
              mode={"dropdown"}
            >
              {parsedActivityTypes.map((item, index) => (
                <Picker.Item
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
                  value={item}
                  key={index}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{ rowGap: 5 }}>
          <Text style={globalStyles.text1}>Remedial Activity</Text>
          <View style={globalStyles.dropdownStyle}>
            <Picker
              selectedValue={remedialActivity}
              onValueChange={(itemValue) => setRemedialActivity(itemValue)}
              mode={"dropdown"}
            >
              {filteredRemedial.length ? (
                filteredRemedial.map((item) => (
                  <Picker.Item
                    key={item.remedialId}
                    label={item.activity_title}
                    value={item.remedialId}
                  />
                ))
              ) : (
                <Picker.Item
                  label="No Available Activity"
                  value=""
                  color="#999"
                  enabled={false}
                />
              )}
            </Picker>
          </View>
        </View>
        <View style={{ rowGap: 5 }}>
          <Text style={globalStyles.text1}>Remedial Mode</Text>
          {errorInputs.some((error) => error.id === "mode") && (
            <Text style={globalStyles.errorText}>This field is required!</Text>
          )}
          <View
            style={[
              globalStyles.dropdownStyle,
              errorInputs.some((error) => error.id === "mode") && {
                borderColor: "red",
              },
            ]}
          >
            <Picker
              selectedValue={mode}
              onValueChange={(itemValue) => setMode(itemValue)}
              mode="dropdown"
            >
              <Picker.Item
                label="Select mode..."
                value=""
                color="#999"
                enabled={!mode.length}
              />
              <Picker.Item label="Face to Face" value="faceToFace" />
              <Picker.Item label="Online" value="online" />
            </Picker>
          </View>
        </View>
        {mode && (
          <View>
            <Text style={globalStyles.text1}>
              {mode === "faceToFace" ? "Room" : "Meeting Link"}
            </Text>
            <View>
              {errorInputs.some((error) => error.id === "room") && (
                <Text style={globalStyles.errorText}>
                  This field is required!
                </Text>
              )}
              <View
                style={[
                  {
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#82828282",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  },
                  errorInputs.some(
                    (error) =>
                      error.id === "room" || error.id === "meetingLink",
                  ) && { borderColor: "red" },
                ]}
              >
                {mode === "faceToFace" && (
                  <TextInput
                    value={room}
                    onChangeText={(value) => setRoom(value)}
                    placeholder="e.g. Room 3, Library"
                  />
                )}

                {mode === "online" && (
                  <TextInput
                    value={meetingLink}
                    onChangeText={(value) => setMeetingLink(value)}
                    placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  />
                )}
              </View>
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.text1}>Date</Text>
          <View style={{ width: "70%" }}>
            {errorInputs.some((error) => error.id === "date") && (
              <Text style={globalStyles.errorText}>
                This field is required!
              </Text>
            )}
            <View
              style={[
                globalStyles.cardContainer,
                errorInputs.some((error) => error.id === "date") && {
                  borderColor: "red",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text style={{ color: date ? "#000" : "#aaa" }}>
                  {date ? date.toDateString() : "Select date"}
                </Text>
                <MaterialIcons name="date-range" size={22} color="#ffbf18" />
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode={"date"}
                  display="default"
                  minimumDate={new Date()}
                  onChange={(_, selected) => {
                    setShowPicker(false);
                    if (selected) setDate(selected);
                  }}
                />
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.text1}>Start</Text>
          <View style={{ width: "70%" }}>
            {errorInputs.some((error) => error.id === "startTime") && (
              <Text style={globalStyles.errorText}>
                {(() => {
                  const error = errorInputs.find(
                    (error) => error.id === "startTime",
                  );
                  if (!error) return "";
                  if (error.type === "empty") return "This field is required!";
                  if (error.type === "invalid")
                    return "The selected time is in the past. Please choose a future time.";
                  if (error.type === "outOfRange")
                    return "Time must be between 7:00 AM and 5:00 PM.";
                  return "";
                })()}
              </Text>
            )}
            <Time
              time={startTime}
              setTime={setStartTime}
              hasError={errorInputs.some((error) => error.id === "startTime")}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={globalStyles.text1}>End</Text>
          <View style={{ width: "70%" }}>
            {errorInputs.some((error) => error.id === "endTime") && (
              <Text style={globalStyles.errorText}>
                {(() => {
                  const error = errorInputs.find(
                    (error) => error.id === "endTime",
                  );
                  if (!error) return "";
                  if (error.type === "empty") return "This field is required!";
                  if (error.type === "invalid")
                    return "The selected time is in the past. Please choose a future time.";
                  if (error.type === "lessThanStart")
                    return "The end time must be later than the start time.";
                  if (error.type === "tooShort")
                    return "The session must be at least 15 minutes long.";
                  if (error.type === "tooLong")
                    return "The session must not exceed 30 minutes.";
                  if (error.type === "outOfRange")
                    return "Time must be between 7:00 AM and 5:00 PM.";
                  return "";
                })()}
              </Text>
            )}
            <Time
              time={endTime}
              setTime={setEndTime}
              hasError={errorInputs.some((error) => error.id === "endTime")}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[globalStyles.inactivityButton, { width: "48%" }]}
            onPress={() => router.back()}
          >
            <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.submitButton, { width: "48%" }]}
            onPress={handleCreate}
            disabled={isCreating}
          >
            <Text style={globalStyles.submitButtonText}>
              {isCreating ? "Creating...." : "Create"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          globalStyles.cardContainer1,
          { marginTop: 0, marginBottom: 50 },
        ]}
      >
        <Text style={globalStyles.text1}>Message: </Text>
        {errorInputs.some((error) => error.id === "message") && (
          <Text style={globalStyles.errorText}>This field is required!</Text>
        )}
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={30}
          style={[
            {
              borderWidth: 1,
              borderColor: "#82828257",
              borderRadius: 10,
              padding: 10,
              textAlignVertical: "top",
            },
            errorInputs.some((error) => error.id === "message") && {
              borderColor: "red",
            },
          ]}
        />
      </View>
    </ScrollView>
  );
};

export default AddRemedialSchedule;
