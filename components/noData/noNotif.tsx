import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const noNotif = () => {
	return (
		<View>
			<Image
				source={require("@/assets/load/nonotification.png")}
				resizeMode="cover"
				style={styles.image}
			/>
			<Text style={styles.line1}>You're All Caught Up</Text>
			<Text style={styles.line2}>
				You have no new notifications {"\n"}at the moment.
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
		top: -50,
	},
	line1: {
		// left: 5,
		fontSize: 20,
		fontWeight: 500,
		textAlign: "center",
		top: -80,
	},
	line2: {
		fontSize: 14,
		fontWeight: 300,
		textAlign: "center",
		top: -60,
		lineHeight: 20,
	},
});

export default memo(noNotif);
