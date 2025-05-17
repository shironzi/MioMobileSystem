import { ScrollView, View, StyleSheet, Text, TouchableOpacity, SafeAreaView} from "react-native";
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
    date: new Date(),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "inbox",
  },
  {
    id: 2,
    title: "Message",
    date: new Date(),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "unread",
  },
  {
    id: 3,
    title: "Message",
    date: new Date(),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "sent",
  },
  {
    id: 4,
    title: "Message",
    date: new Date(),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "archived",
  },
  {
    id: 5,
    title: "Message",
    date: new Date(),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "archived",
  },
  {
    id: 6,
    title: "Message",
    date: new Date(),
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    messageType: "unread",
  },
];

const Inbox = () => {
  const [selectedType, setSelectedType] = useState<messageType>(
    messageType.inbox
  );
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        {/* <Text style={styles.messageCateg}>{selectedType}</Text> */}
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

      <ScrollView style={styles.messageList}>
        {data
          .filter((msg) => msg.messageType.toLowerCase() === selectedType.toLowerCase())
          .map((msg) => (
            <MessageCard
              key={msg.id}
              title={msg.title}
              date={msg.date}
              desc={msg.desc}
              type={msg.messageType}
              time={msg.date.toLocaleTimeString()}
            />
          ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // router.push("addMessage")
          console.log("add message pressed")
        }}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#fff",
  },
  messageContainer: {
    // flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginVertical: 5,
    
  },
  messageCateg: {
    fontSize: 20,
    fontWeight: 500,
  },
  pickerWrapper: {
    width: 150,
  },
  picker: {
    width: "100%",
    color: "#ffbf18",
  },
  messageList: {
    flex: 1, 
    backgroundColor:"#fff"
  },
  addButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", 
    bottom: 20, 
    right: 20, 
    elevation: 5,
  },
});

export default memo(Inbox);
