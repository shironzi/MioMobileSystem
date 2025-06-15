import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getSubjectTeachers, sendMessage } from "@/utils/messages";

const AddMessage = () => {
  useHeaderConfig("Message");
  const router = useRouter();

  const [receiver, setReceiver] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState<
    { subject_id: string; teacher_id: string; name: string }[]
  >([]);

  const handleSendMessage = async () => {
    const res = await sendMessage(receiver, title, message);

    console.log(res);
  };

  useEffect(() => {
    const fetchSubjectTeachers = async () => {
      const res = await getSubjectTeachers();
      if (res.success) {
        setTeachers(res.teachers);
      }
    };
    fetchSubjectTeachers();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ height: "100%" }}
      behavior={"padding"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={receiver}
                onValueChange={(value) => setReceiver(value)}
                style={styles.picker}
                mode={"dropdown"}
              >
                {teachers.map((teacher) => (
                  <Picker.Item
                    key={teacher.teacher_id}
                    label={teacher.name}
                    value={teacher.teacher_id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="Input Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              placeholder="Input Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3ff",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ffbf18",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelText: {
    color: "#ffbf18",
    fontWeight: "bold",
  },
  sendButton: {
    flex: 1,
    backgroundColor: "#ffbf18",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddMessage;
