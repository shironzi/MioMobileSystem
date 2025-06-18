import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const noInbox = () => {
	return (
		<View>
			<Image
				source={require("@/assets/load/nomessage.png")}
				resizeMode="cover"
				style={styles.image}
			/>
			<Text style={styles.line1}>Inbox is Clear</Text>
			<Text style={styles.line2}>
				You have no messages right now. {"\n"}Check back later.{" "}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 300,
		height: 300,
		margin: 20,
		alignSelf: "center",
		top: -120,
	},
	line1: {
		// left: 5,
		fontSize: 20,
		fontWeight: 500,
		textAlign: "center",
		top: -150,
	},
	line2: {
		fontSize: 14,
		fontWeight: 300,
		textAlign: "center",
		top: -130,
		lineHeight: 20,
	},
});

export default memo(noInbox);
