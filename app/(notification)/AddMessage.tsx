import FileUpload from "@/components/FileUpload";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import {
  getMessagePeoples,
  getMessageSubjects,
  getSubjectTeachers,
  sendMessage,
} from "@/utils/messages";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import LoadingCard from "@/components/loadingCard";

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
  const [users, setUsers] = useState<{ user_id: string; name: string }[]>([]);
  const [parents, setParents] = useState<{ user_id: string; name: string }[]>(
    [],
  );
  const [selectedUser, setSelectedUser] = useState<"student" | "parent">(
    "student",
  );
  const [subjects, setSubjects] = useState<
    {
      subject_id: string;
      title: string;
    }[]
  >([]);
  const [selectedSubject, setSelectedSubject] = useState<string>();
  const [messageError, setMessageError] = useState<boolean>(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [messageSending, setMessageSending] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSendMessage = async () => {
    if (!receiver) return;

    if (!message.trim()) {
      setMessageError(true);
      return;
    }
    setMessageSending(true);

    const res = await sendMessage(receiver, message, files);
    console.log(res);

    if (res.success) {
      Keyboard.dismiss;
      router.replace({
        pathname: "/(notification)/messageDetails",
        params: { thread: res.thread, name: res.name, selectedType: "Sent" },
      });

      setMessageError(false);
    }
    setMessageSending(false);
  };

  useEffect(() => {
    const init = async () => {
      const roleValue = await SecureStore.getItemAsync("role");
      if (role === "student") {
        setSelectedUser("student");
      } else if (role === "parent") {
        setSelectedUser("parent");
      }
      setRole(roleValue ?? "");

      if (roleValue === "student" || roleValue === "parent") {
        const res = await getSubjectTeachers();
        console.log(res);

        if (res.success) {
          setUsers(res.users);
          setReceiver(res.users[0].user_id);
        }
      } else if (roleValue === "teacher") {
        const res = await getMessageSubjects();
        console.log(res);
        if (res.success) {
          setSubjects(res.subjects);
        }
      }

      setLoading(false);
    };

    init();
  }, [role]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedSubject) return;

      const res = await getMessagePeoples(selectedSubject);

      console.log(res);
      if (res.success) {
        const userList = Object.keys(res.students).map((id) => ({
          user_id: id,
          name: res.students[id],
        }));
        setUsers(userList);

        const parentList = Object.keys(res.parents).map((id) => ({
          user_id: id,
          name: res.parents[id],
        }));
        setParents(parentList);
      }
    };
    fetchUsers();
  }, [selectedSubject]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ height: "100%", backgroundColor: "#fff" }}
      behavior={"padding"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            {role === "teacher" && (
              <View>
                <Text style={[globalStyles.textLabel, { marginBottom: 15 }]}>
                  Subject
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={receiver}
                    onValueChange={(value) => setSelectedSubject(value)}
                    style={styles.picker}
                    mode={"dropdown"}
                  >
                    <Picker.Item key="1" label="Select" value="" />
                    {subjects.map((subject) => (
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

            <Text style={[globalStyles.textLabel, { marginVertical: 15 }]}>
              To
            </Text>
            {role === "teacher" && (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedUser}
                  onValueChange={(value) => setSelectedUser(value)}
                  style={styles.picker}
                  mode={"dropdown"}
                >
                  <Picker.Item label="Parent" value={"parent"} />
                  <Picker.Item label="Student" value={"student"} />
                </Picker>
              </View>
            )}
            <View
              style={[
                styles.pickerWrapper,
                role === "teacher" && { marginTop: 15 },
              ]}
            >
              <Picker
                selectedValue={receiver}
                onValueChange={(value) => setReceiver(value)}
                style={styles.picker}
                mode={"dropdown"}
              >
                {selectedUser === "student" ? (
                  users ? (
                    users?.map((user) => (
                      <Picker.Item
                        key={user.user_id}
                        label={user.name}
                        value={user.user_id}
                      />
                    ))
                  ) : (
                    <Picker.Item label={"Select"} value={""} />
                  )
                ) : parents ? (
                  parents?.map((user) => (
                    <Picker.Item
                      key={user.user_id}
                      label={user.name}
                      value={user.user_id}
                    />
                  ))
                ) : (
                  <Picker.Item label={"Select"} value={""} />
                )}
              </Picker>
            </View>
            <Text style={[globalStyles.textLabel, { marginVertical: 15 }]}>
              Message
            </Text>
            {messageError && (
              <Text style={globalStyles.errorText}>
                This field is required!
              </Text>
            )}
            <TextInput
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline={true}
              style={[
                styles.input,
                { height: 200, textAlignVertical: "top" },
                messageError
                  ? { borderColor: "#DB4141" }
                  : { borderColor: "#DDD" },
              ]}
            />

            <View
              style={{ width: "90%", marginHorizontal: "auto", marginTop: 10 }}
            >
              <FileUpload handleFiles={(file: FileInfo[]) => setFiles(file)} />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                bottom: 0,
                marginTop: -70,
              }}
            >
              <TouchableOpacity
                style={[globalStyles.inactivityButton, { width: "48%" }]}
                onPress={() => router.back()}
              >
                <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.submitButton, { width: "48%" }]}
                onPress={handleSendMessage}
                disabled={messageSending}
              >
                <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
                  {messageSending ? "Sending..." : "Send"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#00000024",
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    // height: 100,
    // paddingVertical:
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
