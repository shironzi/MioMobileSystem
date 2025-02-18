import { ScrollView, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { memo, useState } from "react";
import MessageCard from "@/components/MessageCard";

enum messageType {
  inbox = "Inbox",
  unread = "Unread",
  sent = "Sent",
  archived = "Archived",
}

const Inbox = () => {
  const [selectedType, setSelectedType] = useState<messageType>(messageType.inbox);

  return (
    <View style={styles.container}>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue: string) => setSelectedType(itemValue as messageType)}
          style={styles.picker}
          mode="dropdown"
        >
          {Object.values(messageType).map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>

      {/* Message List */}
      <ScrollView>
        <MessageCard
          title="Message"
          date={new Date(Date.now())}
          time="10:00 AM"
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
          type="message"
        />
        <MessageCard
          title="Message"
          date={new Date("2025-02-14")}
          time="11:00 AM"
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
          type="message"
        />
        <MessageCard
          title="Message"
          date={new Date("2025-02-13")}
          time="12:00 PM"
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
          type="message"
        />
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
    marginVertical: 10,
    backgroundColor: "black",
  },
});

export default memo(Inbox);
