import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
	uri: string;
	name: string;
	mimeType?: string;
}

const ImageUpload = (props: {
	handleFiles: (file: FileInfo) => void;
	handleImageRemove: () => void;
	imageUri: FileInfo | null;
	image_path: string | null;
	isError: boolean;
	showPreview: boolean;
	index: number;
}) => {
	const [file, setFile] = useState<FileInfo | null>(null);

	const handleFileUpload = async () => {
		const res = await DocumentPicker.getDocumentAsync({
			type: ["image/*"],
			copyToCacheDirectory: true,
		});

		if (!res.canceled) {
			const { uri, name, mimeType } = res.assets[0];
			setFile({ uri, name, mimeType });
		}
	};

	useEffect(() => {
		if (file) {
			props.handleFiles(file);
		}
	}, [file]);

	console.log(props.isError);

	return (
		<View style={{ rowGap: 18 }}>
			<View style={{ paddingVertical: 9, rowGap: 18 }}>
				{props.imageUri !== null || props.image_path ? (
					<View style={[styles.fileRow]}>
						{props.showPreview ? (
							<View>
								<Image
									source={
										props.image_path
											? { uri: props.image_path }
											: props.imageUri?.uri
												? { uri: props.imageUri?.uri }
												: undefined
									}
									style={styles.imageStyle}
									contentFit="contain"
								/>
								<View style={styles.fileSettings}>
									<TouchableOpacity
										onPress={handleFileUpload}
										style={styles.fileUpload}
									>
										<MaterialIcons name="edit" size={24} color="#FFBF18" />
										<Text style={{ color: "#FFBF18", fontWeight: 500 }}>
											Edit
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={props.handleImageRemove}
										style={styles.fileUpload}
									>
										<AntDesign name="close" size={24} color="#db4141" />
										<Text style={{ color: "#db4141", fontWeight: 500 }}>
											Delete
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : (
							<View style={styles.textImage}>
								<Text
									numberOfLines={1}
									ellipsizeMode="tail"
									style={{ flex: 1 }}
								>
									{props.index + 1}. {props.imageUri?.name ?? "Unnamed file"}
								</Text>
								<TouchableOpacity
									onPress={props.handleImageRemove}
									style={[styles.fileUpload]}
								>
									<AntDesign name="close" size={20} color="#ddd" />
								</TouchableOpacity>
							</View>
						)}
					</View>
				) : (
					<View>
						<TouchableOpacity
							style={[
								styles.addFileRow,
								props.isError
									? { borderColor: "#db4141" }
									: { borderColor: "#ffbf18" },
							]}
							onPress={handleFileUpload}
						>
							<FontAwesome name="image" size={24} color="#FFBF18" />
							<Text style={styles.addFileText}>
								Browse files to upload image
							</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity
              onPress={props.handleImageRemove}
              style={[styles.fileUpload, { marginHorizontal: "auto" }]}
            >
              <AntDesign name="close" size={24} color="#db4141" />
              <Text style={{ color: "#db4141", fontWeight: 500 }}>Remove</Text>
            </TouchableOpacity> */}
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	uploadHeader: {
		backgroundColor: "#434242",
		paddingVertical: 9,
		paddingHorizontal: 26,
	},
	uploadHeaderText: {
		color: "#fff",
	},
	fileRow: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 40,
	},
	fileUpload: {
		padding: 9,
		width: 100,
		alignItems: "center",
		flexDirection: "row",
		columnGap: 10,
	},
	filename: {
		flex: 1,
		color: "#333",
	},
	addFileRow: {
		flexDirection: "column",
		alignItems: "center",
		borderWidth: 2.5,
		borderStyle: "dashed",
		padding: 15,
		width: "100%",
		borderRadius: 20,
		rowGap: 10,
	},
	addFileText: {
		color: "#1F1F1F68",
		fontSize: 16,
		fontStyle: "italic",
		lineHeight: 28,
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	textImage: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "125%",
		marginVertical: -10,
	},
	fileSettings: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignSelf: "center",
		width: "100%",
	},
	imageStyle: { width: 150, height: 150, alignSelf: "center" },
});

export default memo(ImageUpload);
