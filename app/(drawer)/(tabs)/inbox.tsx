import { ScrollView, View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { memo, useState } from "react";
import MessageCard from "@/components/MessageCard";

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
});

export default memo(Inbox);
