import HeaderConfig from "@/utils/HeaderConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LanguageTrainingExercise = () => {
	const router = useRouter();
	HeaderConfig("Language Exercises");

	const { subjectId, role } = useLocalSearchParams<{
		subjectId: string;
		role: string;
	}>();

	const handleFillRoute = () => {
		router.push({
			pathname: "/subject/(exercises)/level",
			params: {
				subjectId: subjectId,
				activity_type: "fill",
				category: "language",
				role: role,
			},
		});
	};

	const handleHomonymsRoute = () => {
		router.push({
			pathname: "/subject/(exercises)/level",
			params: {
				subjectId: subjectId,
				activity_type: "homonyms",
				category: "language",
				role: role,
			},
		});
	};

	const handleAdd = () => {
		router.push({
			pathname: "/subject/ManageActivity/AddLanguageActivity",
			params: { subjectId: subjectId },
		});
	};

	return (
		<View style={{ backgroundColor: "#fff", flex: 1 }}>
			<Image
				source={require("@/assets/actCard/lanDev.png")}
				style={styles.actHeader}
			/>
			<Text
				style={{
					color: "#2264dc",
					fontWeight: 500,
					marginHorizontal: 30,
					marginVertical: -5,
				}}
			>
				Explore your exercises!
			</Text>
			<TouchableOpacity style={styles.actSub} onPress={handleFillRoute}>
				<Image
					source={require("@/assets/cardImg/fillImg.png")}
					style={styles.img}
					resizeMode="contain"
				/>
				<Text style={[styles.practice]}>PRACTICE WITH</Text>
				<Text style={[styles.actName]}>Fill in the Blanks</Text>
				<View style={styles.choose}>
					<Text
						style={{
							color: "#fff",
							alignSelf: "center",
							top: 10,
							fontWeight: 300,
							fontSize: 12,
						}}
					>
						Choose this
					</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.actSub, { marginTop: -5 }]}
				onPress={handleHomonymsRoute}
			>
				<Image
					source={require("@/assets/cardImg/homImg.png")}
					style={styles.img}
					resizeMode="contain"
				/>
				<Text style={[styles.practice]}>PRACTICE WITH</Text>
				<Text style={[styles.actName]}>Homonyms</Text>
				<View style={styles.choose}>
					<Text
						style={{
							color: "#fff",
							alignSelf: "center",
							top: 10,
							fontWeight: 300,
							fontSize: 12,
						}}
					>
						Choose this
					</Text>
				</View>
			</TouchableOpacity>

			{role === "teacher" && (
				<TouchableOpacity style={styles.addButton} onPress={handleAdd}>
					<View
						style={{
							top: 20,
							alignSelf: "center",
							flexDirection: "row",
						}}
					>
						<Ionicons name="add-circle" size={20} color="#aaa" />
						<Text style={styles.addText}>Add Language Exercises</Text>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	actHeader: {
		margin: 20,
		height: 170,
		width: 350,
		// left: -10,
		// top: -10,
	},
	actSub: {
		paddingTop: 10,
		marginTop: 20,
		margin: 20,
		borderColor: "#ddd",
		borderRadius: 20,
		borderWidth: 1,
	},
	img: {
		left: 10,
		margin: 20,
		width: 50,
		height: 50,
	},
	practice: {
		fontSize: 10,
		fontWeight: 300,
		left: 100,
		top: -62,
	},
	actName: {
		fontSize: 14,
		fontWeight: 500,
		left: 100,
		top: -60,
		marginBottom: -30,
	},
	choose: {
		backgroundColor: "#2264dc",
		height: 35,
		width: "30%",
		alignSelf: "flex-end",
		borderTopLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginTop: -30,
	},
	addButton: {
		position: "absolute",
		left: -8,
		width: "88%",
		backgroundColor: "#f5f5f5",
		borderColor: "#ddd",
		borderWidth: 2,
		borderRadius: 20,
		borderStyle: "dashed",
		margin: 30,
		bottom: 0,
		height: 60,
	},
	addText: {
		color: "#aaa",
		fontWeight: 500,
		marginHorizontal: 10,
	},
});

export default memo(LanguageTrainingExercise);
