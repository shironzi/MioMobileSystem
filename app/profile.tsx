import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const profile = () => {
	const router = useRouter();

	const { biography, name, photo_url } = useLocalSearchParams<{
		biography: string;
		name: string;
		photo_url: string;
	}>();

	HeaderConfig("Profile");

	// console.log(photo_url);

	return (
		<View style={styles.container}>
			<View style={styles.cardContainer}>
				{/* <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text> */}
				<View style={styles.profile}>
					<View style={{ borderWidth: 1, borderRadius: 360, padding: 5 }}>
						<Image
							source={
								photo_url
									? { uri: photo_url }
									: require("@/assets/images/default_profile.png")
							}
							style={{
								width: 80,
								height: 80,
							}}
							resizeMode="contain"
						/>
					</View>
				</View>
				<View style={styles.cardContent}>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.sectionTitle}>Biography</Text>
					<Text style={styles.bibliography}>
						{biography ?? "Tell something about yourself..."}
					</Text>
					{/*<Text style={styles.sectionTitle}>Contact</Text>*/}
					{/*<Text style={styles.contact}>{data.contact}</Text>*/}
					{/*<Text style={styles.sectionTitle}>Social Links</Text>*/}
					{/*<Text style={styles.socialLink}>{data.socialLink}</Text>*/}
				</View>
				<TouchableOpacity
					style={[globalStyles.submitButton, { width: "100%" }]}
					onPress={() =>
						router.push({
							pathname: "/edit",
							params: {
								name: name,
								photo_url: photo_url,
								biography: biography,
							},
						})
					}
				>
					<Text style={globalStyles.submitButtonText}>Edit Profile</Text>
				</TouchableOpacity>
			</View>
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
		backgroundColor: "#ff",
		borderWidth: 1,
		borderColor: "#ddd",
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 10,
		marginBottom: 15,
	},
	cardContent: {
		flexDirection: "column",
		alignItems: "flex-start",
	},
	name: {
		width: "100%",
		textAlign: "center",
		fontSize: 20,
		fontWeight: 500,
		color: "#000",
		marginTop: 20,
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 500,
		color: "#000",
		marginBottom: 10,
	},
	bibliography: {
		fontSize: 16,
		color: "#000",
		fontWeight: 300,
		textAlign: "left",
		lineHeight: 24,
		marginBottom: 15,
	},
	contact: {
		fontSize: 16,
		color: "#000",
		marginBottom: 15,
	},
	socialLink: {
		fontSize: 16,
		color: "#000",
		marginBottom: 15,
	},
	button: {
		backgroundColor: "#FFBF18",
		padding: 10,
		borderRadius: 50,
		marginTop: 10,
		alignItems: "center",
		// elevation: 5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},

	iconWrapper: {
		borderRadius: 180,
		marginTop: -32,
		marginLeft: 70,
		backgroundColor: "#fff",
		padding: 3,
	},
	profilePic: {
		width: 125,
		height: 125,
		marginTop: 20,
		borderRadius: 180,
		borderWidth: 3,
		borderColor: "#fff",
	},
	profile: {
		alignItems: "center",
		width: 105,
		marginHorizontal: "auto",
	},
	pencil: {
		textAlign: "center",
		padding: 5,
		width: 25,
		height: 25,
		borderRadius: 180,
		backgroundColor: "#FFBF18",
	},
});

export default memo(profile);
