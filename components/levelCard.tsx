import { FontAwesome } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface levelCardProps {
	img: any;
	actName: string;
	actDesc: string;
}
const getImageStyle = (actName: string) => {
	if (actName === "Phrase Flashcards") {
		return { width: 70, height: 50, margin: 20, left: 40, top: 10 };
	}
	return {};
};
const getNameStyle = (actName: string) => {
	if (actName === "Phrase Flashcards") {
		return { fontSize: 16, fontWeight: "500", left: 10, top: 10 };
	}
	return {};
};
const levelCard = ({ img, actName, actDesc }: levelCardProps) => (
	<View style={styles.header}>
		<FontAwesome
			name="circle"
			size={40}
			color="#FFCEA1"
			style={styles.circle}
		/>
		<FontAwesome
			name="circle"
			size={40}
			color="#ffe9ae"
			style={styles.circle2}
		/>
		<Image source={img} style={[styles.img, getImageStyle(actName)]} />;
		<View style={getNameStyle(actName)}>
			<Text style={[styles.practice]}>PRACTICE WITH</Text>
			<Text style={[styles.actName]}>{actName}</Text>
		</View>
		<Text style={styles.actDesc}>{actDesc}</Text>
	</View>
);

const styles = StyleSheet.create({
	header: {
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 20,
		margin: 20,
		overflow: "hidden",
		position: "relative",
		marginBottom: 0,
	},

	img: { width: 50, height: 60, margin: 20, left: 50, top: 10 },
	actName: { fontSize: 16, fontWeight: 500, left: 130, top: -60 },
	actDesc: {
		textAlign: "justify",
		fontSize: 12,
		margin: 20,
		marginTop: -30,
		fontWeight: 300,
	},
	practice: {
		fontSize: 12,
		fontWeight: 400,
		left: 130,
		top: -62,
	},
	circle: {
		left: 280,
		top: 20,
	},
	circle2: {
		left: 30,
		top: -50,
		marginBottom: -80,
	},
});

export default memo(levelCard);
