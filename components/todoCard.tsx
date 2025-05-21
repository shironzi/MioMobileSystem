import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TodoCardProps = {
	sub: string;
	title: string;
	date: string;
	time: string;
	type: string;
};

const todoCard: React.FC<TodoCardProps> = (props) => {
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "2-digit",
			year: "numeric",
		});
	};
	return (
		<TouchableOpacity activeOpacity={0.9}>
			<View style={styles.card}>
				<View style={styles.cardImage}>
					<MaterialIcons name="campaign" size={30} color="#FFBF18" />
				</View>
				<View style={styles.cardContent}>
					<Text style={styles.sub}>{props.sub}</Text>
					<Text style={styles.title}>{props.title}</Text>
					<View style={styles.row}>
						<Text style={styles.date}>{formatDate(props.date)}</Text>
						<Text style={styles.time}> | {props.time}</Text>
					</View>
					<Text style={styles.type}>{props.type}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		top: -15,
		// left: 10,
		// marginHorizontal: -20,
		width: 600,
		backgroundColor: "#fff",
		// borderRadius: 10,
		// elevation: 3,
		padding: 10,
		flexDirection: "row",
		columnGap: 5,
		// borderWidth: 1,
		borderBottomColor: "#000",
		marginBottom: -15,
		// alignItems: "center",
	},
	cardContent: {
		flexDirection: "column",
		justifyContent: "center",
	},
	cardImage: {
		width: 50,
		// marginVertical: "auto",
		left: 5,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2264DC",
	},
	date: {
		fontSize: 14,
		color: "#666",
	},
	sub: {
		fontSize: 14,
		color: "#666",
	},
	time: {
		fontSize: 14,
		color: "#666",
	},
	type: {
		fontSize: 14,
		color: "#FFBF18",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 2,
	},
});

export default memo(todoCard);
