import MessageReceiverCard from "@/app/(notification)/MessageReceiverCard";
import MessageSenderCard from "@/app/(notification)/MessageSenderCard";
import LoadingCard from "@/components/loadingCard";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getConversation, replyMessage, sendMessage } from "@/utils/messages";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import messaging from "@react-native-firebase/messaging";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";

type Message = {
  files: string[];
  message: string;
  receiver_id: string;
  sender_id: string;
  timestamp: number;
};

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

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
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<FileInfo[] | null>(null);

  const handleFileUpload = async () => {
    try {
      const mimeTypes = ["image/*, application/*"];
      const res = await DocumentPicker.getDocumentAsync({
        type: mimeTypes,
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const { uri, name, mimeType } = res.assets[0];
        const newFile = { uri, name, mimeType };

        setFile([newFile]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  useHeaderConfig(name ?? "");

  const handleSent = async () => {
    setIsSending(true);
    const res =
      selectedType.toUpperCase() === "sent"
        ? await sendMessage(senderId, messageInput, file)
        : await replyMessage(receiverId, messageInput, messageInput, file);

    if (res.success) {
      setMessageData((prev) => [
        ...prev,
        {
          files: file ? file.map((f) => f.uri) : [],
          message: messageInput,
          receiver_id: receiverId,
          sender_id: senderId,
          timestamp: Math.floor(Date.now() / 1000),
        },
      ]);
      setMessageInput("");
      setFile(null);
    }

    setIsSending(false);
  };

  const fetchConversation = async () => {
    const res = await getConversation(thread);
    setMessageData(res.conversation);
    setSenderId(res.sender);
    setReceiverId(res.receiver);
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

    setLoading(false);

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
      style={{ height: "100%", flex: 1, backgroundColor: "#fff" }}
      behavior={"padding"}
      keyboardVerticalOffset={keyboardVisible ? 0 : 100}
    >
      <View style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
        <ScrollView
          style={{ padding: 16, height: "100%" }}
          contentContainerStyle={{ paddingBottom: 30 }}
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
                <MessageSenderCard message={msg.message} files={msg.files} />
              ) : (
                <MessageReceiverCard message={msg.message} files={msg.files} />
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
              width: "100%",
              columnGap: 15,
              paddingTop: 10,
              borderTopWidth: 1,
              borderColor: "#ddd",
            },
            !keyboardVisible && { marginBottom: 45 },
          ]}
        >
          {file ? (
            <View style={{ width: "80%", flexDirection: "row", columnGap: 20 }}>
              <Text style={{ flexWrap: "wrap" }}>{file[0]?.name}</Text>
              <AntDesign name="close" size={24} color="black" />
            </View>
          ) : (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#fff",
                width: "80%",
              }}
              value={messageInput}
              onChangeText={(value: string) => setMessageInput(value)}
              placeholder="Type a message..."
            />
          )}
          <TouchableOpacity onPress={handleFileUpload}>
            <AntDesign name="addfile" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSent} disabled={isSending}>
            <MaterialIcons name="send" size={24} color="#FFBF18" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageDetails;
