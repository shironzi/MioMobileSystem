import MessageCard from "@/components/MessageCard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getInboxMessages, getSentMessages } from "@/utils/messages";
import { getSmartFormattedDate } from "@/utils/DateFormat";
import { router, useFocusEffect } from "expo-router";
import messaging from "@react-native-firebase/messaging";

enum messageType {
  inbox = "Inbox",
  sent = "Sent",
}

interface Message {
  thread: string;
  last_message: string;
  timestamp: string;
  name: string;
}

const Inbox = () => {
  const [selectedType, setSelectedType] = useState<messageType>(
    messageType.inbox,
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [inboxMessage, setInboxMessage] = useState<Message[]>([]);
  const [sentMessage, setSentMessage] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const [inbox, sent] = await Promise.all([
        getInboxMessages(),
        getSentMessages(),
      ]);
      setInboxMessage(inbox.messages);
      setSentMessage(sent.messages);
      console.log("Initial or updated messages fetched.");
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchOnFocus = async () => {
        if (isActive) {
          await fetchMessages();
          setLoading(false);
        }
      };

      fetchOnFocus();

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        const type = remoteMessage.data?.type;
        if (type === "message") {
          console.log("New message notification received. Refetching...");
          await fetchMessages();
        }
      });

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, []),
  );

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
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.messageContainer}>
        <Text style={styles.chat}>Chats</Text>
        <View style={styles.pickerWrapper}>
          <TouchableOpacity
            style={styles.modalPickerButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.modalPickerText}>{selectedType}</Text>
            <MaterialIcon
              style={{ left: 30, top: -22, marginRight: -10 }}
              name={modalVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#ffbf18"
            />
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <FlatList
                  data={Object.values(messageType)}
                  keyExtractor={(item) => item}
                  renderItem={({ item, index }) => (
                    <>
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedType(item as messageType);
                          setModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            item === selectedType &&
                              styles.selectedModalItemText,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                      {index < Object.values(messageType).length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </>
                  )}
                />
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>

      <ScrollView style={styles.messageList}>
        {selectedType === "Inbox" &&
          inboxMessage.map((msg, idx) => (
            <MessageCard
              key={idx}
              name={msg.name}
              date={getSmartFormattedDate(msg.timestamp)}
              desc={msg.last_message}
              thread={msg.thread}
              selectedType={selectedType}
            />
          ))}

        {selectedType === "Sent" &&
          sentMessage.map((msg, idx) => (
            <MessageCard
              key={idx}
              name={msg.name}
              date={getSmartFormattedDate(msg.timestamp)}
              desc={msg.last_message}
              thread={msg.thread}
              selectedType={selectedType}
            />
          ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.push("/(notification)/AddMessage");
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginVertical: 5,
  },
  chat: {
    fontSize: 20,
    fontWeight: "500",
    margin: 10,
    left: -20,
  },
  pickerWrapper: {
    width: 80,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalPickerButton: {
    alignItems: "center",
    left: 5,
    top: 13,
  },
  modalPickerText: {
    color: "#ffbf18",
    fontSize: 16,
    marginRight: 4,
    marginLeft: -20,
  },
  modalOverlay: {
    // backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContent: {
    backgroundColor: "#2264dc",
    borderRadius: 10,
    width: 130,
    position: "absolute",
    top: 110,
    right: 10,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalItemText: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  selectedModalItemText: {
    color: "#ffbf18",
    fontWeight: "bold",
  },
  messageList: {
    flex: 1,
    backgroundColor: "#fff",
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
  divider: {
    borderBottomColor: "#ffffff99",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 10,
    marginVertical: 10,
    marginHorizontal: 0,
  },
});

export default memo(Inbox);
