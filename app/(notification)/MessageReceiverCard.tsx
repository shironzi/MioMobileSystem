import { Text, View } from "react-native";

const MessageSenderCard = ({ message }: { message: string }) => {
  return (
    <View
      style={{
        backgroundColor: "#1F1F1F",
        paddingVertical: 10,
        paddingHorizontal: 20,
        maxWidth: "75%",
        borderRadius: 12.5,
        borderBottomLeftRadius: 0,
      }}
    >
      <Text style={{ color: "#fff", textAlign: "left", flexWrap: "wrap" }}>
        {message}
      </Text>
    </View>
  );
};

export default MessageSenderCard;
