import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getConversation, replyMessage, sendMessage } from "@/utils/messages";
import MessageSenderCard from "@/app/(notification)/MessageSenderCard";
import MessageReceiverCard from "@/app/(notification)/MessageReceiverCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useHeaderConfig from "@/utils/HeaderConfig";
import messaging from "@react-native-firebase/messaging";

type Message = {
  message: string;
  receiver_id: string;
  sender_id: string;
  subject: string;
  timestamp: number;
};

const MessageDetails = () => {
  const { thread, name, selectedType } = useLocalSearchParams<{
    thread: string;
    name: string;
    selectedType: string;
  }>();
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [senderId, setSenderId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [mount, setMount] = useState<boolean>(false);

  useHeaderConfig(name ?? "");

  const handleSent = async () => {
    const res =
      selectedType === "Sent"
        ? await sendMessage(senderId, messageInput, messageInput)
        : await replyMessage(receiverId, messageInput, messageInput);

    console.log(res);
    console.log(receiverId);
    console.log(senderId);

    if (res.success) {
      setMessageData((prev) => [
        ...prev,
        {
          message: messageInput,
          receiver_id: receiverId,
          sender_id: senderId,
          subject: messageInput,
          timestamp: Math.floor(Date.now() / 1000),
        },
      ]);
      setMessageInput("");
    }
  };

  const fetchConversation = async () => {
    try {
      const res = await getConversation(thread);
      setMessageData(res.conversation);
      setSenderId(res.sender);
      setReceiverId(res.receiver);
      console.log("Conversation fetched for thread:", thread);
    } catch (err) {
      console.error("Error fetching conversation:", err);
    }
  };

  useEffect(() => {
    if (!mount) {
      fetchConversation();
      setMount(true);
    }

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const type = remoteMessage.data?.type;
      const incomingThread = remoteMessage.data?.thread_id;

      if (type === "message" && incomingThread === thread) {
        await fetchConversation();
      }
    });

    return () => unsubscribe();
  }, [thread]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ height: "100%" }}
      behavior={"padding"}
      keyboardVerticalOffset={keyboardVisible ? 0 : 100}
    >
      <View style={{ height: "100%", flex: 1 }}>
        <ScrollView
          style={{ padding: 16, height: "90%" }}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          {messageData.map((msg, index) => (
            <View
              key={index}
              style={{
                alignItems:
                  msg.sender_id === senderId ? "flex-end" : "flex-start",
                marginVertical: 6,
              }}
            >
              {msg.sender_id === senderId ? (
                <MessageSenderCard message={msg.message} />
              ) : (
                <MessageReceiverCard message={msg.message} />
              )}
            </View>
          ))}
        </ScrollView>

        <View
          style={[
            {
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              columnGap: 15,
            },
            !keyboardVisible && { marginBottom: 45 },
          ]}
        >
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#fff",
              width: "100%",
            }}
            value={messageInput}
            onChangeText={(value: string) => setMessageInput(value)}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={handleSent}>
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageDetails;
