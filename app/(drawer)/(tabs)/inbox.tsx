import LoadingCard from "@/components/loadingCard";
import MessageCard from "@/components/MessageCard";
import NoInbox from "@/components/noData/noInbox";
import { getSmartFormattedDate } from "@/utils/DateFormat";
import { getInboxMessages, getSentMessages } from "@/utils/messages";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import messaging from "@react-native-firebase/messaging";
import { useFocusEffect, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
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
		messageType.inbox
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
	const router = useRouter();

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
		}, [])
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
				<LoadingCard></LoadingCard>
			</View>
		);
	}

	return (
		<SafeAreaView style={[styles.container]}>
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					router.push("/(notification)/AddMessage");
					// console.log("add todo");
				}}
			>
				<View
					style={{
						top: 20,
						alignSelf: "center",
						flexDirection: "row",
					}}
				>
					<Ionicons name="add-circle" size={20} color="#ffbf18" />
					<Text style={styles.addText}>Add Message</Text>
				</View>
			</TouchableOpacity>
			<View style={styles.messageContainer}>
				<Text style={styles.chat}>Messages</Text>
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

			{(selectedType === "Inbox" && inboxMessage.length === 0) ||
			(selectedType === "Sent" && sentMessage.length === 0) ? (
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<NoInbox />
				</View>
			) : (
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
			)}

			{/* <TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					router.push("/(notification)/AddMessage");
				}}
			>
				<MaterialIcon name="add" size={30} color="#fff" />
			</TouchableOpacity> */}
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
		marginVertical: 85,
		// paddingBottom: 100,
	},
	chat: {
		fontSize: 16,
		fontWeight: "500",
		margin: 10,
		left: -10,
		top: 0,
	},
	pickerWrapper: {
		width: 80,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	modalPickerButton: {
		alignItems: "center",
		left: -5,
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
		top: 190,
		right: 25,
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
		top: -80,
	},
	addButton: {
		position: "absolute",
		left: -8,
		width: "88%",
		backgroundColor: "#fcefcc",
		borderColor: "#ffbf18",
		borderWidth: 2,
		borderRadius: 20,
		borderStyle: "dashed",
		margin: 30,
		top: -10,
		bottom: 0,
		height: 60,
	},
	addText: {
		color: "#ffbf18",
		fontWeight: 500,
		marginHorizontal: 10,
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
