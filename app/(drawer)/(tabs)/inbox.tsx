import { ScrollView, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { memo, useState } from "react";
import MessageCard from "@/components/MessageCard";

enum messageType {
  inbox = "inbox",
  unread = "unread",
  sent = "sent",
  archived = "archived",
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
    <View style={styles.container}>
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

      <ScrollView>
        {data?.map((data) =>
          data.messageType === selectedType ? (
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
  container: {
    flex: 1,
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
