import MessageCard from "@/components/MessageCard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo, useState } from "react";
import {
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

enum messageType {
	inbox = "Inbox",
	unread = "Unread",
	sent = "Sent",
	archived = "Archived",
}

const data = [
	{
		id: 1,
		name: "Ava Arce",
		date: new Date(),
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...Lorem ipsum dolor sit amet consectetur adipisicing elit...Lorem ipsum dolor sit amet consectetur adipisicing elit...Lorem ipsum dolor sit amet consectetur adipisicing elit...Lorem ipsum dolor sit amet consectetur adipisicing elit...",
		messageType: "inbox",
	},
	{
		id: 2,
		name: "Ava Arce",
		date: new Date(),
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
		messageType: "unread",
	},
	{
		id: 3,
		name: "Ava Arce",
		date: new Date(),
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
		messageType: "sent",
	},
	{
		id: 4,
		name: "Ava Arce",
		date: new Date(),
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
		messageType: "archived",
	},
	{
		id: 5,
		name: "Ava Arce",
		date: new Date(),
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
		messageType: "archived",
	},
	{
		id: 6,
		name: "Ava Arce",
		date: new Date(),
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
		messageType: "unread",
	},
];

const Inbox = () => {
	const [selectedType, setSelectedType] = useState<messageType>(
		messageType.inbox
	);
	const [modalVisible, setModalVisible] = useState(false);

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
				{data
					.filter(
						(msg) =>
							msg.messageType.toLowerCase() === selectedType.toLowerCase()
					)
					.map((msg) => (
						<MessageCard
							key={msg.id}
							name={msg.name}
							date={msg.date}
							desc={msg.desc}
							type={msg.messageType}
							time={msg.date.toLocaleDateString()}
						/>
					))}
			</ScrollView>

			<TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					// router.push("addMessage")
					console.log("add message pressed");
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
});

export default memo(Inbox);
