import HeaderConfig from "@/utils/HeaderConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const auditoryTrainingExercise = () => {
	const router = useRouter();

	HeaderConfig("Auditory Exercises");

	const { subjectId, role } = useLocalSearchParams<{
		subjectId: string;
		role: string;
	}>();

	const handleAdd = () => {
		router.push({
			pathname:
				"/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity",
			params: { subjectId: subjectId },
		});
	};

	return (
		<View style={{ backgroundColor: "#fff", flex: 1 }}>
			<Image
				source={require("@/assets/actCard/audDev.png")}
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
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname: "/subject/(exercises)/level",
						params: {
							subjectId: subjectId,
							activity_type: "bingo",
							category: "auditory",
							role: role,
						},
					})
				}
			>
				<Image
					source={require("@/assets/actCard/piddie.png")}
					style={[styles.actSub, { marginVertical: -5 }]}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname: "/subject/(exercises)/level",
						params: {
							subjectId: subjectId,
							activity_type: "bingo",
							category: "auditory",
							role: role,
						},
					})
				}
			>
				<Image
					source={require("@/assets/actCard/match.png")}
					style={[styles.actSub, { marginVertical: -5 }]}
				/>
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
						<Text style={styles.addText}>Add Auditory Exercises</Text>
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
	},
	actSub: {
		marginTop: 15,
		margin: 20,
		height: 110,
		width: 350,
	},
	addButton: {
		// position: "absolute",
		backgroundColor: "#f5f5f5",
		borderColor: "#aaa",
		borderWidth: 2,
		borderRadius: 20,
		borderStyle: "dashed",
		margin: 30,
		// bottom: -10,
		bottom: -150,
		height: 60,
	},
	addText: {
		color: "#aaa",
		fontWeight: 500,
		marginHorizontal: 10,
	},
});

export default memo(auditoryTrainingExercise);
