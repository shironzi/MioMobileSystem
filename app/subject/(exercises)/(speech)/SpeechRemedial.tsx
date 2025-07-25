import HeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const SpeechRemedial = () => {
	HeaderConfig("Remedial");

	const { subjectId, activity_type, remedialPhoneme, remedialId } =
		useLocalSearchParams<{
			subjectId: string;
			activity_type: string;
			remedialPhoneme: string;
			remedialId: string;
		}>();

	const parsedPhoneme: string[] = remedialPhoneme
		? JSON.parse(remedialPhoneme as string)
		: [];

	const handleRoute = (phoneme: string) => {
		router.push({
			pathname: "/subject/(exercises)/(speech)/MicrophoneTest",
			params: {
				subjectId: subjectId,
				activity_type: activity_type,
				phoneme: phoneme,
				activityId: remedialId,
				remedial: "true",
			},
		});
	};

	return (
		<ScrollView style={{ backgroundColor: "#fff", height: "100%" }}>
			<View style={styles.subLevel}>
				<MaterialIcons
					name="hexagon"
					size={40}
					color="#5389EB"
					style={styles.shape1}
				/>
				<Text style={styles.try}>TAKE THE</Text>
				<Text style={styles.name}>Remedial Mode</Text>
				<MaterialIcons
					name="hexagon"
					size={70}
					color="#5389EB"
					style={styles.shape2}
				/>
			</View>

			{parsedPhoneme?.map((item, index) => (
				<TouchableOpacity
					style={styles.card}
					key={index}
					onPress={() => handleRoute(item)}
				>
					<View
						style={{
							flexDirection: "row",
							top: 25,
						}}
					>
						<FontAwesome
							name="circle"
							size={13}
							// color={props.isTaken ?  : "#aaa"}
							color={"#5389EB"}
							style={styles.icon}
						/>
						<Text style={[styles.cardNumber, { maxWidth: 225 }]}>
							/{item}/ - Assessment {index + 1}
						</Text>
					</View>
					<View style={[styles.play, { backgroundColor: "#5389EB" }]}>
						<Text
							style={{
								color: "#fff",
								alignSelf: "center",
								top: 6,
								fontWeight: "300",
								fontSize: 12,
							}}
						>
							Play!
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	subLevel: {
		margin: 20,
		borderWidth: 1,
		borderRadius: 20,
		height: 100,
		overflow: "hidden",
		position: "relative",
		backgroundColor: "#ddeaff",
		borderColor: "#5389EB",
	},
	shape1: {
		transform: [{ rotate: "-15deg" }],
		left: 20,
		top: -15,
	},
	shape2: {
		position: "absolute",
		transform: [{ rotate: "20deg" }],
		left: 250,
		top: 45,
	},
	try: {
		fontSize: 12,
		fontWeight: 400,
		left: 90,
		top: -12,
	},
	name: {
		fontSize: 16,
		fontWeight: 500,
		left: 90,
		top: -10,
	},
	card: {
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 20,
		marginHorizontal: 20,
		marginVertical: 10,
		top: -15,
	},
	icon: {
		alignSelf: "center",
		marginHorizontal: 20,
		width: 50,
	},
	play: {
		height: 30,
		width: "30%",
		alignSelf: "flex-end",
		borderTopLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginTop: 18,
	},
	cardNumber: {
		fontSize: 14,
		color: "#000",
		fontWeight: "400",
		flexWrap: "wrap",
		left: -50,
	},
});

export default SpeechRemedial;
