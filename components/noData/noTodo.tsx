import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const noTodo = () => {
	return (
		<View>
			<Image
				source={require("@/assets/load/notodo.png")}
				resizeMode="cover"
				style={styles.image}
			/>
			<Text style={styles.line1}>No Task for Now</Text>
			<Text style={styles.line2}>
				You're all set. New tasks will appear {"\n"} here when assigned.
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
		top: 90,
	},
	line1: {
		// left: 5,
		fontSize: 20,
		fontWeight: 500,
		textAlign: "center",
		top: 50,
	},
	line2: {
		fontSize: 14,
		fontWeight: 300,
		textAlign: "center",
		top: 70,
		lineHeight: 20,
	},
});

export default memo(noTodo);
