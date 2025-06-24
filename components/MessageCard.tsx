import globalStyles from "@/styles/globalStyles";
import { router } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MessageCard = (props: {
	name: string;
	date: string;
	desc: string;
	thread: string;
	selectedType: string;
}) => {
	return (
		<View style={[globalStyles.container, styles.cardContainer]}>
			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: "/(notification)/messageDetails",
						params: {
							thread: props.thread,
							name: props.name,
							selectedType: props.selectedType,
						},
					});
				}}
			>
				<View style={styles.innerContainer}>
					<View style={styles.row}>
						<View style={styles.imageWrapper}>
							<Image
								source={require("@/assets/images/default_profile.png")}
								style={styles.profileImage}
								resizeMode="contain"
							/>
						</View>
						<View style={styles.messageContent}>
							<View style={styles.nameRow}>
								<Text style={styles.nameText}>{props.name}</Text>
								<Text
									style={{
										// fontWeight: 500,
										left: -10,
										fontSize: 14,
										color: "#aaa",
									}}
								>
									{props.date}
								</Text>
							</View>
							<Text style={styles.descText}>
								{props.desc.length > 100
									? props.desc.substring(0, 47) + "..."
									: props.desc}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		// width: "90%",
		marginHorizontal: 20,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 20,
		marginBottom: 10,
	},
	innerContainer: {
		backgroundColor: "#fff",
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		columnGap: 20,
	},
	imageWrapper: {
		borderWidth: 1,
		padding: 2.5,
		borderRadius: 50,
		left: 10,
	},
	profileImage: {
		width: 40,
		height: 40,
	},
	messageContent: {
		marginVertical: -10,
		left: 5,
	},
	nameRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: "auto",
		// left: 10,
	},
	nameText: {
		fontSize: 16,
		fontWeight: 500,
	},
	descText: {
		fontSize: 14,
		fontWeight: 300,
		marginTop: 5,
		height: 30,
		width: 270,
	},
});

export default memo(MessageCard);
