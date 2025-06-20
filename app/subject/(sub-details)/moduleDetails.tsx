import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const data = [
	{
		id: 1,
		title: "Module 1",
		desc: "Lorem ipsum dolor sit amet consectetur adipisice elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
	},
];

const moduleDetails = () => {
	HeaderConfig("Module");

	return (
		<View style={styles.container}>
			{data.map((item) => (
				<View key={item.id} style={styles.cardContainer}>
					<View style={styles.cardContent}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.description}>{item.desc}</Text>
					</View>
					<TouchableOpacity
						style={[
							globalStyles.submitButton,
							{
								alignItems: "center",
								flexDirection: "row",
								justifyContent: "space-around",
								// marginHorizontal: 10,
							},
						]}
					>
						<MaterialIcons
							name="download"
							size={20}
							color="#fff"
							style={{ left: 6 }}
						/>
						<Text style={[globalStyles.submitButtonText, { left: -12 }]}>
							Module 1.pdf
						</Text>
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 10,
	},
	cardContainer: {
		padding: 20,
		margin: 10,
		borderRadius: 20,
		borderColor: "#ddd",
		borderWidth: 1,
		backgroundColor: "#fff",
		// elevation: 5,
	},
	cardContent: {
		flexDirection: "column",
		alignItems: "flex-start",
		marginVertical: 5,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2264dc",
		marginBottom: 15,
	},
	description: {
		fontSize: 14,
		color: "#000",
		textAlign: "justify",
		lineHeight: 20,
		width: "100%",
		marginBottom: 10,
		fontWeight: 300,
	},
});

export default memo(moduleDetails);
