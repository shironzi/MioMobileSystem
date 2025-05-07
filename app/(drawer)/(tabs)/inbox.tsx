import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { memo, useState } from "react";
import MessageCard from "@/components/MessageCard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

enum messageType {
  inbox = "Inbox",
  unread = "Unread",
  sent = "Sent",
  archived = "Archived",
}

const data = [
  {
    id: 1,
    title: "Message",
    date: new Date(Date.now()),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "inbox",
  },
  {
    id: 2,
    title: "Message",
    date: new Date(Date.now()),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "inbox",
  },
  {
    id: 3,
    title: "Message",
    date: new Date(Date.now()),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "inbox",
  },
  {
    id: 3,
    title: "Message",
    date: new Date(Date.now()),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "unread",
  },
  {
    id: 3,
    title: "Message",
    date: new Date(Date.now()),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "sent",
  },
  {
    id: 3,
    title: "Message",
    date: new Date(Date.now()),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "archived",
  },
];

const Inbox = () => {
  const [selectedType, setSelectedType] = useState<messageType>(
    messageType.inbox
  );
  const router = useRouter();

  return (
    <View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageCateg}>{selectedType}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue: string) =>
              setSelectedType(itemValue as messageType)
            }
            style={styles.picker}
            mode="dropdown"
          >
            {Object.values(messageType).map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView>
        {data?.map((data) =>
          data.messageType.toLocaleLowerCase() ===
          selectedType.toLocaleLowerCase() ? (
            <MessageCard
              key={data.id}
              title={data.title}
              date={data.date}
              desc={data.desc}
              type={data.messageType}
              time={data.date.toLocaleTimeString()}
            />
          ) : null
        )}
      </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("addMessage")}
        >
          <MaterialIcon name="add" size={30} color="#fff" />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 25,
  },
  messageCateg: {
    fontSize: 20,
  },
  pickerWrapper: {
    alignSelf: "flex-end",
    width: 150,
  },
  picker: {
    width: "100%",
    color: "orange",
  },
  messageCard: {
    backgroundColor: "black",
  },
  addButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -320,
    right: 20,
    elevation: 5,
  },

});

export default memo(Inbox);
