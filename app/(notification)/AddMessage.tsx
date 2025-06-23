import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
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
import useHeaderConfig from "@/utils/HeaderConfig";
import {
  getMessageSubjects,
  getSubjectStudents,
  getSubjectTeachers,
  sendMessage,
} from "@/utils/messages";
import { router } from "expo-router";
import FileUpload from "@/components/FileUpload";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AddMessage = () => {
  useHeaderConfig("Message");

  const [receiver, setReceiver] = useState();
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<
    { subject_id: string; user_id: string; name: string }[]
  >([]);
  const [subjects, setSubjects] = useState<
    {
      subject_id: string;
      title: string;
    }[]
  >([]);
  const [selectedSubject, setSelectedSubject] = useState<string>();

  const [files, setFiles] = useState<FileInfo[]>([]);

  const handleSendMessage = async () => {
    if (!receiver) return;

    const res = await sendMessage(receiver, message, files);
    console.log(res);

    if (res.success) {
      Keyboard.dismiss;
      router.replace({
        pathname: "/(notification)/messageDetails",
        params: { thread: res.thread, name: res.name, selectedType: "Sent" },
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      const roleValue = await SecureStore.getItemAsync("role");
      setRole(roleValue ?? "");

      if (roleValue === "student" || roleValue === "parent") {
        const res = await getSubjectTeachers();
        if (res.success) {
          setUsers(res.users);
          setReceiver(res.users[0].user_id);
        }
      } else if (roleValue === "teacher") {
        const res = await getMessageSubjects();
        if (res.success) {
          setSubjects(res.subjects);
          setSelectedSubject(subjects[0].subject_id);
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedSubject) return;

      const res = await getSubjectStudents(selectedSubject);
      setUsers(res.users);
    };
    fetchUsers();
  }, [selectedSubject]);

  return (
    <KeyboardAvoidingView
      style={{ height: "100%", backgroundColor: "#fff" }}
      behavior={"padding"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.card}>
            {role === "teacher" && (
              <View>
                <Text style={styles.label}>Subject</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={receiver}
                    onValueChange={(value) => setSelectedSubject(value)}
                    style={styles.picker}
                    mode={"dropdown"}
                  >
                    {subjects?.map((subject) => (
                      <Picker.Item
                        key={subject.subject_id}
                        label={subject.title}
                        value={subject.subject_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            <Text style={styles.label}>To</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={receiver}
                onValueChange={(value) => setReceiver(value)}
                style={styles.picker}
                mode={"dropdown"}
              >
                {users.map((teacher) => (
                  <Picker.Item
                    key={teacher.user_id}
                    label={teacher.name}
                    value={teacher.user_id}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Message</Text>
            <TextInput
              placeholder="Input Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            />

            <View
              style={{ width: "90%", marginHorizontal: "auto", marginTop: 10 }}
            >
              <FileUpload handleFiles={(file: FileInfo[]) => setFiles(file)} />
            </View>
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
