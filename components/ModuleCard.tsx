import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ModuleCard = (props: { title: string; index: number }) => {
	const router = useRouter();

	return (
		<TouchableOpacity
			onPress={() => router.navigate("/subject/(sub-details)/moduleDetails")}
			style={styles.touchableOpacity}
		>
			<View style={styles.cardContainer}>
				<View style={styles.cardContent}>
					<View style={styles.yellowBulletin} />
					<View style={styles.titleContainer}>
						<Text style={styles.title} numberOfLines={3}>
							[Module {props.index + 1}] - {props.title}
						</Text>
					</View>
					{/* <View style={styles.icons}>
            <TouchableOpacity>
              <Entypo
                name="edit"
                size={15}
                color="#aaa"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="trash" size={15} color="#aaa" />
            </TouchableOpacity>
          </View> */}
					<FontAwesome6
						name="arrow-right-long"
						size={15}
						color="#1f1f1f"
						style={{ left: -10 }}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	touchableOpacity: {
		backgroundColor: "#fff",
		// padding: 15,
		borderRadius: 20,
		borderColor: "#ddd",
		borderWidth: 1,
		margin: 10,
	},
	cardContainer: {
		borderRadius: 10,
		paddingVertical: 14,
		paddingHorizontal: 12,
		margin: 0,
		borderWidth: 0,
		shadowColor: "transparent",
	},
	cardContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	yellowBulletin: {
		width: "1.5%",
		height: 30,
		backgroundColor: "#FFBF18",
		borderRadius: 3,
		marginRight: 14,
		left: 3,
	},
	titleContainer: {
		flex: 1,
		paddingLeft: 10,
	},
	title: {
		fontSize: 14,
		fontWeight: "500",
		color: "#000",
	},
	icons: {
		flexDirection: "row",
		marginLeft: 5,
		marginRight: 5,
	},
});

export default memo(ModuleCard);
