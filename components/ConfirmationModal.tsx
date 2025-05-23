import { MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ConfirmationModal = (props: {
	isVisible: boolean;
	description: string;
	cancelDisplay: string;
	approveDisplay: string;
	handleCancel: () => void;
	handleApprove: () => void;
}) => {
	return (
		<Modal
			visible={props.isVisible}
			transparent
			animationType="fade"
			onRequestClose={() => props.handleCancel}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.container}>
						<View
							style={{ flexDirection: "row", justifyContent: "space-between" }}
						>
							<Text
								style={{
									fontSize: 20,
									color: "#fff",
									margin: 12,
									fontWeight: 500,
									left: 10,
								}}
							>
								Delete
							</Text>
							<TouchableOpacity>
								<MaterialIcons
									onPress={() => props.handleCancel}
									name="close"
									size={20}
									style={{
										color: "#fff",
										margin: 15,
									}}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<Text style={styles.modalText}>{props.description}</Text>
					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.cancelButton]}
							onPress={() => props.handleCancel}
						>
							<Text style={styles.cancelText}>{props.cancelDisplay}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.deleteButton]}
							onPress={props.handleApprove}
						>
							<Text style={styles.deleteText}>{props.approveDisplay}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2264dc",
		width: 315,
		top: -30,
		height: 50,
		left: -30,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 30,
		elevation: 10,
	},
	modalText: {
		fontSize: 16,
		marginBottom: 20,
		textAlign: "center",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cancelButton: {
		borderColor: "#ffbf18",
		borderWidth: 2,
		backgroundColor: "#fff",
		marginRight: 10,
		borderRadius: 50,
		width: "50%",
	},
	deleteButton: {
		width: "50%",
		backgroundColor: "#Ffbf18",
		borderRadius: 50,
		padding: 10,
	},
	cancelText: {
		fontSize: 16,
		color: "#ffbf18",
		fontWeight: 500,
		textAlign: "center",
		padding: 10,
	},
	deleteText: {
		paddingTop: 2,
		fontSize: 16,
		color: "#fff",
		fontWeight: 500,
		textAlign: "center",
	},
});

export default memo(ConfirmationModal);
