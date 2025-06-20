import React, { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface BingoCardProps {
	image: any;
	isMatched: boolean;
	onPress: () => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ image, isMatched, onPress }) => {
	return (
		<TouchableOpacity style={styles.card} onPress={onPress}>
			<Image
				source={{ uri: image }}
				style={styles.image}
				resizeMode="contain"
			/>
			{isMatched && (
				<View style={styles.overlay}>
					<Image
						source={require("@/assets/face/yellow.png")}
						style={{ width: 50, height: 50 }}
					/>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		width: "30%",
		height: 90,
		padding: 10,
		borderRadius: 20,
		borderColor: "#ddd",
		borderWidth: 1,
		marginTop: 5,
		// marginVertical: 20,
		// backgroundColor: "#fff",
		// elevation: 5,
		margin: 5,
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 15,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.4)",
		borderRadius: 20,
	},
});

export default memo(BingoCard);
