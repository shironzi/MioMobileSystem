import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
	uri: string;
	name: string;
	mimeType?: string;
}

interface Errors {
	index: number;
}

const FileUpload = (props: {
	handleFiles: (file: FileInfo[]) => void;
	fileTypes?: string[];
}) => {
	const [files, setFiles] = useState<FileInfo[]>([]);
	const [fileErrors, setFileErrors] = useState<Errors[]>([]);

	const handleAddFile = () => {
		const errors: Errors[] = [];

		files.forEach((file, index) => {
			if (!file.uri) {
				errors.push({ index });
			}
		});

		if (errors.length > 0) {
			setFileErrors(errors);
			return;
		}

		setFiles((prev) => [...prev, { uri: "", name: "", mimeType: undefined }]);
	};

	const handleFileUpload = async (index: number) => {
		const res = await DocumentPicker.getDocumentAsync({
			type: ["image/*", "application/*"],
			copyToCacheDirectory: true,
		});

		if (!res.canceled) {
			const { uri, name, mimeType } = res.assets[0];
			setFiles((prev) =>
				prev.map((f, i) => (i === index ? { uri, name, mimeType } : f))
			);
		}

		setFileErrors((prev) => prev.filter((err) => err.index !== index));
	};

	const handleRemoveFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	useEffect(() => {
		props.handleFiles(files);
	}, [files]);

	return (
		<View style={{ rowGap: 18 }}>
			<View style={{ paddingVertical: 9, rowGap: 18 }}>
				{files.map((file, idx) => (
					<View key={idx} style={styles.fileRow}>
						<View style={styles.fileInfoContainer}>
							<TouchableOpacity
								onPress={() => handleFileUpload(idx)}
								style={[
									styles.fileUpload,
									fileErrors.some((err) => err.index === idx)
										? { borderColor: "#db4141" }
										: { borderColor: "rgba(0, 0, 0, 0.10)" },
								]}
							>
								<Text>Choose File</Text>
							</TouchableOpacity>
							<Text
								style={[
									styles.filename,
									fileErrors.some((err) => err.index === idx) && {
										color: "#db4141",
									},
								]}
							>
								{file.name || "No file chosen"}
							</Text>
						</View>

						{file.name ? (
							<TouchableOpacity
								style={{ right: 10 }}
								onPress={() => handleRemoveFile(idx)}
							>
								<AntDesign
									name="close"
									size={20}
									color="#aaa"
									style={{ left: 25, top: -15 }}
								/>
							</TouchableOpacity>
						) : null}
					</View>
				))}

				<TouchableOpacity style={styles.addFileRow} onPress={handleAddFile}>
					<View
						style={{
							flexDirection: "row",
							marginLeft: 10,
							left: -40,
							marginTop: -150,
						}}
					>
						<MaterialIcons name="add" size={20} color="#FFBF18" />
						<Text style={styles.addFileText}>Add File</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	uploadHeader: {
		width: "100%",
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
		justifyContent: "space-between",
		marginTop: 20,
		marginBottom: -15,
	},
	fileInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		columnGap: 10,
		marginTop: -5,
		bottom: 15,
	},
	fileUpload: {
		padding: 9,
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: "#ddd",
		width: 100,
		alignItems: "center",

		left: -15,
	},
	filename: {
		flex: 1,
		color: "#333",
	},
	addFileRow: {
		flexDirection: "row",
		alignItems: "center",
		left: 10,
		padding: 5,
		marginTop: 80,
		marginBottom: 10,
	},
	addFileText: {
		color: "#FFBF18",
		fontSize: 16,
		marginLeft: 5,
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
});

export default memo(FileUpload);
