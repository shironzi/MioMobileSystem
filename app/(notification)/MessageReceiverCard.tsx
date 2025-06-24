import { Text, View } from "react-native";

const MessageSenderCard = ({ message }: { message: string }) => {
	return (
		<View
			style={{
				backgroundColor: "#ddd",
				paddingVertical: 10,
				paddingHorizontal: 20,
				maxWidth: "75%",
				borderRadius: 12.5,
				borderBottomLeftRadius: 0,
			}}
		>
			<Text style={{ color: "#000", textAlign: "left", flexWrap: "wrap" }}>
				{message}
			</Text>
		</View>
	);
};

export default MessageSenderCard;
